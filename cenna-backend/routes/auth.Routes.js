import express from "express";
import { uploadImage } from "../config/cloudinary.js";

import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", protect, adminOnly, register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put(
  "/update-profile",
  protect,
  uploadImage.single("avatar"),
  updateProfile
); router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/logout", protect, logout);

export default router;