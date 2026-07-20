import express from "express";

import {
  printBlankEvaluation,
  printFilledEvaluation,
} from "../controllers/evaluationPdfController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Blank Evaluation PDF
|--------------------------------------------------------------------------
*/

router.get(
  "/template/:id/blank",
  protect,
  adminOnly,
  printBlankEvaluation
);

/*
|--------------------------------------------------------------------------
| Filled Evaluation PDF
|--------------------------------------------------------------------------
*/

router.get(
  "/response/:id/filled",
  protect,
  adminOnly,
  printFilledEvaluation
);

export default router;