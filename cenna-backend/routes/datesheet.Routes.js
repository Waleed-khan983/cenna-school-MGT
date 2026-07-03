import express from "express";

import {
  createDatesheet,
  getAllDatesheets,
  deleteDatesheet,
} from "../controllers/datesheetController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  createDatesheet
);

router.get(
  "/",
  protect,
  getAllDatesheets
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteDatesheet
);

export default router;