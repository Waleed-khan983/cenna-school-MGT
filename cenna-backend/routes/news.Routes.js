import express from "express";

import {
  getNews,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";

import { protect, adminOnly } from "../middleware/auth.js";
import { uploadImage } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getNews);
router.get("/:id", getNewsItem);

router.post("/", protect, adminOnly, uploadImage.single("image"), createNews);
router.put("/:id", protect, adminOnly, uploadImage.single("image"), updateNews);
router.delete("/:id", protect, adminOnly, deleteNews);

export default router;