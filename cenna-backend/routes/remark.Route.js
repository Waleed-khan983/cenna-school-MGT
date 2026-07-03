import express from "express";

import {
  createRemark,
  getMyRemarks,
  getRemarks,
  getStudentRemarks,
  getMyStudentRemarks,
  deleteRemark,
} from "../controllers/remarkController.js";

import { protect, teacherOrAdmin, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("teacher"), createRemark);

router.get("/my", protect, authorize("teacher"), getMyRemarks);

router.get("/me", protect, authorize("student"), getMyStudentRemarks);

router.get("/", protect, teacherOrAdmin, getRemarks);

router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "teacher", "parent"),
  getStudentRemarks
);

router.delete("/:id", protect, teacherOrAdmin, deleteRemark);

export default router;