import asyncHandler from "express-async-handler";

import LiveClass from "../models/LiveClass.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import ClassSubject from "../models/ClassSubject.js";
import LiveClassAttendance from "../models/LiveClassAttendance.js";
export const createLiveClass = asyncHandler(async (req, res) => {
  const { classId, subjectId, title, startTime, endTime, description } =
    req.body;

  if (!classId || !subjectId || !title || !startTime || !endTime) {
    res.status(400);
    throw new Error("Class, subject, title, start time and end time are required");
  }

  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

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

  const roomName = `cenna-${classId}-${subjectId}-${teacher._id}-${Date.now()}`
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  const meetingLink = `https://meet.jit.si/${roomName}`;

  const liveClass = await LiveClass.create({
    teacher: teacher._id,
    class: classId,
    subject: subjectId,
    title,
    meetingPlatform: "Jitsi",
    meetingLink,
    startTime,
    endTime,
    description,
  });

  const populated = await LiveClass.findById(liveClass._id)
    .populate("class", "displayName name section")
    .populate("subject", "name code");

  res.status(201).json({
    success: true,
    message: "Live class scheduled successfully",
    liveClass: populated,
  });
});

export const getMyLiveClasses = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  const liveClasses = await LiveClass.find({
    teacher: teacher._id,
    isActive: true,
  })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .sort({ startTime: 1 });

  res.status(200).json({
    success: true,
    liveClasses,
  });
});

export const getStudentLiveClasses = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const liveClasses = await LiveClass.find({
    class: student.class,
    isActive: true,
  })
    .populate("subject", "name code")
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "name email phone",
      },
    })
    .sort({ startTime: 1 });

  res.status(200).json({
    success: true,
    liveClasses,
  });
});

export const deleteLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    res.status(404);
    throw new Error("Live class not found");
  }

  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher || String(liveClass.teacher) !== String(teacher._id)) {
      res.status(403);
      throw new Error("You cannot delete this live class");
    }
  }

  await LiveClass.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Live class deleted successfully",
    id: req.params.id,
  });
});


export const joinLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);

  if (!liveClass) {
    res.status(404);
    throw new Error("Live class not found");
  }

  const student = await Student.findOne({
    user: req.user._id,
  });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const existing = await LiveClassAttendance.findOne({
    liveClass: liveClass._id,
    student: student._id,
  });

  if (!existing) {
    await LiveClassAttendance.create({
      liveClass: liveClass._id,
      student: student._id,
      joinedAt: new Date(),
    });
  }

  res.status(200).json({
    success: true,
    meetingLink: liveClass.meetingLink,
  });
});

export const getLiveClassAttendance = asyncHandler(async (req, res) => {
  const records = await LiveClassAttendance.find({
    liveClass: req.params.id,
  })
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ joinedAt: 1 });

  res.status(200).json({
    success: true,
    count: records.length,
    records,
  });
});