import asyncHandler from "express-async-handler";

import User from "../models/User.js";
import Student from "../models/Student.js";
import Parent from "../models/parent.js";
import Class from "../models/class.js";

import { getPagination } from "../utils/helpers.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Admin, Teacher
export const getStudents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};

  if (req.query.class) filter.class = req.query.class;
  if (req.query.section) filter.section = req.query.section;

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  if (req.query.search) {
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
    throw new Error("Name, admission number, father name, and class are required");
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
    `${admissionNo}${name
      .toLowerCase()
      .replace(/\s+/g, "")}@gmail.com`;
  const existingUser = await User.findOne({ email: generatedEmail });

  if (existingUser) {
    res.status(400);
    throw new Error("Student user already exists");
  }

  let user = null;

  try {
    user = await User.create({
      name,
      email: generatedEmail,
      password: password || `cenna@${new Date().getFullYear()}`,
      role: "student",
      phone,
    });

    const student = await Student.create({
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
    });

 
    if (parentId) {
      await Parent.findByIdAndUpdate(parentId, {
        $addToSet: { children: student._id },
      });
    }

    const populated = await Student.findById(student._id)
      .populate("user", "name email phone avatar isActive")
      .populate("class", "name section displayName room")
      .populate("parent");

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: populated,
    });
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }

    throw error;
  }
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
    }
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


  const avatarPath = req.file.path;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarPath },
    { new: true }
  );

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
  const students = await Student.find({
    class: req.params.classId,
    isActive: true,
  })
    .populate("user", "name email phone avatar")
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
        self.findIndex((item) => String(item._id) === String(student._id))
    )
    .slice(0, 10);

  res.status(200).json({
    success: true,
    students: merged,
  });
});