import asyncHandler from "express-async-handler";

import Evaluation from "../models/evaluation.js";
import EvaluationCampaign from "../models/evaluationCampaign.js";
import Student from "../models/Student.js";


// ================================
// ADMIN
// ================================

export const launchEvaluation = asyncHandler(
  async (req, res) => {
    const campaign =
      await EvaluationCampaign.create(req.body);

    res.status(201).json({
      success: true,
      message: "Evaluation launched",
      campaign,
    });
  }
);

export const getCampaigns = asyncHandler(
  async (req, res) => {
    const campaigns =
      await EvaluationCampaign.find()
        .populate({
          path: "teacher",
          populate: {
            path: "user",
            select: "name",
          },
        })
        .sort("-createdAt");

    res.status(200).json({
      success: true,
      campaigns,
    });
  }
);

export const closeCampaign =
  asyncHandler(async (req, res) => {
    const campaign =
      await EvaluationCampaign.findById(
        req.params.id
      );

    if (!campaign) {
      res.status(404);
      throw new Error(
        "Campaign not found"
      );
    }

    campaign.isActive = false;

    await campaign.save();

    res.status(200).json({
      success: true,
      message: "Campaign closed",
    });
  });


// ================================
// STUDENT
// ================================

export const getActiveEvaluations =
  asyncHandler(async (req, res) => {
    const campaigns =
      await EvaluationCampaign.find({
        isActive: true,
      }).populate({
        path: "teacher",
        populate: {
          path: "user",
          select: "name",
        },
      });

    res.status(200).json({
      success: true,
      campaigns,
    });
  });

export const submitEvaluation =
  asyncHandler(async (req, res) => {
    const student =
      await Student.findOne({
        user: req.user._id,
      });

    if (!student) {
      res.status(404);
      throw new Error(
        "Student not found"
      );
    }

    const {
      campaign,
      teacher,
      punctuality,
      teachingQuality,
      assignmentGiven,
      assignmentChecking,
      communication,
      discipline,
      remarks,
    } = req.body;

    const exists =
      await Evaluation.findOne({
        campaign,
        teacher,
        student: student._id,
      });

    if (exists) {
      res.status(400);
      throw new Error(
        "You already submitted evaluation"
      );
    }

    const evaluation =
      await Evaluation.create({
        campaign,
        teacher,
        student: student._id,
        punctuality,
        teachingQuality,
        assignmentGiven,
        assignmentChecking,
        communication,
        discipline,
        remarks,
      });

    res.status(201).json({
      success: true,
      message: "Evaluation submitted",
      evaluation,
    });
  });


// ================================
// ADMIN REPORTS
// ================================

export const getEvaluations =
  asyncHandler(async (req, res) => {
    const evaluations =
      await Evaluation.find()
        .populate({
          path: "teacher",
          populate: {
            path: "user",
            select: "name",
          },
        })
        .populate({
          path: "student",
          populate: {
            path: "user",
            select: "name",
          },
        });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      evaluations,
    });
  });