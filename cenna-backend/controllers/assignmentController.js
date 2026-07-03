import asyncHandler from "express-async-handler";

import Assignment from "../models/assignment.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";

export const createAssignment = asyncHandler(async (req, res) => {
  const { classId, subjectId, title, description, dueDate } = req.body;

  const teacher = await Teacher.findOne({
    user: req.user._id,
  });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher profile not found");
  }

  const assignment = await Assignment.create({
    teacher: teacher._id,
    class: classId,
    subject: subjectId,
    title,
    description,
    dueDate,
    attachment: req.file ? `/uploads/lectures/${req.file.filename}` : "",
  });

  const populated = await Assignment.findById(assignment._id)
    .populate("class", "displayName")
    .populate("subject", "name code");

  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    assignment: populated,
  });
});
export const getMyAssignments = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({
    user: req.user._id,
  });

  const assignments = await Assignment.find({
    teacher: teacher._id,
  })
    .populate("class", "displayName")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    assignments,
  });
});


export const getStudentAssignments = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    user: req.user._id,
  });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const assignments = await Assignment.find({
    class: student.class,
    isPublished: true,
  })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ dueDate: 1 });

  res.status(200).json({
    success: true,
    assignments,
  });
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }

  await Assignment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Assignment deleted successfully",
  });
});
