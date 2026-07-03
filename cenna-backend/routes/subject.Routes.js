import express from "express";
import {
  getSubjects,
  getSubject,
  getMySubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import {
  protect,
  adminOnly,
  allPortalUsers,
  authorize,
} from "../middleware/auth.js";
const router = express.Router();

router.get("/", protect, allPortalUsers, getSubjects);
router.get(
  "/student/my-subjects",
  protect,
  authorize("student"),
  getMySubjects
);
router.get("/:id", protect, allPortalUsers, getSubject);
router.post("/", protect, adminOnly, createSubject);
router.put("/:id", protect, adminOnly, updateSubject);
router.delete("/:id", protect, adminOnly, deleteSubject);

export default router;