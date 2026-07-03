import express from "express";

import {
  createLiveClass,
  getMyLiveClasses,
  getStudentLiveClasses,
  deleteLiveClass,
  joinLiveClass,
  getLiveClassAttendance,
} from "../controllers/liveClassController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("teacher"), createLiveClass);

router.get("/my", protect, authorize("teacher"), getMyLiveClasses);

router.get("/student", protect, authorize("student"), getStudentLiveClasses);

router.delete("/:id", protect, authorize("teacher", "admin"), deleteLiveClass);
router.post(
  "/:id/join",
  protect,
  authorize("student"),
  joinLiveClass
);

router.get(
  "/:id/attendance",
  protect,
  authorize("teacher", "admin"),
  getLiveClassAttendance
);
export default router;