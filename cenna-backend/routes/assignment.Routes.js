import express from "express";

import {
  createAssignment,
  getMyAssignments,
  deleteAssignment,
  getStudentAssignments,
 
} from "../controllers/assignmentController.js";

import {
  protect,
  teacherOrAdmin,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  protect,
  teacherOrAdmin,
  createAssignment
);

router.get(
  "/my",
  protect,
  teacherOrAdmin,
  getMyAssignments
);
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentAssignments
);

router.delete(
  "/:id",
  protect,
  teacherOrAdmin,
  deleteAssignment
);


export default router;