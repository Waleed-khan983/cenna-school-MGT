import express from "express";

import {
  enterResults,
  getClassResults,
  getMyResults,
  getStudentResults,
  getSubjectsForClass,
  updateResult,
  deleteResult,
  
} from "../controllers/resultController.js";

import { protect, teacherOrAdmin, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, teacherOrAdmin, enterResults);
// Coordinator added: school-wide read access, matching the unrestricted
// pattern already used for every other coordinator monitoring endpoint
// (getClassMonitoring, getAttendanceMonitoring, getStudentPerformance, etc
// in coordinatorController.js) — no per-record ownership check needed for
// this role, same as admin/operator on these same two routes.
router.get("/", protect, authorize("admin", "teacher", "coordinator"), getClassResults);
router.get("/me", protect, authorize("student"), getMyResults);
router.delete("/:id", protect, teacherOrAdmin, deleteResult);
router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "parent", "teacher", "operator", "coordinator"),
  getStudentResults
);
router.get("/subjects/:classId", protect, teacherOrAdmin, getSubjectsForClass);
router.put("/:id", protect, teacherOrAdmin, updateResult);

export default router;