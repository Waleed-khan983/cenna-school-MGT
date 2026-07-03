import asyncHandler from "express-async-handler";

import Remark from "../models/Remark.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import ClassSubject from "../models/ClassSubject.js";

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

  const student = await Student.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (String(student.class) !== String(classId)) {
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

  const newRemark = await Remark.create({
    teacher: teacher._id,
    student: studentId,
    class: classId,
    subject: subjectId || undefined,
    type: type || "General",
    remark,
    isPositive: isPositive !== undefined ? isPositive : true,
  });

  const populated = await Remark.findById(newRemark._id)
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

  await Remark.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Remark deleted successfully",
    id: req.params.id,
  });
});