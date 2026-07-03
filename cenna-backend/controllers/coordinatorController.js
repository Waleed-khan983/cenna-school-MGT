import asyncHandler from "express-async-handler";

import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Attendance from "../models/Attendance.js";
import Result from "../models/Result.js";
import Subject from "../models/Subject.js";
import ClassSubject from "../models/ClassSubject.js";
import Evaluation from "../models/evaluation.js";
import Remark from "../models/Remark.js";

// First API
export const getClassMonitoring = asyncHandler(async (req, res) => {
  const classes = await Class.find({ isActive: true })
    .populate({
      path: "classTeacher",
      populate: {
        path: "user",
        select: "name avatar",
      },
    })
    .lean();

  // Fetch everything only once
  const [students, attendance, results, subjects] = await Promise.all([
    Student.find({ isActive: true })
      .populate("user", "name")
      .lean(),
    Attendance.find().lean(),
    Result.find().lean(),
    Subject.find({ isActive: true })
      .select("name classes")
      .lean(),
  ]);

  const response = classes.map((cls) => {
    // Students of this class
    const classStudents = students.filter(
      (s) => s.class?.toString() === cls._id.toString()
    );

    const studentIds = classStudents.map((s) => s._id.toString());

    // Attendance of this class
    const classAttendance = attendance.filter(
      (a) => a.class?.toString() === cls._id.toString()
    );

    // Results of this class
    const classResults = results.filter(
      (r) => r.class?.toString() === cls._id.toString()
    );

    // Subjects of this class
    const classSubjects = subjects.filter((sub) =>
      sub.classes.some(
        (id) => id.toString() === cls._id.toString()
      )
    );

    const boys = classStudents.filter(
      (s) => s.gender === "Male"
    ).length;

    const girls = classStudents.filter(
      (s) => s.gender === "Female"
    ).length;

    const present = classAttendance.filter(
      (a) => a.status === "present"
    ).length;

    const attendancePercentage =
      classAttendance.length === 0
        ? 0
        : Math.round(
          (present / classAttendance.length) * 100
        );

    const averagePerformance =
      classResults.length === 0
        ? 0
        : Math.round(
          classResults.reduce(
            (sum, item) => sum + (item.percentage || 0),
            0
          ) / classResults.length
        );

    // Top student
    let topStudent = null;

    if (classResults.length > 0) {
      const topper = [...classResults].sort(
        (a, b) => b.percentage - a.percentage
      )[0];

      topStudent = classStudents.find(
        (s) =>
          s._id.toString() === topper.student.toString()
      );
    }

    // Weak students
    const weakStudents = classResults.filter(
      (r) => r.percentage < 40
    ).length;

    return {
      _id: cls._id,

      displayName: cls.displayName,

      room: cls.room,

      capacity: cls.capacity,

      classTeacher: cls.classTeacher,

      studentCount: classStudents.length,

      boys,

      girls,

      attendancePercentage,

      averagePerformance,

      subjects: classSubjects,

      topStudent,

      weakStudents,
    };
  });

  res.status(200).json({
    success: true,
    classes: response,
  });
});


export const getAttendanceMonitoring = asyncHandler(async (req, res) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const [
    classes,
    todayAttendance,
  ] = await Promise.all([
    Class.find({ isActive: true })
      .select("displayName")
      .lean(),

    Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).lean(),
  ]);

  const total = todayAttendance.length;

  const present = todayAttendance.filter(
    (a) => a.status === "present"
  ).length;

  const absent = todayAttendance.filter(
    (a) => a.status === "absent"
  ).length;

  const late = todayAttendance.filter(
    (a) => a.status === "late"
  ).length;

  const leave = todayAttendance.filter(
    (a) => a.status === "leave"
  ).length;

  const overallPercentage =
    total === 0
      ? 0
      : Math.round((present / total) * 100);

  const classAttendance = classes.map((cls) => {
    const records = todayAttendance.filter(
      (a) => a.class?.toString() === cls._id.toString()
    );

    const classPresent = records.filter(
      (a) => a.status === "present"
    ).length;

    return {
      _id: cls._id,

      className: cls.displayName,

      totalStudents: records.length,

      present: classPresent,

      absent: records.filter(
        (a) => a.status === "absent"
      ).length,

      late: records.filter(
        (a) => a.status === "late"
      ).length,

      leave: records.filter(
        (a) => a.status === "leave"
      ).length,

      attendance:
        records.length === 0
          ? 0
          : Math.round(
            (classPresent / records.length) * 100
          ),
    };
  });

  classAttendance.sort(
    (a, b) => b.attendance - a.attendance
  );

  res.status(200).json({
    success: true,

    summary: {
      overallPercentage,

      total,

      present,

      absent,

      late,

      leave,
    },

    classes: classAttendance,
  });
});

export const getTeacherMonitoring = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({ isActive: true })
    .populate("user", "name avatar")
    .lean();

  const assignments = await ClassSubject.find({ isActive: true })
    .populate("class", "displayName")
    .populate("subject", "name")
    .lean();

  const students = await Student.find({ isActive: true }).lean();

  const attendance = await Attendance.find().lean();

  const evaluations = await Evaluation.find().lean();

  const results = await Result.find().lean();

  const ratingMap = {
    "Strongly Agree": 4,
    Agree: 3,
    Good: 2,
    Disagree: 1,
  };

  const teacherMonitoring = teachers.map((teacher) => {
    const teacherAssignments = assignments.filter(
      (a) => a.teacher?.toString() === teacher._id.toString()
    );

    const classIds = [
      ...new Set(
        teacherAssignments.map((a) => a.class?._id?.toString())
      ),
    ];

    const subjectNames = [
      ...new Set(
        teacherAssignments.map((a) => a.subject?.name)
      ),
    ];

    const teacherStudents = students.filter((student) =>
      classIds.includes(student.class?.toString())
    );

    const attendanceCount = attendance.filter(
      (a) => a.teacher?.toString() === teacher._id.toString()
    ).length;

    const teacherEvaluations = evaluations.filter(
      (e) => e.teacher?.toString() === teacher._id.toString()
    );

    let evaluationScore = 0;

    if (teacherEvaluations.length) {
      let total = 0;

      teacherEvaluations.forEach((e) => {
        total += ratingMap[e.punctuality] || 0;
        total += ratingMap[e.teachingQuality] || 0;
        total += ratingMap[e.assignmentGiven] || 0;
        total += ratingMap[e.assignmentChecking] || 0;
        total += ratingMap[e.communication] || 0;
        total += ratingMap[e.discipline] || 0;
      });

      evaluationScore = (
        total /
        (teacherEvaluations.length * 6)
      ).toFixed(1);
    }

    const studentIds = teacherStudents.map((s) =>
      s._id.toString()
    );

    const teacherResults = results.filter((r) =>
      studentIds.includes(r.student?.toString())
    );

    const averagePerformance = teacherResults.length
      ? Math.round(
        teacherResults.reduce(
          (sum, r) => sum + (r.percentage || 0),
          0
        ) / teacherResults.length
      )
      : 0;

    let status = "Needs Attention";

    if (averagePerformance >= 80) {
      status = "Excellent";
    } else if (averagePerformance >= 60) {
      status = "Good";
    }

    return {
      _id: teacher._id,

      name: teacher.user?.name,

      avatar: teacher.user?.avatar,

      employeeId: teacher.employeeId,

      designation: teacher.designation,

      classes: [
        ...new Set(
          teacherAssignments.map(
            (a) => a.class?.displayName
          )
        ),
      ],  

      subjects: subjectNames,

      totalStudents: teacherStudents.length,

      attendanceTaken: attendanceCount,

      evaluationScore,

      averagePerformance,

      status,
    };
  });

  res.status(200).json({
    success: true,
    teachers: teacherMonitoring,
  });
});

export const getStudentPerformance = asyncHandler(async (req, res) => {

  const students = await Student.find({ isActive: true })
    .populate("user", "name avatar")
    .populate("class", "displayName")
    .lean();

  const results = await Result.find().lean();

  const performance = students.map((student) => {

    const studentResults = results.filter(
      (r) => r.student?.toString() === student._id.toString()
    );

    const exams = studentResults.length;

    const averagePercentage =
      exams === 0
        ? 0
        : Math.round(
            studentResults.reduce(
              (sum, r) => sum + (r.percentage || 0),
              0
            ) / exams
          );

    const passed = studentResults.filter(
      (r) => r.isPassed
    ).length;

    const failed = exams - passed;

    let status = "Weak";

    if (averagePercentage >= 80)
      status = "Excellent";
    else if (averagePercentage >= 60)
      status = "Good";
    else if (averagePercentage >= 40)
      status = "Average";

    return {

      _id: student._id,

      name: student.user?.name,

      avatar: student.user?.avatar,

      admissionNo: student.admissionNo,

      className: student.class?.displayName,

      exams,

      passed,

      failed,

      averagePercentage,

      status,

    };

  });

  performance.sort(
    (a, b) =>
      b.averagePercentage - a.averagePercentage
  );

  const topper = performance[0] || null;

  const weakStudents = performance.filter(
    (s) => s.averagePercentage < 40
  ).length;

  const classAverage =
    performance.length === 0
      ? 0
      : Math.round(
          performance.reduce(
            (sum, s) => sum + s.averagePercentage,
            0
          ) / performance.length
        );

  res.status(200).json({

    success: true,

    summary: {

      totalStudents: performance.length,

      topper,

      weakStudents,

      classAverage,

    },

    students: performance,

  });

});

export const getStudentRemarksMonitoring = asyncHandler(async (req, res) => {
  const remarks = await Remark.find()
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name avatar",
      },
    })
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate("class", "displayName")
    .populate("subject", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    remarks,
  });
});

export const getAwardRecommendations = asyncHandler(async (req, res) => {
  const [
    students,
    teachers,
    results,
    attendance,
    evaluations,
    remarks,
  ] = await Promise.all([
    Student.find({ isActive: true })
      .populate("user", "name avatar")
      .lean(),

    Teacher.find({ isActive: true })
      .populate("user", "name avatar")
      .lean(),

    Result.find().lean(),

    Attendance.find().lean(),

    Evaluation.find().lean(),

    Remark.find().lean(),
  ]);

  // =========================
  // BEST STUDENT
  // =========================

  let bestStudent = null;

  if (results.length) {
    const grouped = {};

    results.forEach((r) => {
      const id = r.student.toString();

      if (!grouped[id]) {
        grouped[id] = {
          total: 0,
          count: 0,
        };
      }

      grouped[id].total += r.percentage || 0;
      grouped[id].count++;
    });

    const ranking = Object.entries(grouped)
      .map(([id, value]) => ({
        student: students.find(
          (s) => s._id.toString() === id
        ),
        percentage: Math.round(
          value.total / value.count
        ),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    bestStudent = ranking[0];
  }

  // =========================
  // PERFECT ATTENDANCE
  // =========================

  let perfectAttendance = null;

  if (attendance.length) {
    const grouped = {};

    attendance.forEach((a) => {
      const id = a.student.toString();

      if (!grouped[id]) {
        grouped[id] = {
          total: 0,
          present: 0,
        };
      }

      grouped[id].total++;

      if (a.status === "present") {
        grouped[id].present++;
      }
    });

    const ranking = Object.entries(grouped)
      .map(([id, value]) => ({
        student: students.find(
          (s) => s._id.toString() === id
        ),
        percentage: Math.round(
          (value.present / value.total) * 100
        ),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    perfectAttendance = ranking[0];
  }

  // =========================
  // BEST TEACHER
  // =========================

  const ratingMap = {
    "Strongly Agree": 4,
    Agree: 3,
    Good: 2,
    Disagree: 1,
  };

  let bestTeacher = null;

  if (evaluations.length) {
    const grouped = {};

    evaluations.forEach((e) => {
      const id = e.teacher.toString();

      if (!grouped[id]) {
        grouped[id] = {
          total: 0,
          count: 0,
        };
      }

      grouped[id].total +=
        (ratingMap[e.punctuality] || 0) +
        (ratingMap[e.teachingQuality] || 0) +
        (ratingMap[e.assignmentGiven] || 0) +
        (ratingMap[e.assignmentChecking] || 0) +
        (ratingMap[e.communication] || 0) +
        (ratingMap[e.discipline] || 0);

      grouped[id].count += 6;
    });

    const ranking = Object.entries(grouped)
      .map(([id, value]) => ({
        teacher: teachers.find(
          (t) => t._id.toString() === id
        ),
        score: (
          value.total / value.count
        ).toFixed(2),
      }))
      .sort((a, b) => b.score - a.score);

    bestTeacher = ranking[0];
  }

  // =========================
  // POSITIVE STUDENT
  // =========================

  let positiveStudent = null;

  if (remarks.length) {
    const grouped = {};

    remarks.forEach((r) => {
      if (!r.isPositive) return;

      const id = r.student.toString();

      grouped[id] = (grouped[id] || 0) + 1;
    });

    const ranking = Object.entries(grouped)
      .map(([id, count]) => ({
        student: students.find(
          (s) => s._id.toString() === id
        ),
        remarks: count,
      }))
      .sort((a, b) => b.remarks - a.remarks);

    positiveStudent = ranking[0];
  }

  res.status(200).json({
    success: true,

    awards: {
      bestStudent,
      bestTeacher,
      perfectAttendance,
      positiveStudent,
    },
  });
});

export const getCoordinatorDashboard = asyncHandler(async (req, res) => {
  const [
    totalClasses,
    totalStudents,
    totalTeachers,
    totalAttendance,
    presentAttendance,
    totalResults,
  ] = await Promise.all([
    Class.countDocuments({ isActive: true }),
    Student.countDocuments({ isActive: true }),
    Teacher.countDocuments({ isActive: true }),
    Attendance.countDocuments(),
    Attendance.countDocuments({ status: "present" }),
    Result.find().select("percentage").lean(),
  ]);

  const attendancePercentage =
    totalAttendance === 0
      ? 0
      : Math.round((presentAttendance / totalAttendance) * 100);

  const averagePerformance =
    totalResults.length === 0
      ? 0
      : Math.round(
          totalResults.reduce(
            (sum, item) => sum + (item.percentage || 0),
            0
          ) / totalResults.length
        );

  res.status(200).json({
    success: true,

    dashboard: {
      totalClasses,
      totalStudents,
      totalTeachers,
      attendancePercentage,
      averagePerformance,
    },
  });
});