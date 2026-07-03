import express from "express";

import {
  createTimetable,
  getAllTimetables,
  deleteTimetable,
} from "../controllers/timetableController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  createTimetable
);

router.get(
  "/",
  protect,
  getAllTimetables
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTimetable
);

export default router;