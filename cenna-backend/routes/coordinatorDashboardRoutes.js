import express from "express";

import {
  getCoordinatorDashboard,
} from "../controllers/coordinatorController.js";

import {
  protect,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("coordinator"),
  getCoordinatorDashboard
);

export default router;