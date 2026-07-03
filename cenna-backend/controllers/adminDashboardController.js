import asyncHandler from "express-async-handler";



import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";
import Class from "../models/class.js";
import Subject from "../models/subject.js";
import Fee from "../models/fee.js";
import Attendance from "../models/attendance.js";
import News from "../models/news.js";
import Gallery from "../models/gallery.js";
import Timetable from "../models/Timetable.js";
import Datesheet from "../models/Datesheet.js";
import Notification from "../models/notification.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  // Basic Counts
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();
  const totalParents = await Parent.countDocuments();
  const totalClasses = await Class.countDocuments();
  const totalSubjects = await Subject.countDocuments();

  const totalNews = await News.countDocuments();
  const totalGallery = await Gallery.countDocuments();
  const totalNotifications = await Notification.countDocuments();

  // Fees
  const collected = await Fee.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: "$paidAmount",
        },
      },
    },
  ]);

  const pending = await Fee.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $subtract: ["$totalAmount", "$paidAmount"],
          },
        },
      },
    },
  ]);

  // Attendance %
  const presentCount = await Attendance.countDocuments({
    status: "present",
  });

  const totalAttendance = await Attendance.countDocuments();

  const attendancePercentage =
    totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

  // Upcoming Exams
  const upcomingExams = await Datesheet.countDocuments({
    examDate: {
      $gte: new Date(),
    },
  });

  // Today's Timetable Classes
  const todayClasses = await Timetable.countDocuments();

  // Monthly Admissions Chart
  const monthlyAdmissions = await Student.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        students: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  // Monthly Fee Collection Chart
  const monthlyFees = await Fee.aggregate([
    {
      $match: {
        status: "paid",
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        amount: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedAdmissions = monthlyAdmissions.map((item) => ({
    month: monthNames[item._id.month],
    students: item.students,
  }));

  const formattedFees = monthlyFees.map((item) => ({
    month: monthNames[item._id.month],
    amount: item.amount,
  }));

  // Recent Students
  const recentStudents = await Student.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name");

  // Recent Notifications
  const recentNotifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(5);

  // Recent Exams
  const recentExams = await Datesheet.find()
    .populate("classId", "displayName name")
    .populate("subjectId", "name")
    .sort({ examDate: 1 })
    .limit(5);

  res.status(200).json({
    success: true,

    stats: {
      // Cards
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      totalSubjects,

      totalNews,
      totalGallery,
      totalNotifications,

      totalCollected: collected[0]?.total || 0,
      totalPending: pending[0]?.total || 0,

      attendancePercentage,

      todayClasses,
      upcomingExams,

      // Charts
      monthlyAdmissions: formattedAdmissions,
      monthlyFees: formattedFees,

      // Activity Sections
      recentStudents,
      recentNotifications,
      recentExams,
    },
  });
});