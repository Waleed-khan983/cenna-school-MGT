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
router.get("/", protect, teacherOrAdmin, getClassResults);
router.get("/me", protect, authorize("student"), getMyResults);
router.delete("/:id", protect, teacherOrAdmin, deleteResult);
router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "parent", "teacher", "operator"),
  getStudentResults
);
router.get("/subjects/:classId", protect, teacherOrAdmin, getSubjectsForClass);
router.put("/:id", protect, teacherOrAdmin, updateResult);

export default router;