import express from "express";

import {
  submitJobApplication,
  getAllJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
} from "../controllers/jobApplicationController.js";

import { protect, adminOnly } from "../middleware/auth.js";
import { uploadCV } from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/public",
  uploadCV.single("cv"),
  submitJobApplication
);

router.get("/", protect, adminOnly, getAllJobApplications);

router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateJobApplicationStatus
);

router.delete("/:id", protect, adminOnly, deleteJobApplication);

export default router;