import asyncHandler from "express-async-handler";

import Assignment from "../models/assignment.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import Class from "../models/class.js";
import Subject from "../models/subject.js";
import ClassSubject from "../models/ClassSubject.js";

export const createAssignment = asyncHandler(async (req, res) => {
  const { classId, subjectId, title, description, dueDate } = req.body;

  // Note: no teacherId is ever read from req.body here — the assignment's
  // owner has always come exclusively from the authenticated session
  // below, so a forged teacherId in the request has no effect regardless
  // of this tier's other fixes.
  const klass = await Class.findById(classId);

  if (!klass) {
    res.status(404);
    throw new Error("Class not found");
  }

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  // Preserves the pre-existing behavior exactly: every caller (including
  // admin, per the route's teacherOrAdmin gate) has always needed a
  // Teacher profile to create an assignment — not relaxed or expanded here.
  const teacher = await Teacher.findOne({
    user: req.user._id,
  });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher profile not found");
  }

  // A teacher must actually be assigned this class+subject via
  // ClassSubject, same pattern as enterResults/markAttendance/createQuiz.
  // Admin keeps the unrestricted access it already had — this check only
  // applies to the "teacher" role.
  if (req.user.role === "teacher") {
    const assigned = await ClassSubject.findOne({
      class: classId,
      subject: subjectId,
      teacher: teacher._id,
      isActive: true,
    });

    if (!assigned) {
      res.status(403);
      throw new Error(
        "You are not allowed to create an assignment for this subject and class"
      );
    }
  }

  // Assignment.attachment is a real, already-consumed field (student/parent
  // assignment views render a download link when it's set) but no route in
  // this app ever wires upload middleware here, so `req.file` was always
  // undefined and the old `/uploads/lectures/...` branch was unreachable
  // dead code besides being stale — lecture uploads moved to Cloudinary in
  // Tier 4. Wiring an actual attachment upload (middleware + a teacher-side
  // creation form, which doesn't exist yet either) is separate scoped work.
  const assignment = await Assignment.create({
    teacher: teacher._id,
    class: classId,
    subject: subjectId,
    title,
    description,
    dueDate,
    attachment: "",
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

  // Route is teacherOrAdmin — admin bypasses, a teacher may only delete
  // their own assignment.
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher || String(assignment.teacher) !== String(teacher._id)) {
      res.status(403);
      throw new Error("You can only delete your own assignments");
    }
  }

  await Assignment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Assignment deleted successfully",
  });
});
