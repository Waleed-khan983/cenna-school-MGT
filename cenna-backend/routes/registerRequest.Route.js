import express from "express";

import {
  createRegisterRequest,
  getRegisterRequests,
  getRegisterRequest,
  updateRegisterRequestStatus,
  deleteRegisterRequest,
} from "../controllers/registerRequestController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createRegisterRequest);

router.get("/", protect, adminOnly, getRegisterRequests);
router.get("/:id", protect, adminOnly, getRegisterRequest);
router.put("/:id", protect, adminOnly, updateRegisterRequestStatus);
router.delete("/:id", protect, adminOnly, deleteRegisterRequest);

export default router;