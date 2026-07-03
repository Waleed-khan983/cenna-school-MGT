import express from "express";

import {
  launchEvaluation,
  getCampaigns,
  closeCampaign,
  getActiveEvaluations,
  submitEvaluation,
  getEvaluations,
} from "../controllers/evaluationController.js";

import {
  protect,
  adminOnly,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();


// ================================
// ADMIN
// ================================

router.post(
  "/campaign",
  protect,
  adminOnly,
  launchEvaluation
);

router.get(
  "/campaigns",
  protect,
  adminOnly,
  getCampaigns
);

router.put(
  "/campaign/:id/close",
  protect,
  adminOnly,
  closeCampaign
);

router.get(
  "/reports",
  protect,
  adminOnly,
  getEvaluations
);


// ================================
// STUDENT
// ================================

router.get(
  "/active",
  protect,
  authorize("student"),
  getActiveEvaluations
);

router.post(
  "/submit",
  protect,
  authorize("student"),
  submitEvaluation
);

export default router;