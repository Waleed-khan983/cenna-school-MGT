import asyncHandler from "express-async-handler";

import EvaluationTemplate from "../models/evaluationTemplate.js";
import EvaluationResponse from "../models/evaluationResponse.js";

import {
    generateEvaluationPdf,
} from "../utils/evaluationPdfGenerator.js";

/*
|--------------------------------------------------------------------------
| Generate Blank Evaluation PDF
|--------------------------------------------------------------------------
*/

export const printBlankEvaluation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const template = await EvaluationTemplate.findById(id);

    if (!template) {
        res.status(404);
        throw new Error("Evaluation template not found.");
    }

    generateEvaluationPdf(template, res);
});

/*
|--------------------------------------------------------------------------
| Generate Filled Evaluation PDF
|--------------------------------------------------------------------------
*/

export const printFilledEvaluation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const response = await EvaluationResponse.findById(id)
        .populate("template")
        .populate("submittedBy", "name email role")
        .populate({
            path: "teacher",
            populate: {
                path: "user",
                select: "name email",
            },
        });

    if (!response) {
        res.status(404);
        throw new Error("Evaluation response not found.");
    }

    generateEvaluationPdf(
        response.template,
        res,
        true,
        response
    );
});