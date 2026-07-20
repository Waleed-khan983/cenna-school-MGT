import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const evaluationResponseSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationAssignment",
      required: true,
      index: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationTemplate",
      required: true,
      index: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    submittedRole: {
      type: String,
      enum: [
        "student",
        "parent",
        "teacher",
        "coordinator",
      ],
      required: true,
    },

    // Teacher being evaluated
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true,
    },

    // Evaluator (optional based on role)
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    metadata: {
      type: Map,
      of: String,
      default: {},
    },

    answers: [answerSchema],

    totalScore: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["submitted", "reviewed"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions
evaluationResponseSchema.index(
  {
    assignment: 1,
    submittedBy: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "EvaluationResponse",
  evaluationResponseSchema
);