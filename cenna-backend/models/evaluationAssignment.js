import mongoose from "mongoose";

const evaluationAssignmentSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationTemplate",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      enum: [
        "student",
        "teacher",
        "parent",
        "coordinator",
      ],
      required: true,
    },

    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignedTeachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],

    assignedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    assignedSections: [
      {
        type: String,
        trim: true,
      },
    ],

    title: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },

    startDate: Date,

    dueDate: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    allowMultipleResponses: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "EvaluationAssignment",
  evaluationAssignmentSchema
);