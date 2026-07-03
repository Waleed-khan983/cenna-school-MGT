import express from "express";

const router = express.Router();

import {
  getClassMonitoring,
  getAttendanceMonitoring,
  getTeacherMonitoring,
  getStudentPerformance,
  getCoordinatorDashboard,
  getStudentRemarksMonitoring,
  getAwardRecommendations,
} from "../controllers/coordinatorController.js";

import {
    protect,
    authorize,
} from "../middleware/auth.js";

router.get(
  "/awards",
  protect,
  authorize("coordinator"),
  getAwardRecommendations
);

router.get(
  "/remarks",
  protect,
  authorize("coordinator"),
  getStudentRemarksMonitoring
);

router.get(
  "/performance",
  protect,
  authorize("coordinator"),
  getStudentPerformance
);

router.get(
  "/teachers",
  protect,
  authorize("coordinator"),
  getTeacherMonitoring
);

router.get(
    "/dashboard",
    protect,
    authorize("coordinator"),
    getCoordinatorDashboard
);

router.get(
    "/classes",
    protect,
    authorize("coordinator"),
    getClassMonitoring
);

router.get(
  "/attendance",
  protect,
  authorize("coordinator"),
  getAttendanceMonitoring
);

export default router;