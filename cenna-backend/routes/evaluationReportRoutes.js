import express from "express";

import { getTeacherOverallReport } from "../controllers/evaluationReportController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Teacher Overall Report
|--------------------------------------------------------------------------
*/

router.get(
  "/teacher/:teacherId",
  protect,
  authorize("admin"),
  getTeacherOverallReport
);

export default router;
