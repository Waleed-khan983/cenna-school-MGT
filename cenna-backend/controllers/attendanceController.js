import asyncHandler from "express-async-handler";

import Attendance from "../models/attendance.js";
import Student from "../models/Student.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";
import ClassSubject from "../models/ClassSubject.js";
import { sendAttendanceAlert } from "../utils/helpers.js";

/*
Convert any supplied date into the start of that date.

This prevents values such as:
2026-06-19T08:30
2026-06-19T10:20

from being treated as different attendance dates.
*/
const normalizeDate = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};

/*
Return the beginning and end of a month.
*/
const getMonthRange = (month, year) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);

  const start = new Date(numericYear, numericMonth - 1, 1);

  const end = new Date(
    numericYear,
    numericMonth,
    0,
    23,
    59,
    59,
    999
  );

  return {
    start,
    end,
  };
};

/*
Create subject-wise totals for frontend charts.
*/
const createSubjectReport = (records) => {
  const subjects = {};

  records.forEach((record) => {
    if (!record.subject) {
      return;
    }

    const subjectId = record.subject._id.toString();

    if (!subjects[subjectId]) {
      subjects[subjectId] = {
        subjectId: record.subject._id,
        subjectName:
          record.subject.name ||
          record.subject.subjectName ||
          "Unknown Subject",

        subjectCode:
          record.subject.code ||
          record.subject.subjectCode ||
          "",

        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        percentage: 0,
      };
    }

    subjects[subjectId].totalClasses += 1;

    if (record.status === "present") {
      subjects[subjectId].present += 1;
    }

    if (record.status === "absent") {
      subjects[subjectId].absent += 1;
    }

    if (record.status === "late") {
      subjects[subjectId].late += 1;
    }

    if (record.status === "leave") {
      subjects[subjectId].leave += 1;
    }
  });

  return Object.values(subjects)
    .map((subject) => {
      /*
      Currently, only "present" counts in percentage.

      Example:
      present = 8
      total = 10
      percentage = 80%
      */
      const percentage =
        subject.totalClasses > 0
          ? Math.round(
            (subject.present / subject.totalClasses) * 100
          )
          : 0;

      return {
        ...subject,
        percentage,
      };
    })
    .sort((a, b) =>
      a.subjectName.localeCompare(b.subjectName)
    );
};

// @desc    Mark bulk attendance for one subject
// @route   POST /api/attendance/mark
// @access  Teacher, Admin
export const markAttendance = asyncHandler(
  async (req, res) => {
    const {
      classId,
      subjectId,
      date,
      period,
      records,
      teacherId,
    } = req.body;

    if (!classId) {
      res.status(400);
      throw new Error("Class is required");
    }

    if (!subjectId) {
      res.status(400);
      throw new Error("Subject is required");
    }

    if (!date) {
      res.status(400);
      throw new Error("Attendance date is required");
    }

    if (!period || Number(period) < 1) {
      res.status(400);
      throw new Error("A valid period is required");
    }

    if (!Array.isArray(records) || records.length === 0) {
      res.status(400);
      throw new Error("Student attendance records are required");
    }

    /*
    When a teacher marks attendance, find their teacher profile.

    When an admin marks attendance, the frontend can send teacherId.
    */
    let teacher = await Teacher.findOne({
      user: req.user._id,
    });

    if (!teacher && teacherId) {
      teacher = await Teacher.findById(teacherId);
    }

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher profile not found");
    }
   const assignment =
  await ClassSubject.findOne({
    class: classId,
    subject: subjectId,
    teacher: teacher._id,
    isActive: true,
  });

if (!assignment) {
  res.status(403);

  throw new Error(
    "You are not assigned to teach this subject in this class"
  );
}
    /*
    Important:
    You should verify here that this teacher is assigned to this
    class and subject.

    The exact query depends on your TeacherAssignment or Subject model.

    Example:

    const assignment = await TeacherAssignment.findOne({
      teacher: teacher._id,
      class: classId,
      subject: subjectId,
    });

    if (!assignment) {
      res.status(403);
      throw new Error(
        "You are not assigned to this class and subject"
      );
    }
    */

    const attendanceDate = normalizeDate(date);

    const validStatuses = [
      "present",
      "absent",
      "late",
      "leave",
    ];

    const operations = records.map((record) => {
      const normalizedStatus =
        record.status?.toLowerCase();

      if (!record.studentId) {
        throw new Error(
          "Every attendance record must have a studentId"
        );
      }

      if (!validStatuses.includes(normalizedStatus)) {
        throw new Error(
          `Invalid attendance status for student ${record.studentId}`
        );
      }

      return {
        updateOne: {
          filter: {
            student: record.studentId,
            subject: subjectId,
            date: attendanceDate,
            period: Number(period),
          },

          update: {
            $set: {
              student: record.studentId,
              class: classId,
              subject: subjectId,
              teacher: teacher._id,
              date: attendanceDate,
              period: Number(period),
              status: normalizedStatus,
              remark: record.remark?.trim() || "",
              markedBy: req.user._id,
            },
          },

          upsert: true,
        },
      };
    });

    await Attendance.bulkWrite(operations);

    /*
    Send alerts to parents of absent students.
    */
    const absentRecords = records.filter(
      (record) =>
        record.status?.toLowerCase() === "absent"
    );

    for (const record of absentRecords) {
      try {
        const student = await Student.findById(
          record.studentId
        )
          .populate("user", "name")
          .populate("parent");

        if (!student?.parent) {
          continue;
        }

        const parent = await Parent.findById(
          student.parent._id || student.parent
        ).populate("user", "email phone");

        if (parent) {
          await sendAttendanceAlert(
            parent,
            student,
            attendanceDate,
            "Absent"
          );
        }
      } catch (error) {
        console.error(
          "Attendance alert error:",
          error.message
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Attendance marked for ${records.length} students`,
    });
  }
);

// @desc    Get attendance for a class and subject
// @route   GET /api/attendance/class/:classId
// @access  Teacher, Admin
export const getClassAttendance = asyncHandler(
  async (req, res) => {
    const { classId } = req.params;

    const {
      date,
      subjectId,
      period,
    } = req.query;

    const filter = {
      class: classId,
    };

    if (subjectId) {
      filter.subject = subjectId;
    }

    if (period) {
      filter.period = Number(period);
    }

    if (date) {
      const start = normalizeDate(date);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    const records = await Attendance.find(filter)
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("class", "name section displayName")
      .populate("subject", "name code subjectName subjectCode")
      .populate({
        path: "teacher",
        select: "user designation",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({
        date: 1,
        period: 1,
      });

    res.status(200).json({
      success: true,
      count: records.length,
      attendance: records,
    });
  }
);

// @desc    Get logged-in student's attendance
// @route   GET /api/attendance/me
// @access  Student
export const getMyAttendance = asyncHandler(
  async (req, res) => {
    const student = await Student.findOne({
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate(
        "class",
        "name section displayName"
      );

    if (!student) {
      res.status(404);
      throw new Error("Student profile not found");
    }

    const {
      month,
      year,
    } = req.query;

    const filter = {
      student: student._id,
    };

    if (month && year) {
      const { start, end } = getMonthRange(
        month,
        year
      );

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    const records = await Attendance.find(filter)
      .populate("class", "name section displayName")
      .populate(
        "subject",
        "name code subjectName subjectCode"
      )
      .populate({
        path: "teacher",
        select: "user designation",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({
        date: -1,
        period: 1,
      });

    const summary = {
      total: records.length,

      present: records.filter(
        (record) => record.status === "present"
      ).length,

      absent: records.filter(
        (record) => record.status === "absent"
      ).length,

      late: records.filter(
        (record) => record.status === "late"
      ).length,

      leave: records.filter(
        (record) => record.status === "leave"
      ).length,

      percentage: 0,
    };

    summary.percentage =
      summary.total > 0
        ? Math.round(
          (summary.present / summary.total) * 100
        )
        : 0;

    const subjectReport =
      createSubjectReport(records);

    res.status(200).json({
      success: true,
      student,
      summary,
      subjectReport,
      attendance: records,
    });
  }
);

// @desc    Get monthly attendance report
// @route   GET /api/attendance/report/monthly
// @access  Admin, Teacher
export const getMonthlyReport = asyncHandler(
  async (req, res) => {
    const {
      classId,
      subjectId,
      month,
      year,
    } = req.query;

    if (!month || !year) {
      res.status(400);
      throw new Error(
        "Month and year are required"
      );
    }

    const { start, end } = getMonthRange(
      month,
      year
    );

    const filter = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    if (classId) {
      filter.class = classId;
    }

    if (subjectId) {
      filter.subject = subjectId;
    }

    const records = await Attendance.find(filter)
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("class", "name section displayName")
      .populate(
        "subject",
        "name code subjectName subjectCode"
      )
      .sort({
        student: 1,
        date: 1,
      });

    const grouped = {};

    records.forEach((record) => {
      if (!record.student) {
        return;
      }

      const studentId =
        record.student._id.toString();

      if (!grouped[studentId]) {
        grouped[studentId] = {
          student: record.student,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          leave: 0,
          percentage: 0,
        };
      }

      grouped[studentId].total += 1;

      if (record.status === "present") {
        grouped[studentId].present += 1;
      }

      if (record.status === "absent") {
        grouped[studentId].absent += 1;
      }

      if (record.status === "late") {
        grouped[studentId].late += 1;
      }

      if (record.status === "leave") {
        grouped[studentId].leave += 1;
      }
    });

    const report = Object.values(grouped).map(
      (studentReport) => ({
        ...studentReport,

        percentage:
          studentReport.total > 0
            ? Math.round(
              (studentReport.present /
                studentReport.total) *
              100
            )
            : 0,
      })
    );

    res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  }
);

// @desc    Get one student's attendance
// @route   GET /api/attendance/student/:studentId
// @access  Parent, Admin, Teacher
export const getStudentAttendance = asyncHandler(
  async (req, res) => {
    const {
      month,
      year,
      subjectId,
    } = req.query;

    const filter = {
      student: req.params.studentId,
    };

    if (month && year) {
      const { start, end } = getMonthRange(
        month,
        year
      );

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    if (subjectId) {
      filter.subject = subjectId;
    }

    const records = await Attendance.find(filter)
      .populate(
        "subject",
        "name code subjectName subjectCode"
      )
      .populate("class", "name section displayName")
      .populate({
        path: "teacher",
        select: "user designation",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({
        date: -1,
        period: 1,
      });

    const summary = {
      total: records.length,

      present: records.filter(
        (record) => record.status === "present"
      ).length,

      absent: records.filter(
        (record) => record.status === "absent"
      ).length,

      late: records.filter(
        (record) => record.status === "late"
      ).length,

      leave: records.filter(
        (record) => record.status === "leave"
      ).length,

      percentage: 0,
    };

    summary.percentage =
      summary.total > 0
        ? Math.round(
          (summary.present / summary.total) * 100
        )
        : 0;

    const subjectReport =
      createSubjectReport(records);

    res.status(200).json({
      success: true,
      summary,
      subjectReport,
      attendance: records,
    });
  }
);