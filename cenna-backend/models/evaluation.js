import mongoose from "mongoose";

const ratingEnum = [
  "Strongly Agree",
  "Agree",
  "Good",
  "Disagree",
];

const EvaluationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationCampaign",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    punctuality: {
      type: String,
      enum: ratingEnum,
      required: true,
    },

    teachingQuality: {
      type: String,
      enum: ratingEnum,
      required: true,
    },

    assignmentGiven: {
      type: String,
      enum: ratingEnum,
      required: true,
    },

    assignmentChecking: {
      type: String,
      enum: ratingEnum,
      required: true,
    },

    communication: {
      type: String,
      enum: ratingEnum,
      required: true,
    },

    discipline: {
      type: String,
      enum: ratingEnum,
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

EvaluationSchema.index(
  { campaign: 1, teacher: 1, student: 1 },
  { unique: true }
);

const Evaluation =
  mongoose.models.Evaluation ||
  mongoose.model("Evaluation", EvaluationSchema);

export default Evaluation;