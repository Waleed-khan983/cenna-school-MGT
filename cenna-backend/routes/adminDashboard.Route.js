import express from "express";

import { getDashboardStats }
from "../controllers/adminDashboardController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

export default router;