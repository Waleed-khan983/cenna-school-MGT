import express from "express";

import {
  getUsers,
  getUser,
  toggleUserStatus,
  deleteUser,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, adminOnly, getUser);

router.put(
  "/toggle-status/:id",
  protect,
  adminOnly,
  toggleUserStatus
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

export default router;