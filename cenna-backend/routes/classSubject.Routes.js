import express from "express";

import {
  getClassSubjects,
  getClassSubject,
  createClassSubject,
  updateClassSubject,
  deleteClassSubject,
  getClassSubjectsByClass,
  getTeacherAssignments,
  getMyTeacherAssignments,
  getMyClassSubjects,
} from "../controllers/classSubjectController.js";

import {
  protect,
  adminOnly,
  teacherOrAdmin,
  allPortalUsers,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, allPortalUsers, getClassSubjects);

router.get(
  "/student/my-subjects",
  protect,
  authorize("student"),
  getMyClassSubjects
);

router.get(
  "/teacher/my-assignments",
  protect,
  authorize("teacher"),
  getMyTeacherAssignments
);

router.get(
  "/class/:classId",
  protect,
  allPortalUsers,
  getClassSubjectsByClass
);

router.get(
  "/teacher/:teacherId",
  protect,
  teacherOrAdmin,
  getTeacherAssignments
);

router.get("/:id", protect, allPortalUsers, getClassSubject);

router.post("/", protect, adminOnly, createClassSubject);

router.put("/:id", protect, adminOnly, updateClassSubject);

router.delete("/:id", protect, adminOnly, deleteClassSubject);

export default router;