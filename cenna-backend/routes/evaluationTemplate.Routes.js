import express from "express";

import {
  createEvaluationTemplate,
  getEvaluationTemplates,
  getEvaluationTemplate,
  updateEvaluationTemplate,
  deleteEvaluationTemplate,
  publishEvaluationTemplate,
  archiveEvaluationTemplate,

  addSection,
  deleteSection,
  addQuestion,
  updateQuestion,
  deleteQuestion,

  addOption,
  deleteOption,

  reorderSections,
  reorderQuestions,

} from "../controllers/evaluationTemplateController.js";

import {
  protect,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

// Admin only

router
  .route("/")
  .post(
    protect,
    authorize("admin"),
    createEvaluationTemplate
  )
  .get(
    protect,
    authorize("admin"),
    getEvaluationTemplates
  );

router
  .route("/:id")
  .get(
    protect,
    authorize("admin"),
    getEvaluationTemplate
  )
  .put(
    protect,
    authorize("admin"),
    updateEvaluationTemplate
  )
  .delete(
    protect,
    authorize("admin"),
    deleteEvaluationTemplate
  );

router.put(
  "/publish/:id",
  protect,
  authorize("admin"),
  publishEvaluationTemplate
);

router.put(
  "/archive/:id",
  protect,
  authorize("admin"),
  archiveEvaluationTemplate
);

// ======================================================
// Dynamic Form Builder
// ======================================================

// Add Section
router.post(
  "/:id/sections",
  protect,
  authorize("admin"),
  addSection
);

// Delete Section
router.delete(
  "/:id/sections/:sectionId",
  protect,
  authorize("admin"),
  deleteSection
);

// Add Question
router.post(
  "/:id/sections/:sectionId/questions",
  protect,
  authorize("admin"),
  addQuestion
);

// Update Question
router.put(
  "/:id/sections/:sectionId/questions/:questionId",
  protect,
  authorize("admin"),
  updateQuestion
);

// Delete Question
router.delete(
  "/:id/sections/:sectionId/questions/:questionId",
  protect,
  authorize("admin"),
  deleteQuestion
);

router.post(
  "/:id/sections/:sectionId/questions/:questionId/options",
  protect,
  authorize("admin"),
  addOption
);

router.delete(
  "/:id/sections/:sectionId/questions/:questionId/options/:optionIndex",
  protect,
  authorize("admin"),
  deleteOption
);

router.put(
  "/:id/reorder-sections",
  protect,
  authorize("admin"),
  reorderSections
);

router.put(
  "/:id/sections/:sectionId/reorder-questions",
  protect,
  authorize("admin"),
  reorderQuestions
);

export default router;