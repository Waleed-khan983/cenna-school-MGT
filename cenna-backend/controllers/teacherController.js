import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/User.js";
import Teacher from "../models/teacher.js";
import ClassSubject from "../models/ClassSubject.js";
import { getPagination, generateTempPassword } from "../utils/helpers.js";
import { getNextSequence } from "../utils/sequence.js";

const populateTeacherUser = {
  path: "user",
  select: "name email phone avatar isActive",
};

const getTeacherAssignments = async (teacherId) => {
  return await ClassSubject.find({
    teacher: teacherId,
    isActive: true,
  })
    .populate("class", "displayName name section room")
    .populate("subject", "name code maxMarks passMark isElective")
    .sort({ createdAt: -1 });
};

const attachAssignments = async (teacherDoc) => {
  if (!teacherDoc) return null;

  const teacher = teacherDoc.toObject();
  teacher.assignments = await getTeacherAssignments(teacher._id);

  return teacher;
};

// GET /teachers and GET /teachers/:id are open to the "teacher" role
// (colleague directory, e.g. so a class teacher can be shown), but that
// should never mean any teacher can read another's salary/CNIC/home
// address — payroll and personal-ID data. /teachers/me already covers
// self-service, so redact these fields for anyone who isn't admin/staff.
const redactSensitiveTeacherFields = (teacher, viewerRole) => {
  if (viewerRole === "admin" || !teacher) return teacher;

  const { salary, cnic, address, ...rest } = teacher;
  return rest;
};

export const createTeacher = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    qualification,
    designation,
    cnic,
    address,
    salary,
  } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const isTempPassword = !password;
  const finalPassword = password || generateTempPassword();

  // User + Teacher must both exist or neither does — a failure partway
  // through used to leave an orphaned User with no Teacher profile (see
  // Tier 4 report). Both writes now share one transaction.
  const session = await mongoose.startSession();
  let createdTeacherId;

  try {
    await session.withTransaction(async () => {
      const employeeSeq = await getNextSequence("teacherEmployeeId", session);
      const employeeId = `TCH-${String(employeeSeq).padStart(3, "0")}`;

      const [user] = await User.create(
        [
          {
            name,
            email,
            password: finalPassword,
            role: "teacher",
            phone,
            mustChangePassword: isTempPassword,
          },
        ],
        { session },
      );

      const [teacher] = await Teacher.create(
        [
          {
            user: user._id,
            employeeId,
            qualification,
            designation,
            cnic,
            address,
            salary,
            isActive: true,
          },
        ],
        { session },
      );

      createdTeacherId = teacher._id;
    });
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      const label =
        field === "email"
          ? "Email"
          : field === "employeeId"
            ? "Employee ID"
            : field;

      res.status(400);
      throw new Error(`${label} already exists`);
    }

    throw error;
  } finally {
    await session.endSession();
  }

  const populated = await Teacher.findById(createdTeacherId).populate(
    populateTeacherUser
  );

  const teacherWithAssignments = await attachAssignments(populated);

  res.status(201).json({
    success: true,
    message: "Teacher created",
    teacher: teacherWithAssignments,
    // Only returned once, after the transaction has committed, and only
    // when no password was supplied — it is never stored in plaintext and
    // can't be retrieved again. Never sent for a rolled-back attempt, since
    // we only reach this point if the transaction above succeeded.
    ...(isTempPassword && { temporaryPassword: finalPassword }),
  });
});

export const getTeachers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  if (req.query.search) {
    const users = await User.find({
      name: { $regex: req.query.search, $options: "i" },
      role: "teacher",
    }).select("_id");

    filter.user = { $in: users.map((user) => user._id) };
  }

  const total = await Teacher.countDocuments(filter);

  const teachers = await Teacher.find(filter)
    .populate(populateTeacherUser)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const teachersWithAssignments = await Promise.all(
    teachers.map((teacher) => attachAssignments(teacher))
  );

  const responseTeachers = teachersWithAssignments.map((teacher) =>
    redactSensitiveTeacherFields(teacher, req.user.role)
  );

  res.status(200).json({
    success: true,
    count: responseTeachers.length,
    total,
    page,
    teachers: responseTeachers,
  });
});

export const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate(
    populateTeacherUser
  );

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  const teacherWithAssignments = await attachAssignments(teacher);

  res.status(200).json({
    success: true,
    teacher: redactSensitiveTeacherFields(teacherWithAssignments, req.user.role),
  });
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  const {
    name,
    email,
    phone,
    qualification,
    designation,
    cnic,
    address,
    salary,
    isActive,
  } = req.body;

  if (email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: teacher.user },
    });

    if (existingUser) {
      res.status(400);
      throw new Error("Email already exists");
    }
  }

  const userUpdate = {};

  if (name !== undefined) userUpdate.name = name;
  if (email !== undefined) userUpdate.email = email;
  if (phone !== undefined) userUpdate.phone = phone;
  if (isActive !== undefined) userUpdate.isActive = isActive;

  if (Object.keys(userUpdate).length > 0) {
    await User.findByIdAndUpdate(teacher.user, userUpdate, {
      runValidators: true,
    });
  }

  const teacherUpdate = {};

  if (qualification !== undefined) teacherUpdate.qualification = qualification;
  if (designation !== undefined) teacherUpdate.designation = designation;
  if (cnic !== undefined) teacherUpdate.cnic = cnic;
  if (address !== undefined) teacherUpdate.address = address;
  if (salary !== undefined) teacherUpdate.salary = salary;
  if (isActive !== undefined) teacherUpdate.isActive = isActive;

  const updated = await Teacher.findByIdAndUpdate(
    req.params.id,
    teacherUpdate,
    {
      new: true,
      runValidators: true,
    }
  ).populate(populateTeacherUser);

  const teacherWithAssignments = await attachAssignments(updated);

  res.status(200).json({
    success: true,
    message: "Teacher updated",
    teacher: teacherWithAssignments,
  });
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  await ClassSubject.updateMany(
    { teacher: teacher._id },
    { isActive: false }
  );

  await User.findByIdAndDelete(teacher.user);
  await Teacher.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Teacher deleted",
  });
});

export const getMyTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({
    user: req.user._id,
  }).populate(populateTeacherUser);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher profile not found");
  }

  const teacherWithAssignments = await attachAssignments(teacher);

  res.status(200).json({
    success: true,
    teacher: teacherWithAssignments,
  });
});