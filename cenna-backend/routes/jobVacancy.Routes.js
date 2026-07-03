import express from "express";

import {
  createJobVacancy,
  getPublicJobVacancies,
  getAllJobVacancies,
  updateJobVacancy,
  deleteJobVacancy,
} from "../controllers/jobVacancyController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/public", getPublicJobVacancies);

router.post("/", protect, adminOnly, createJobVacancy);
router.get("/", protect, adminOnly, getAllJobVacancies);
router.put("/:id", protect, adminOnly, updateJobVacancy);
router.delete("/:id", protect, adminOnly, deleteJobVacancy);

export default router;