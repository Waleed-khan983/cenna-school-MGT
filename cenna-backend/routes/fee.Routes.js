import express from "express";

import {
  generateChallan,
  collectFee,
  getFeesByStudent,
  getMyFees,
  getDefaulters,
  getAllFees,
  deleteFee,
} from "../controllers/feeController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  authorize("admin", "accountant"),
  generateChallan
);

router.put(
  "/collect/:id",
  protect,
  authorize("admin", "accountant"),
  collectFee
);

router.get("/me", protect, authorize("student"), getMyFees);

router.get(
  "/defaulters",
  protect,
  authorize("admin", "accountant"),
  getDefaulters
);

router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "parent", "accountant"),
  getFeesByStudent
);

router.get(
  "/",
  protect,
  authorize("admin", "accountant"),
  getAllFees
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "accountant"),
  deleteFee
);

export default router;