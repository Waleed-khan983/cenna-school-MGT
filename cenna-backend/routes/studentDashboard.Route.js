import express from "express";

import {
  getStudentDashboard,
} from "../controllers/studentDashboardController.js";

import {
  protect,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentDashboard
);

export default router;