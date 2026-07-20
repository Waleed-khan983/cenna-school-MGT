import express from "express";

import {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  closeAssignment,
  getMyAssignments,
} from "../controllers/evaluationAssignmentController.js";

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
    createAssignment
  )
  .get(
    protect,
    authorize("admin"),
    getAssignments
  );

router.get(
  "/my",
  protect,
  getMyAssignments
);

router
  .route("/:id")
  .get(
    protect,
    authorize("admin"),
    getAssignment
  )
  .put(
    protect,
    authorize("admin"),
    updateAssignment
  )
  .delete(
    protect,
    authorize("admin"),
    deleteAssignment
  );

router.put(
  "/publish/:id",
  protect,
  authorize("admin"),
  publishAssignment
);

router.put(
  "/close/:id",
  protect,
  authorize("admin"),
  closeAssignment
);

export default router;