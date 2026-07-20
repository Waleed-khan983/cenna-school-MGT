import asyncHandler from "express-async-handler";



import Student from "../models/Student.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";
import Class from "../models/class.js";
import Subject from "../models/subject.js";
import Fee from "../models/fee.js";
import Attendance from "../models/attendance.js";
import News from "../models/news.js";
import Gallery from "../models/gallery.js";
import Timetable from "../models/timetable.js";
import Datesheet from "../models/datesheet.js";
import Notification from "../models/notification.js";

// No school-timezone setting exists yet in the schema/config — fall back to
// the school's actual local timezone (Pabbi, Pakistan) so "today" and
// "this month" resolve against the school's clock, not the server host's.
const SCHOOL_TIMEZONE = process.env.SCHOOL_TIMEZONE || "Asia/Karachi";

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

  // Today's Timetable Classes — count only entries for the current weekday
  // in the school's timezone. Timetable.day has no "Sunday" value in its
  // enum, so a Sunday request naturally yields 0 without special-casing.
  // The schema has no isActive/cancelled flag on timetable entries, so every
  // matching entry for the day is counted as-is.
  const todayName = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHOOL_TIMEZONE,
    weekday: "long",
  }).format(new Date());

  const todayClasses = await Timetable.countDocuments({ day: todayName });

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

  // Monthly Fee Collection Chart — grouped by paidDate (when money was
  // actually collected), not createdAt (when the challan was generated),
  // and summed on paidAmount, the field that actually holds collected money
  // (Fee has no separate `amount`/payment-history collection, so no
  // double-counting risk). Status is intentionally not filtered on: a
  // "Partial" fee's paidAmount is real money collected too.
  //
  // Known limitation: collectFee overwrites paidDate on every call, so a fee
  // paid in two partial installments in different months has its full
  // cumulative paidAmount attributed to the month of the *latest* payment.
  // Fixing that needs a per-payment history subdocument, out of Tier 5A scope.
  const currentYear = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: SCHOOL_TIMEZONE,
      year: "numeric",
    }).format(new Date())
  );

  const monthlyFeesRaw = await Fee.aggregate([
    {
      $match: {
        paidAmount: { $gt: 0 },
        paidDate: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: { date: "$paidDate", timezone: SCHOOL_TIMEZONE } },
          month: { $month: { date: "$paidDate", timezone: SCHOOL_TIMEZONE } },
        },
        amount: { $sum: "$paidAmount" },
      },
    },
  ]);

  const feeByMonth = new Map(
    monthlyFeesRaw
      .filter((item) => item._id.year === currentYear)
      .map((item) => [item._id.month, item.amount])
  );

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

  const formattedFees = monthNames.slice(1).map((name, idx) => ({
    month: name,
    amount: feeByMonth.get(idx + 1) || 0,
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