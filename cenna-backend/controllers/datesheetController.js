import asyncHandler from "express-async-handler";
import Datesheet from "../models/datesheet.js";

export const createDatesheet = asyncHandler(async (req, res) => {
  const datesheet = await Datesheet.create(req.body);

  res.status(201).json({
    success: true,
    datesheet,
  });
});

export const getAllDatesheets = asyncHandler(async (req, res) => {
  const datesheets = await Datesheet.find()
    .populate("classId")
    .populate("subjectId");

  res.json({
    success: true,
    datesheets,
  });
});

export const deleteDatesheet = asyncHandler(async (req, res) => {
  await Datesheet.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Datesheet deleted",
  });
});