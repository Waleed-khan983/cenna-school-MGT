import asyncHandler from "express-async-handler";
import News from "../models/news.js";
import { getPagination } from "../utils/helpers.js";

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  return value === true || value === "true";
};

const parseTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const getNews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};

  if (req.query.admin !== "true") {
    filter.isPublished = true;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const total = await News.countDocuments(filter);

  const news = await News.find(filter)
    .populate("author", "name email")
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: news.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    news,
  });
});

export const getNewsItem = asyncHandler(async (req, res) => {
  const item = await News.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name email");

  if (!item) {
    res.status(404);
    throw new Error("News not found");
  }

  res.status(200).json({
    success: true,
    news: item,
  });
});

export const createNews = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    category,
    eventDate,
    tags,
    isPublished,
    isPinned,
    image,
  } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const news = await News.create({
    title,
    content,
    category: category || "announcement",
    eventDate: eventDate || undefined,
    tags: parseTags(tags),
    isPublished: parseBoolean(isPublished, true),
    isPinned: parseBoolean(isPinned, false),
    author: req.user?._id,
    image: req.file?.path || image || "",
  });

  const populated = await News.findById(news._id).populate(
    "author",
    "name email"
  );

  res.status(201).json({
    success: true,
    message: "News created successfully",
    news: populated,
  });
});

export const updateNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }

  const {
    title,
    content,
    category,
    eventDate,
    tags,
    isPublished,
    isPinned,
    image,
  } = req.body;

  if (title !== undefined) news.title = title;
  if (content !== undefined) news.content = content;
  if (category !== undefined) news.category = category || "announcement";
  if (eventDate !== undefined) news.eventDate = eventDate || undefined;
  if (tags !== undefined) news.tags = parseTags(tags);
  if (isPublished !== undefined) {
    news.isPublished = parseBoolean(isPublished, true);
  }
  if (isPinned !== undefined) {
    news.isPinned = parseBoolean(isPinned, false);
  }

  if (req.file?.path) {
    news.image = req.file.path;
  } else if (image !== undefined) {
    news.image = image;
  }

  await news.save();

  const populated = await News.findById(news._id).populate(
    "author",
    "name email"
  );

  res.status(200).json({
    success: true,
    message: "News updated successfully",
    news: populated,
  });
});

export const deleteNews = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }

  await news.deleteOne();

  res.status(200).json({
    success: true,
    message: "News deleted successfully",
  });
});