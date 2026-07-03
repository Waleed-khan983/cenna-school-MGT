import express from "express";

import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

import { protect, adminOnly } from "../middleware/auth.js";
import { uploadImage } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getGallery);

router.post(
  "/",
  protect,
  adminOnly,
  uploadImage.single("image"),
  createGalleryItem
);

router.put(
  "/:id",
  protect,
  adminOnly,
  uploadImage.single("image"),
  updateGalleryItem
);

router.delete("/:id", protect, adminOnly, deleteGalleryItem);

export default router;