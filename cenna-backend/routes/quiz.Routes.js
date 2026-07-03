import express from "express";

import {
  createQuiz,
  getMyQuizzes,
  getQuiz,
  addQuizQuestion,
  deleteQuizQuestion,
  deleteQuiz,
  getStudentQuizzes,
  submitQuizAttempt,
  publishQuiz,
  getQuizResults,
  publishQuizResults,
} from "../controllers/quizController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/student", protect, authorize("student"), getStudentQuizzes);

router.post(
  "/student/submit",
  protect,
  authorize("student"),
  submitQuizAttempt
);

router.get("/my", protect, authorize("teacher"), getMyQuizzes);

router.put("/:id/publish", protect, authorize("teacher"), publishQuiz);

router.get("/:id/results", protect, authorize("teacher"), getQuizResults);

router.put(
  "/:id/publish-results",
  protect,
  authorize("teacher"),
  publishQuizResults
);

router.get("/:id", protect, authorize("teacher", "student"), getQuiz);

router.post("/", protect, authorize("teacher"), createQuiz);

router.post("/questions", protect, authorize("teacher"), addQuizQuestion);

router.delete(
  "/questions/:id",
  protect,
  authorize("teacher"),
  deleteQuizQuestion
);

router.delete("/:id", protect, authorize("teacher"), deleteQuiz);

export default router;