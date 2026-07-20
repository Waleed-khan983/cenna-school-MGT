import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["mcq", "short-answer"],
      default: "mcq",
    },

    required: {
      type: Boolean,
      default: true,
    },

    options: [optionSchema],
  },
  { _id: true }
);

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    questions: [questionSchema],
  },
  { _id: true }
);

const evaluationTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    templateType: {
      type: String,
      enum: [
        "teacher-observation",
        "teacher-demo",
        "student-observation",
        "blank",
      ],
      default: "blank",
    },

    targetRoles: [
      {
        type: String,
        enum: [
          "student",
          "parent",
          "teacher",
          "coordinator",
        ],
      },
    ],

    assignedTeachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],

    assignedCoordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    sections: [sectionSchema],

    // -------- PDF SETTINGS --------

    observerFields: [
      {
        type: String,
      },
    ],

    summary: [
      {
        type: String,
      },
    ],

    ratingScale: [
      {
        level: String,
        percentage: String,
        rating: String,
      },
    ],

    signatures: [
      {
        type: String,
      },
    ],

    pdf: {
      showTeacherInfo: {
        type: Boolean,
        default: false,
      },

      showStudentInfo: {
        type: Boolean,
        default: false,
      },

      showObserverFields: {
        type: Boolean,
        default: false,
      },

      showSerialNo: {
        type: Boolean,
        default: true,
      },

      showRemarks: {
        type: Boolean,
        default: true,
      },

      showSectionHeaders: {
        type: Boolean,
        default: true,
      },

      showScoreColumns: {
        type: Boolean,
        default: true,
      },

      scoreColumns: [
        {
          type: String,
        },
      ],

      remarksColumn: {
        type: Boolean,
        default: true,
      },

      showScoringSummary: {
        type: Boolean,
        default: false,
      },

      showRatingTable: {
        type: Boolean,
        default: false,
      },

      showFinalDecision: {
        type: Boolean,
        default: false,
      },

      showSignatures: {
        type: Boolean,
        default: true,
      },
    },

    finalDecision: {
      type: Boolean,
      default: false,
    },

    // -------- STATUS --------

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EvaluationTemplate =
  mongoose.models.EvaluationTemplate ||
  mongoose.model(
    "EvaluationTemplate",
    evaluationTemplateSchema
  );

export default EvaluationTemplate;