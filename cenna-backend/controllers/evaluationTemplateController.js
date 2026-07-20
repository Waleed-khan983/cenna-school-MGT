import asyncHandler from "express-async-handler";
import EvaluationTemplate from "../models/evaluationTemplate.js";

/*
|--------------------------------------------------------------------------
| Create Template
|--------------------------------------------------------------------------
*/

export const createEvaluationTemplate = asyncHandler(async (req, res) => {
  const template = await EvaluationTemplate.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Evaluation template created successfully.",
    template,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Templates
|--------------------------------------------------------------------------
*/

export const getEvaluationTemplates = asyncHandler(async (req, res) => {
  const templates = await EvaluationTemplate.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: templates.length,
    templates,
  });
});

/*
|--------------------------------------------------------------------------
| Get Single Template
|--------------------------------------------------------------------------
*/

export const getEvaluationTemplate = asyncHandler(async (req, res) => {
  const template = await EvaluationTemplate.findById(req.params.id)
    .populate("createdBy", "name email");

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  res.json({
    success: true,
    template,
  });
});

/*
|--------------------------------------------------------------------------
| Update Template
|--------------------------------------------------------------------------
*/

export const updateEvaluationTemplate = asyncHandler(async (req, res) => {
  const template = await EvaluationTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  Object.assign(template, req.body);

  const updatedTemplate = await template.save();

  res.json({
    success: true,
    message: "Template updated successfully.",
    template: updatedTemplate,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Template
|--------------------------------------------------------------------------
*/

export const deleteEvaluationTemplate = asyncHandler(async (req, res) => {
  const template = await EvaluationTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  await template.deleteOne();

  res.json({
    success: true,
    message: "Template deleted successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| Publish Template
|--------------------------------------------------------------------------
*/

export const publishEvaluationTemplate = asyncHandler(async (req, res) => {
  const template = await EvaluationTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  template.status = "published";

  await template.save();

  res.json({
    success: true,
    message: "Template published successfully.",
    template,
  });
});

/*
|--------------------------------------------------------------------------
| Archive Template
|--------------------------------------------------------------------------
*/

export const archiveEvaluationTemplate = asyncHandler(async (req, res) => {
  const template = await EvaluationTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  template.status = "archived";

  await template.save();

  res.json({
    success: true,
    message: "Template archived successfully.",
    template,
  });
});

// Dynamic Form Builder

export const addSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  template.sections.push({
    title,
    description,
    questions: [],
  });

  await template.save();

  res.json({
    success: true,
    message: "Section added successfully.",
    template,
  });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.params;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  template.sections.pull(sectionId);

  await template.save();

  res.json({
    success: true,
    message: "Section deleted successfully.",
    template,
  });
});

export const addQuestion = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.params;

  const { question, type, required, options } = req.body;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const section = template.sections.id(sectionId);

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  section.questions.push({
    question,
    type,
    required,
    options:
      type === "mcq"
        ? (options || []).map((option) => ({
          text: option,
        }))
        : [],
  });

  await template.save();

  res.json({
    success: true,
    message: "Question added successfully.",
    template,
  });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const { id, sectionId, questionId } = req.params;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const section = template.sections.id(sectionId);

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  section.questions.pull(questionId);

  await template.save();

  res.json({
    success: true,
    message: "Question deleted successfully.",
    template,
  });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const { id, sectionId, questionId } = req.params;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const section = template.sections.id(sectionId);

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  const question = section.questions.id(questionId);

  if (!question) {
    res.status(404);
    throw new Error("Question not found.");
  }

  Object.assign(question, req.body);

  if (req.body.options) {
    question.options = req.body.options.map((option) => ({
      text: option,
    }));
  }

  await template.save();

  res.json({
    success: true,
    message: "Question updated successfully.",
    template,
  });
});

export const addOption = asyncHandler(async (req, res) => {
  const { id, sectionId, questionId } = req.params;
  const { text } = req.body;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const section = template.sections.id(sectionId);

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  const question = section.questions.id(questionId);

  if (!question) {
    res.status(404);
    throw new Error("Question not found.");
  }

  if (question.type !== "mcq") {
    res.status(400);
    throw new Error("Only MCQ questions can have options.");
  }

  question.options.push({ text });

  await template.save();

  res.json({
    success: true,
    message: "Option added successfully.",
    template,
  });
});

export const deleteOption = asyncHandler(async (req, res) => {
  const { id, sectionId, questionId, optionIndex } = req.params;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const section = template.sections.id(sectionId);

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  const question = section.questions.id(questionId);

  if (!question) {
    res.status(404);
    throw new Error("Question not found.");
  }

  question.options.splice(Number(optionIndex), 1);

  await template.save();

  res.json({
    success: true,
    message: "Option deleted successfully.",
    template,
  });
});

export const reorderSections = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sections } = req.body;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  template.sections = sections;

  await template.save();

  res.json({
    success: true,
    message: "Sections reordered successfully.",
    template,
  });
});


export const reorderQuestions = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.params;
  const { questions } = req.body;

  const template = await EvaluationTemplate.findById(id);

  if (!template) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const section = template.sections.id(sectionId);

  if (!section) {
    res.status(404);
    throw new Error("Section not found.");
  }

  section.questions = questions;

  await template.save();

  res.json({
    success: true,
    message: "Questions reordered successfully.",
    template,
  });
});