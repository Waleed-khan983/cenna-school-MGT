import asyncHandler from "express-async-handler";

import Result from "../models/result.js";
import Student from "../models/Student.js";
import Subject from "../models/subject.js";
import Teacher from "../models/teacher.js";
import ClassSubject from "../models/ClassSubject.js";
import { calculateGrade } from "../utils/helpers.js";
import { assertParentOwnsStudent } from "../utils/ownership.js";

const recalculateResult = (marks = []) => {
  let totalMarks = 0;
  let totalObtained = 0;

  const processedMarks = marks.map((item) => {
    const maxMarks = Number(item.maxMarks || 100);
    const obtained = Number(item.obtained || 0);
    const pct = maxMarks > 0 ? (obtained / maxMarks) * 100 : 0;

    totalMarks += maxMarks;
    totalObtained += obtained;

    return {
      subject: item.subject,
      maxMarks,
      obtained,
      grade: calculateGrade(pct),
      isPassed: pct >= 40,
    };
  });

  const percentage =
    totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100) : 0;

  return {
    marks: processedMarks,
    totalMarks,
    totalObtained,
    percentage,
    grade: calculateGrade(percentage),
    isPassed: processedMarks.every((item) => item.isPassed),
  };
};

export const enterResults = asyncHandler(async (req, res) => {
  const { studentId, classId, examType, session, examMonth, marks, remarks } =
    req.body;

  if (!studentId || !classId || !examType || !session) {
    res.status(400);
    throw new Error("Student, class, exam type, and session are required");
  }

  if (!marks || !Array.isArray(marks) || marks.length === 0) {
    res.status(400);
    throw new Error("Marks are required");
  }

  const student = await Student.findById(studentId);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (student.class.toString() !== classId.toString()) {
    res.status(400);
    throw new Error("Selected student does not belong to this class");
  }

  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher profile not found");
    }

    for (const item of marks) {
      const assigned = await ClassSubject.findOne({
        class: classId,
        subject: item.subject,
        teacher: teacher._id,
        isActive: true,
      });

      if (!assigned) {
        res.status(403);
        throw new Error(
          "You are not allowed to enter marks for this subject and class"
        );
      }
    }
  }

  let result = await Result.findOne({
    student: studentId,
    examType,
    session,
  });

  if (!result) {
    result = new Result({
      student: studentId,
      class: classId,
      examType,
      session,
      examMonth,
      marks: [],
      remarks,
      enteredBy: req.user._id,
      publishedAt: new Date(),
    });
  }

  for (const item of marks) {
    const maxMarks = Number(item.maxMarks || 100);
    const obtained = Number(item.obtained || 0);
    const pct = maxMarks > 0 ? (obtained / maxMarks) * 100 : 0;

    const newMark = {
      subject: item.subject,
      maxMarks,
      obtained,
      grade: calculateGrade(pct),
      isPassed: pct >= 40,
    };

    const existingIndex = result.marks.findIndex(
      (mark) => mark.subject.toString() === item.subject.toString()
    );

    if (existingIndex >= 0) {
      result.marks[existingIndex] = newMark;
    } else {
      result.marks.push(newMark);
    }
  }

  const calculated = recalculateResult(result.marks);

  result.class = classId;
  result.examMonth = examMonth || result.examMonth;
  result.marks = calculated.marks;
  result.totalMarks = calculated.totalMarks;
  result.totalObtained = calculated.totalObtained;
  result.percentage = calculated.percentage;
  result.grade = calculated.grade;
  result.isPassed = calculated.isPassed;
  result.remarks = remarks ?? result.remarks;
  result.enteredBy = req.user._id;
  result.publishedAt = new Date();

  await result.save();

  const populated = await Result.findById(result._id)
    .populate({
      path: "student",
      populate: { path: "user", select: "name" },
    })
    .populate("class", "displayName name section")
    .populate("marks.subject", "name code");

  res.status(200).json({
    success: true,
    message: "Result saved successfully",
    result: populated,
  });
});

export const getClassResults = asyncHandler(async (req, res) => {
  const { classId, examType, session } = req.query;

  const filter = {};

  if (classId) filter.class = classId;
  if (examType) filter.examType = examType;
  if (session) filter.session = session;

  const results = await Result.find(filter)
    .populate({
      path: "student",
      populate: { path: "user", select: "name" },
    })
    .populate("class", "displayName name section")
    .populate("marks.subject", "name code")
    .sort({ percentage: -1 });

  const positioned = results.map((result, index) => ({
    ...result.toObject(),
    position: index + 1,
  }));

  res.status(200).json({
    success: true,
    count: positioned.length,
    results: positioned,
  });
});

export const getMyResults = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const results = await Result.find({
    student: student._id
  })
    .populate({
      path: "student",
      populate: [
        {
          path: "user",
          select: "name email phone"
        },
        {
          path: "class",
          select: "displayName name section"
        }
      ]
    })
    .populate("class", "displayName name section")
    .populate("marks.subject", "name code");

  res.status(200).json({
    success: true,
    results,
  });
});

export const getStudentResults = asyncHandler(async (req, res) => {
  // Admin/teacher/operator are trusted staff roles for this route (per
  // result.Routes.js authorize list) and can view any student. A parent
  // must be shown to actually be linked to the requested student first.
  if (req.user.role === "parent") {
    await assertParentOwnsStudent(req.user._id, req.params.studentId);
  }

  const results = await Result.find({
    student: req.params.studentId
  })
    .populate({
      path: "student",
      populate: [
        {
          path: "user",
          select: "name email phone"
        },
        {
          path: "class",
          select: "displayName name section"
        }
      ]
    })
    .populate("class", "displayName name section")
    .populate("marks.subject", "name code");

  res.status(200).json({
    success: true,
    results,
  });
});

export const updateResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);

  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  const { marks, remarks } = req.body;

  if (!marks || !Array.isArray(marks) || marks.length === 0) {
    res.status(400);
    throw new Error("Marks are required");
  }

  // Mirrors enterResults' own check — authorize("teacherOrAdmin") only
  // confirms the caller is A teacher, not that they teach this specific
  // class/subject, so every submitted subject must be one they're actually
  // assigned via ClassSubject before their marks overwrite anyone's grade.
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher profile not found");
    }

    for (const item of marks) {
      const assigned = await ClassSubject.findOne({
        class: result.class,
        subject: item.subject,
        teacher: teacher._id,
        isActive: true,
      });

      if (!assigned) {
        res.status(403);
        throw new Error(
          "You are not allowed to update marks for this subject and class"
        );
      }
    }
  }

  let totalMarks = 0;
  let totalObtained = 0;

  const processedMarks = marks.map((item) => {
    const maxMarks = Number(item.maxMarks || 100);
    const obtained = Number(item.obtained || 0);
    const pct = maxMarks > 0 ? (obtained / maxMarks) * 100 : 0;

    totalMarks += maxMarks;
    totalObtained += obtained;

    return {
      subject: item.subject,
      maxMarks,
      obtained,
      grade: calculateGrade(pct),
      isPassed: pct >= 40,
    };
  });

  const percentage =
    totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100) : 0;

  result.marks = processedMarks;
  result.totalMarks = totalMarks;
  result.totalObtained = totalObtained;
  result.percentage = percentage;
  result.grade = calculateGrade(percentage);
  result.isPassed = processedMarks.every((item) => item.isPassed);
  result.remarks = remarks;

  await result.save();

  const updated = await Result.findById(result._id)
    .populate({
      path: "student",
      populate: { path: "user", select: "name" },
    })
    .populate("class", "displayName name section")
    .populate("marks.subject", "name code");

  res.status(200).json({
    success: true,
    message: "Result updated successfully",
    result: updated,
  });
});

export const getSubjectsForClass = asyncHandler(async (req, res) => {
  const assignments = await ClassSubject.find({
    class: req.params.classId,
    isActive: true,
  })
    .populate("subject", "name code maxMarks passMark")
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "name",
      },
    });

  const subjects = assignments.map((item) => ({
    ...item.subject.toObject(),
    teacher: item.teacher,
    assignmentId: item._id,
  }));

  res.status(200).json({
    success: true,
    subjects,
  });
});

export const deleteResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);

  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher profile not found");
    }

    const subjectIds = result.marks.map((mark) => mark.subject);

    const assigned = await ClassSubject.findOne({
      class: result.class,
      subject: { $in: subjectIds },
      teacher: teacher._id,
      isActive: true,
    });

    if (!assigned) {
      res.status(403);
      throw new Error("You are not allowed to delete this result");
    }
  }

  await Result.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Result deleted successfully",
  });
});