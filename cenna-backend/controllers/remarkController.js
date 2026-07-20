import asyncHandler from "express-async-handler";

import Remark from "../models/Remark.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import ClassSubject from "../models/ClassSubject.js";
import { assertParentOwnsStudent, assertTeacherAssignedToClass } from "../utils/ownership.js";

export const createRemark = asyncHandler(async (req, res) => {
  const { studentId, classId, subjectId, type, remark, isPositive } = req.body;

  if (!studentId || !classId || !remark) {
    res.status(400);
    throw new Error("Student, class, and remark are required");
  }

  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher profile not found");
  }

  const foundStudent = await Student.findById(studentId);

  if (!foundStudent) {
    res.status(404);
    throw new Error("Student not found");
  }

  const studentClassId = foundStudent.class?._id || foundStudent.class;

  if (String(studentClassId) !== String(classId)) {
    res.status(400);
    throw new Error("Student does not belong to this class");
  }

  if (subjectId) {
    const assigned = await ClassSubject.findOne({
      teacher: teacher._id,
      class: classId,
      subject: subjectId,
      isActive: true,
    });

    if (!assigned) {
      res.status(403);
      throw new Error("You are not assigned to this class and subject");
    }
  }

  const createdRemark = await Remark.create({
    teacher: teacher._id,
    student: studentId,
    class: classId,
    subject: subjectId || undefined,
    type: type || "General",
    remark,
    isPositive: isPositive !== undefined ? isPositive : true,
  });

  const populated = await Remark.findById(createdRemark._id)
    .populate({
      path: "student",
      populate: { path: "user", select: "name email" },
    })
    .populate({
      path: "teacher",
      populate: { path: "user", select: "name email" },
    })
    .populate("class", "displayName name section")
    .populate("subject", "name code");

  res.status(201).json({
    success: true,
    message: "Remark added successfully",
    remark: populated,
  });
});

export const getMyRemarks = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher profile not found");
  }

  const remarks = await Remark.find({ teacher: teacher._id })
    .populate({
      path: "student",
      populate: { path: "user", select: "name email" },
    })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    remarks,
  });
});

export const getRemarks = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.classId) filter.class = req.query.classId;
  if (req.query.studentId) filter.student = req.query.studentId;
  if (req.query.type) filter.type = req.query.type;

  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher profile not found");
    }

    filter.teacher = teacher._id;
  }

  const remarks = await Remark.find(filter)
    .populate({
      path: "student",
      populate: { path: "user", select: "name email" },
    })
    .populate({
      path: "teacher",
      populate: { path: "user", select: "name email" },
    })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    remarks,
  });
});

export const getStudentRemarks = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // authorize("admin","teacher","parent") only confirms the caller's role
  // — a parent must actually be linked to this student, and a teacher must
  // actually be assigned to this student's class, before their remarks are
  // returned. Admin is unrestricted, matching every other staff-facing
  // per-student route in this app.
  if (req.user.role === "parent") {
    await assertParentOwnsStudent(req.user._id, student._id);
  }

  if (req.user.role === "teacher") {
    await assertTeacherAssignedToClass(req.user._id, student.class);
  }

  const remarks = await Remark.find({ student: req.params.studentId })
    .populate({
      path: "teacher",
      populate: { path: "user", select: "name email" },
    })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    remarks,
  });
});

export const getMyStudentRemarks = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const remarks = await Remark.find({ student: student._id })
    .populate({
      path: "teacher",
      populate: { path: "user", select: "name email" },
    })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    remarks,
  });
});

export const deleteRemark = asyncHandler(async (req, res) => {
  const remark = await Remark.findById(req.params.id);

  if (!remark) {
    res.status(404);
    throw new Error("Remark not found");
  }

  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher || String(remark.teacher) !== String(teacher._id)) {
      res.status(403);
      throw new Error("You can only delete your own remarks");
    }
  }

  await Remark.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Remark deleted successfully",
    id: req.params.id,
  });
});