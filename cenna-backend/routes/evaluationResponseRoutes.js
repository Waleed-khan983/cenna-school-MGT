import express from "express";

import {
    submitEvaluation,
    getEvaluationResponses,
    getEvaluationResponse,
    reviewEvaluationResponse,
    deleteEvaluationResponse,
    getMyResponses,
    getResponsesByAssignment,
    getTeacherResponses,
} from "../controllers/evaluationResponseController.js";

import {
    protect,
    authorize,
} from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| User submits evaluation
|--------------------------------------------------------------------------
*/

router.post(
    "/submit",
    protect,
    authorize(
        "student",
        "parent",
        "teacher",
        "coordinator"
    ),
    submitEvaluation
);

/*
|--------------------------------------------------------------------------
| My Responses
|--------------------------------------------------------------------------
*/

router.get(
  "/my",
  protect,
  authorize(
    "student",
    "parent",
    "teacher",
    "coordinator"
  ),
  getMyResponses
);

/*
|--------------------------------------------------------------------------
| Admin Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("admin"),
  getResponsesByAssignment
);

router.get(
  "/teacher/:teacherId",
  protect,
  authorize("admin"),
  getTeacherResponses
);
/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    protect,
    authorize("admin"),
    getEvaluationResponses
);

router.get(
    "/:id",
    protect,
    authorize("admin"),
    getEvaluationResponse
);

router.put(
    "/review/:id",
    protect,
    authorize("admin"),
    reviewEvaluationResponse
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteEvaluationResponse
);

export default router;