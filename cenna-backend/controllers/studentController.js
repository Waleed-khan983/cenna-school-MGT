import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import User from "../models/User.js";
import Student from "../models/Student.js";
import Parent from "../models/parent.js";
import Class from "../models/class.js";

import { getPagination, generateTempPassword } from "../utils/helpers.js";
import { extractCloudinaryPublicId, destroyUploadedAsset } from "../utils/documentAccess.js";
import { assertTeacherAssignedToClass } from "../utils/ownership.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Admin, Teacher
// @desc    Get all students
// @route   GET /api/students
// @access  Admin, Accountant, Operator
export const getStudents = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 20, 1);
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.class) {
    filter.class = req.query.class;
  }

  if (req.query.section) {
    filter.section = req.query.section;
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  if (req.query.search && req.query.search.trim()) {
    const search = req.query.search.trim();

    const users = await User.find({
      role: "student",
      name: {
        $regex: search,
        $options: "i",
      },
    }).select("_id");

    filter.$or = [
      {
        user: {
          $in: users.map((u) => u._id),
        },
      },
      {
        admissionNo: {
          $regex: search,
          $options: "i",
        },
      },
      {
        rollNumber: {
          $regex: search,
          $options: "i",
        },
      },
      {
        fatherName: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const total = await Student.countDocuments(filter);

  const students = await Student.find(filter)
    .populate("user", "name email phone avatar isActive")
    .populate("class", "name section displayName room")
    .populate("parent")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    students,
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Admin, Teacher, Parent, Student
export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate("user", "name email phone avatar isActive")
    .populate("parent")
    .populate({
      path: "class",
      select: "name section displayName room classTeacher",
      populate: {
        path: "classTeacher",
        populate: { path: "user", select: "name email phone" },
      },
    });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (req.user.role === "student") {
    const myProfile = await Student.findOne({ user: req.user.id });

    if (!myProfile || myProfile._id.toString() !== student._id.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }
  }

  if (req.user.role === "teacher") {
    await assertTeacherAssignedToClass(req.user._id, student.class?._id || student.class);
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// @desc    Create student
// @route   POST /api/students
// @access  Admin
export const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,

    admissionNo,
    rollNumber,
    fatherName,
    motherName,
    dob,
    gender,
    religion,
    nationality,
    bForm,
    address,
    classId,
    section,
    parentId,
    prevSchool,
    prevMarks,
  } = req.body;

  if (!name || !admissionNo || !fatherName || !classId) {
    res.status(400);
    throw new Error(
      "Name, admission number, father name, and class are required",
    );
  }

  const selectedClass = await Class.findById(classId);

  if (!selectedClass) {
    res.status(404);
    throw new Error("Selected class not found");
  }

  const existingStudent = await Student.findOne({ admissionNo });

  if (existingStudent) {
    res.status(400);
    throw new Error("Admission number already exists");
  }

  const generatedEmail =
    email ||
    `${admissionNo}${name.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
  const existingUser = await User.findOne({ email: generatedEmail });

  if (existingUser) {
    res.status(400);
    throw new Error("Student user already exists");
  }

  if (parentId) {
    const parentExists = await Parent.findById(parentId);

    if (!parentExists) {
      res.status(404);
      throw new Error("Selected parent not found");
    }
  }

  const isTempPassword = !password;
  const finalPassword = password || generateTempPassword();

  // User + Student (+ the Parent link, if any) must all succeed together.
  // The old manual "delete the User in catch" rollback only covered a
  // failure AFTER the User was created — a failure after the Student was
  // created (e.g. the Parent update) left an orphaned Student with a
  // dangling user reference. One transaction covers every stage.
  const session = await mongoose.startSession();
  let createdStudentId;

  try {
    await session.withTransaction(async () => {
      const [user] = await User.create(
        [
          {
            name,
            email: generatedEmail,
            password: finalPassword,
            role: "student",
            phone,
            mustChangePassword: isTempPassword,
          },
        ],
        { session },
      );

      const [student] = await Student.create(
        [
          {
            user: user._id,
            admissionNo,
            rollNumber,
            class: classId,
            section: section || selectedClass.section || "A",
            fatherName,
            motherName,
            dob,
            gender,
            religion,
            nationality,
            bForm,
            address,
            parent: parentId || undefined,
            prevSchool,
            prevMarks,
          },
        ],
        { session },
      );

      if (parentId) {
        const updatedParent = await Parent.findByIdAndUpdate(
          parentId,
          { $addToSet: { children: student._id } },
          { session, new: true },
        );

        if (!updatedParent) {
          const err = new Error("Selected parent not found");
          err.statusCode = 404;
          throw err;
        }
      }

      createdStudentId = student._id;
    });
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      const label =
        field === "email"
          ? "Email"
          : field === "admissionNo"
            ? "Admission number"
            : field;

      res.status(400);
      throw new Error(`${label} already exists`);
    }

    throw error;
  } finally {
    await session.endSession();
  }

  const populated = await Student.findById(createdStudentId)
    .populate("user", "name email phone avatar isActive")
    .populate("class", "name section displayName room")
    .populate("parent");

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    student: populated,
    // Only returned once, after the transaction has committed, and only
    // when no password was supplied — it is never stored in plaintext and
    // can't be retrieved again.
    ...(isTempPassword && { temporaryPassword: finalPassword }),
  });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Admin
export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const {
    name,
    email,
    phone,

    admissionNo,
    rollNumber,
    fatherName,
    motherName,
    dob,
    gender,
    religion,
    nationality,
    bForm,
    address,
    classId,
    section,
    parentId,
    prevSchool,
    prevMarks,
    isActive,
  } = req.body;

  if (admissionNo && admissionNo !== student.admissionNo) {
    const existingStudent = await Student.findOne({ admissionNo });

    if (existingStudent) {
      res.status(400);
      throw new Error("Admission number already exists");
    }
  }

  if (classId) {
    const selectedClass = await Class.findById(classId);

    if (!selectedClass) {
      res.status(404);
      throw new Error("Selected class not found");
    }
  }

  if (email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: student.user },
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
    await User.findByIdAndUpdate(student.user, userUpdate, {
      runValidators: true,
    });
  }

  const studentUpdate = {};

  if (admissionNo !== undefined) studentUpdate.admissionNo = admissionNo;
  if (rollNumber !== undefined) studentUpdate.rollNumber = rollNumber;
  if (fatherName !== undefined) studentUpdate.fatherName = fatherName;
  if (motherName !== undefined) studentUpdate.motherName = motherName;
  if (dob !== undefined) studentUpdate.dob = dob;
  if (gender !== undefined) studentUpdate.gender = gender;
  if (religion !== undefined) studentUpdate.religion = religion;
  if (nationality !== undefined) studentUpdate.nationality = nationality;
  if (bForm !== undefined) studentUpdate.bForm = bForm;
  if (address !== undefined) studentUpdate.address = address;
  if (classId !== undefined) studentUpdate.class = classId;
  if (section !== undefined) studentUpdate.section = section;
  if (parentId !== undefined) studentUpdate.parent = parentId || undefined;
  if (prevSchool !== undefined) studentUpdate.prevSchool = prevSchool;
  if (prevMarks !== undefined) studentUpdate.prevMarks = prevMarks;
  if (isActive !== undefined) studentUpdate.isActive = isActive;

  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    studentUpdate,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("user", "name email phone avatar isActive")
    .populate("class", "name section displayName room")
    .populate("parent");

  if (parentId) {
    await Parent.findByIdAndUpdate(parentId, {
      $addToSet: { children: updated._id },
    });
  }

  res.status(200).json({
    success: true,
    message: "Student updated",
    student: updated,
  });
});

// @desc    Update my profile image
// @route   PUT /api/students/me/avatar
// @access  Student
export const updateMyAvatar = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  // multer-storage-cloudinary already uploaded the new image (see
  // routes/student.Routes.js — uploadImage) by the time this handler runs;
  // .path is the secure_url, same convention gallery/news use.
  const avatarPath = req.file.path;

  const previousUser = await User.findById(req.user.id).select("avatar");

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarPath },
    { new: true },
  );

  // Only delete the old avatar once the new one is confirmed saved — never
  // the other way around. Silently skipped for a legacy "/uploads/..."
  // path, which was never a Cloudinary asset to begin with.
  const previousPublicId = extractCloudinaryPublicId(previousUser?.avatar);

  if (previousPublicId) {
    await destroyUploadedAsset(previousPublicId, "image");
  }

  const updatedStudent = await Student.findOne({ user: req.user.id })
    .populate("user", "name email phone avatar")
    .populate("class", "name section displayName room")
    .populate("parent");

  res.status(200).json({
    success: true,
    message: "Profile image updated",
    student: updatedStudent,
  });
});
// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Admin
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (student.parent) {
    await Parent.findByIdAndUpdate(student.parent, {
      $pull: { children: student._id },
    });
  }

  await User.findByIdAndDelete(student.user);
  await Student.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});

// @desc    Get my profile
// @route   GET /api/students/me
// @access  Student
export const getMyProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id })
    .populate("user", "name email phone avatar")
    .populate("class", "name section displayName room classTeacher")
    .populate("parent");

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// @desc    Get students by class
// @route   GET /api/students/class/:classId
// @access  Admin, Teacher
export const getStudentsByClass = asyncHandler(async (req, res) => {
  // Admin/operator get their intended school-wide access unchanged. A
  // teacher must actually be assigned to this class via ClassSubject —
  // authorize("teacher") only confirms their role, not which class(es)
  // they teach, so the classId from the URL can't be trusted on its own.
  if (req.user.role === "teacher") {
    await assertTeacherAssignedToClass(req.user._id, req.params.classId);
  } else {
    const klass = await Class.findById(req.params.classId);

    if (!klass) {
      res.status(404);
      throw new Error("Class not found");
    }
  }

  const students = await Student.find({
    class: req.params.classId,
    isActive: true,
  })
    .populate("user", "name email phone avatar")
    .populate("class", "displayName name section")
    .sort({ rollNumber: 1 });

  res.status(200).json({
    success: true,
    count: students.length,
    students,
  });
});

export const searchStudentsForFees = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim();

  if (!query || query.length < 2) {
    return res.status(200).json({
      success: true,
      students: [],
    });
  }

  const students = await Student.find({
    isActive: true,
    $or: [
      { admissionNo: { $regex: query, $options: "i" } },
      { fatherName: { $regex: query, $options: "i" } },
    ],
  })
    .populate("user", "name phone")
    .populate("class", "displayName name section")
    .limit(10);

  const nameMatchedStudents = await Student.find({
    isActive: true,
  })
    .populate({
      path: "user",
      match: {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
        ],
      },
      select: "name phone",
    })
    .populate("class", "displayName name section")
    .limit(10);

  const merged = [...students, ...nameMatchedStudents]
    .filter((student) => student.user)
    .filter(
      (student, index, self) =>
        index ===
        self.findIndex((item) => String(item._id) === String(student._id)),
    )
    .slice(0, 10);

  res.status(200).json({
    success: true,
    students: merged,
  });
});

// @desc    Promote one student
// @route   PUT /api/students/:id/promote
// @access  Admin
export const promoteStudent = asyncHandler(async (req, res) => {
  const { toClassId, toSection, academicYear, remarks } = req.body;

  if (!toClassId || !academicYear) {
    res.status(400);
    throw new Error("New class and academic year are required");
  }

  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (!student.isActive) {
    res.status(400);
    throw new Error("Inactive students cannot be promoted");
  }

  const toClass = await Class.findById(toClassId);

  if (!toClass) {
    res.status(404);
    throw new Error("Target class not found");
  }

  if (String(student.class) === String(toClassId)) {
    res.status(400);
    throw new Error("Student is already in this class");
  }

  const alreadyPromotedForYear = student.promotionHistory?.some(
    (item) => item.academicYear === academicYear,
  );

  if (alreadyPromotedForYear) {
    res.status(400);
    throw new Error(`Student has already been promoted for ${academicYear}`);
  }

  const fromClass = student.class;
  const fromSection = student.section;

  student.promotionHistory.push({
    fromClass,
    toClass: toClassId,
    fromSection,
    toSection: toSection || toClass.section || "A",
    academicYear,
    promotedBy: req.user._id,
    remarks,
  });

  student.class = toClassId;
  student.section = toSection || toClass.section || "A";
  student.academicYear = academicYear;
  student.promotionStatus = "promoted";

  await student.save();

  const updatedStudent = await Student.findById(student._id)
    .populate("user", "name email phone avatar isActive")
    .populate("class", "name section displayName room")
    .populate("parent")
    .populate("promotionHistory.fromClass", "name section displayName")
    .populate("promotionHistory.toClass", "name section displayName")
    .populate("promotionHistory.promotedBy", "name role");

  res.status(200).json({
    success: true,
    message: "Student promoted successfully",
    student: updatedStudent,
  });
});

// @desc    Promote full class
// @route   PUT /api/students/promote/bulk
// @access  Admin
export const promoteStudentsBulk = asyncHandler(async (req, res) => {
  const {
    fromClassId,
    toClassId,
    fromSection,
    toSection,
    academicYear,
    studentIds,
    remarks,
  } = req.body;

  if (!fromClassId || !toClassId || !academicYear) {
    res.status(400);
    throw new Error("From class, to class, and academic year are required");
  }

  if (String(fromClassId) === String(toClassId)) {
    res.status(400);
    throw new Error("From class and to class cannot be the same");
  }

  // studentIds omitted entirely means "promote the whole class/section" —
  // but an explicitly empty array means the caller selected nothing, which
  // must be rejected rather than silently falling back to the whole-class
  // behavior (an earlier `studentIds?.length ? ... : undefined` check
  // treated both cases identically, since `[].length` is falsy too, and
  // testing this batch caught it live-promoting an entire class).
  if (studentIds !== undefined && studentIds.length === 0) {
    res.status(400);
    throw new Error("No students selected for promotion");
  }

  // De-duplicate caller-supplied IDs up front so the same student can never
  // be processed twice in one batch (which would otherwise push two
  // promotionHistory entries for a single promotion).
  const uniqueStudentIds = studentIds?.length
    ? [...new Set(studentIds.map(String))]
    : undefined;

  // Every read that decides the batch and every write that applies it runs
  // inside one transaction: a genuine failure partway through (a bad
  // studentId, a validation error, a dropped connection) rolls back
  // everything already written in this attempt, instead of leaving some
  // students promoted and others not. Students skipped for a legitimate
  // business reason (already promoted this year) are NOT a failure — they
  // coexist with a successful commit of everyone else, same as before.
  const session = await mongoose.startSession();

  let promoted = [];
  let skipped = [];
  let totalFound = 0;

  try {
    await session.withTransaction(async () => {
      const fromClass = await Class.findById(fromClassId).session(session);
      const toClass = await Class.findById(toClassId).session(session);

      if (!fromClass || !toClass) {
        const err = new Error("From class or target class not found");
        err.statusCode = 404;
        throw err;
      }

      const filter = {
        class: fromClassId,
        isActive: true,
      };

      if (fromSection) {
        filter.section = fromSection;
      }

      if (uniqueStudentIds) {
        filter._id = { $in: uniqueStudentIds };
      }

      const students = await Student.find(filter).session(session);

      totalFound = students.length;

      if (!students.length) {
        const err = new Error("No active students found for promotion");
        err.statusCode = 404;
        throw err;
      }

      // withTransaction may retry this callback on a transient MongoDB
      // error — reset per attempt so a retry can't accumulate duplicate
      // entries from a previous (aborted) attempt.
      promoted = [];
      skipped = [];

      for (const student of students) {
        const alreadyPromotedForYear = student.promotionHistory?.some(
          (item) => item.academicYear === academicYear,
        );

        if (alreadyPromotedForYear) {
          skipped.push({
            studentId: student._id,
            admissionNo: student.admissionNo,
            reason: `Already promoted for ${academicYear}`,
          });

          continue;
        }

        student.promotionHistory.push({
          fromClass: student.class,
          toClass: toClassId,
          fromSection: student.section,
          toSection: toSection || toClass.section || "A",
          academicYear,
          promotedBy: req.user._id,
          remarks,
        });

        student.class = toClassId;
        student.section = toSection || toClass.section || "A";
        student.academicYear = academicYear;
        student.promotionStatus = "promoted";

        await student.save({ session });

        promoted.push({
          studentId: student._id,
          admissionNo: student.admissionNo,
        });
      }
    });
  } finally {
    await session.endSession();
  }

  // Only reachable if the transaction above committed — a thrown error
  // propagates to asyncHandler instead, so a rolled-back attempt can never
  // report success.
  res.status(200).json({
    success: true,
    message: "Bulk promotion completed",
    totalFound,
    promotedCount: promoted.length,
    skippedCount: skipped.length,
    promoted,
    skipped,
  });
});
