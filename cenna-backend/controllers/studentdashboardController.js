import asyncHandler from "express-async-handler";

import Student from "../models/student.js";
import Attendance from "../models/attendance.js";
import Assignment from "../models/assignment.js";
import Quiz from "../models/quiz.js";
import Fee from "../models/fee.js";
import Subject from "../models/subject.js";
import Datesheet from "../models/Datesheet.js";
import Timetable from "../models/Timetable.js";
import Notification from "../models/notification.js";

export const getStudentDashboard = asyncHandler(
  async (req, res) => {
    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const totalAttendance =
      await Attendance.countDocuments({
        student: student._id,
      });

    const presentAttendance =
      await Attendance.countDocuments({
        student: student._id,
        status: "present",
      });

    const attendancePercentage =
      totalAttendance > 0
        ? Math.round(
            (presentAttendance /
              totalAttendance) *
              100
          )
        : 0;

    const totalAssignments =
      await Assignment.countDocuments({
        class: student.class,
      });

    const totalQuizzes =
      await Quiz.countDocuments({
        class: student.class,
      });

    const totalSubjects =
      await Subject.countDocuments();

    const upcomingExams =
      await Datesheet.countDocuments({
        classId: student.class,
        examDate: {
          $gte: new Date(),
        },
      });

    const todayClasses =
      await Timetable.countDocuments({
        classId: student.class,
      });

    const notices =
      await Notification.countDocuments();

    const feeRecord =
      await Fee.findOne({
        student: student._id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      stats: {
        attendancePercentage,
        totalAssignments,
        totalQuizzes,
        totalSubjects,
        upcomingExams,
        todayClasses,
        notices,
        feeStatus:
          feeRecord?.status || "pending",
      },
    });
  }
);