import asyncHandler from "express-async-handler";
import Setting from "../models/setting.js";

const toNumber = (value, fallback) => {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

const toBoolean = (value, fallback = true) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
};

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  res.status(200).json({
    success: true,
    settings,
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    settings.schoolName = req.body.schoolName || settings.schoolName;
    settings.schoolAddress = req.body.schoolAddress || "";
    settings.schoolPhone = req.body.schoolPhone || "";
    settings.schoolEmail = req.body.schoolEmail || "";
    settings.website = req.body.website || "";
    settings.currentSession = req.body.currentSession || settings.currentSession;

    settings.passingMarks = toNumber(req.body.passingMarks, settings.passingMarks);
    settings.attendancePercentage = toNumber(
      req.body.attendancePercentage,
      settings.attendancePercentage
    );
    settings.lateFeeFine = toNumber(req.body.lateFeeFine, settings.lateFeeFine);
    settings.feeDueDay = toNumber(req.body.feeDueDay, settings.feeDueDay);

    settings.currency = req.body.currency || "PKR";

    settings.enableEvaluations = toBoolean(
      req.body.enableEvaluations,
      settings.enableEvaluations
    );
    settings.enableNews = toBoolean(req.body.enableNews, settings.enableNews);
    settings.enableGallery = toBoolean(
      req.body.enableGallery,
      settings.enableGallery
    );
    settings.enableOnlineClasses = toBoolean(
      req.body.enableOnlineClasses,
      settings.enableOnlineClasses
    );

    if (req.file?.path) {
      settings.schoolLogo = req.file.path;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});