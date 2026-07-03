import express from "express";

import {
    markAttendance,
    getMyAttendance,
    getMonthlyReport,
    getClassAttendance,
    getStudentAttendance,
} from "../controllers/attendanceController.js";

import {
    protect,
    teacherOrAdmin,
    authorize,
} from "../middleware/auth.js";

const router = express.Router();

/*
Teacher marks attendance for their subject.
*/
router.post(
    "/mark",
    protect,
    teacherOrAdmin,
    markAttendance
);

/*
Logged-in student views their own attendance.
*/
router.get(
    "/me",
    protect,
    authorize("student"),
    getMyAttendance
);

/*
Admin or teacher views a monthly report.
*/
router.get(
    "/report/monthly",
    protect,
    teacherOrAdmin,
    getMonthlyReport
);

/*
Admin or teacher views attendance for a class.
Query examples:
?subjectId=123
?date=2026-06-19
?period=1
*/
router.get(
    "/class/:classId",
    protect,
    teacherOrAdmin,
    getClassAttendance
);

/*
Parent, admin or teacher views one student.
*/
router.get(
    "/student/:studentId",
    protect,
    authorize("admin", "parent", "teacher"),
    getStudentAttendance
);

export default router;