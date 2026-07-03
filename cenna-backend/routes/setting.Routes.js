import express from "express";

const router = express.Router();

import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";

import { protect, adminOnly } from "../middleware/auth.js";
import { uploadImage } from "../config/cloudinary.js";

router.get(
  "/",

  getSettings
);

router.put(
  "/",
  protect,
  adminOnly,
  uploadImage.single("schoolLogo"),
  updateSettings

);

export default router;