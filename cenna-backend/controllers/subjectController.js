import asyncHandler from "express-async-handler";
import Subject from "../models/subject.js";
import Student from "../models/Student.js";
import ClassSubject from "../models/ClassSubject.js";

export const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    isActive: true,
  }).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: subjects.length,
    subjects,
  });
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  res.status(200).json({
    success: true,
    subject,
  });
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, maxMarks, passMark, isElective } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Subject name is required");
  }

  if (code) {
    const existingCode = await Subject.findOne({
      code: code.toUpperCase(),
    });

    if (existingCode) {
      res.status(400);
      throw new Error("Subject code already exists");
    }
  }

  const subject = await Subject.create({
    name,
    code,
    maxMarks,
    passMark,
    isElective,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Subject created",
    subject,
  });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const { name, code, maxMarks, passMark, isElective, isActive } = req.body;

  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  if (code && code.toUpperCase() !== subject.code) {
    const existingCode = await Subject.findOne({
      code: code.toUpperCase(),
      _id: { $ne: subject._id },
    });

    if (existingCode) {
      res.status(400);
      throw new Error("Subject code already exists");
    }
  }

  if (name !== undefined) subject.name = name;
  if (code !== undefined) subject.code = code;
  if (maxMarks !== undefined) subject.maxMarks = maxMarks;
  if (passMark !== undefined) subject.passMark = passMark;
  if (isElective !== undefined) subject.isElective = isElective;
  if (isActive !== undefined) subject.isActive = isActive;

  await subject.save();

  res.status(200).json({
    success: true,
    message: "Subject updated",
    subject,
  });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  await ClassSubject.updateMany(
    { subject: subject._id },
    { isActive: false }
  );

  res.status(200).json({
    success: true,
    message: "Subject deactivated",
  });
});

export const getMySubjects = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    user: req.user.id,
  }).populate("class", "displayName name section");

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const assignments = await ClassSubject.find({
    class: student.class._id,
    isActive: true,
  })
    .populate("class", "displayName name section")
    .populate("subject", "name code maxMarks passMark isElective")
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "name email phone",
      },
    });

  res.status(200).json({
    success: true,
    count: assignments.length,
    class: student.class,
    assignments,
  });
});