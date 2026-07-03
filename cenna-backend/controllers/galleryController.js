import asyncHandler from "express-async-handler";
import Gallery from "../models/gallery.js";

export const getGallery = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.admin !== "true") {
    filter.isPublished = true;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const gallery = await Gallery.find(filter)
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: gallery.length,
    gallery,
  });
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, description, category, eventDate, isPublished } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  if (!req.file?.path) {
    res.status(400);
    throw new Error("Image is required");
  }

  const item = await Gallery.create({
    title,
    description,
    category,
    eventDate: eventDate || undefined,
    isPublished: isPublished === "true" || isPublished === true,
    image: req.file.path,
    uploadedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Gallery item uploaded successfully",
    item,
  });
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  const { title, description, category, eventDate, isPublished } = req.body;

  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (category !== undefined) item.category = category;
  if (eventDate !== undefined) item.eventDate = eventDate || undefined;

  if (isPublished !== undefined) {
    item.isPublished = isPublished === "true" || isPublished === true;
  }

  if (req.file?.path) {
    item.image = req.file.path;
  }

  await item.save();

  res.status(200).json({
    success: true,
    message: "Gallery item updated successfully",
    item,
  });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: "Gallery item deleted successfully",
  });
});