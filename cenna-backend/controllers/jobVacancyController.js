import asyncHandler from "express-async-handler";
import JobVacancy from "../models/jobVacancy.js";

export const createJobVacancy = asyncHandler(async (req, res) => {
  const vacancy = await JobVacancy.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job vacancy created successfully",
    vacancy,
  });
});

export const getPublicJobVacancies = asyncHandler(async (req, res) => {
  const vacancies = await JobVacancy.find({
    status: "active",
    lastDate: { $gte: new Date() },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: vacancies.length,
    vacancies,
  });
});

export const getAllJobVacancies = asyncHandler(async (req, res) => {
  const vacancies = await JobVacancy.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: vacancies.length,
    vacancies,
  });
});

export const updateJobVacancy = asyncHandler(async (req, res) => {
  const vacancy = await JobVacancy.findById(req.params.id);

  if (!vacancy) {
    res.status(404);
    throw new Error("Job vacancy not found");
  }

  Object.assign(vacancy, req.body);

  await vacancy.save();

  res.status(200).json({
    success: true,
    message: "Job vacancy updated successfully",
    vacancy,
  });
});

export const deleteJobVacancy = asyncHandler(async (req, res) => {
  const vacancy = await JobVacancy.findById(req.params.id);

  if (!vacancy) {
    res.status(404);
    throw new Error("Job vacancy not found");
  }

  await vacancy.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job vacancy deleted successfully",
  });
});