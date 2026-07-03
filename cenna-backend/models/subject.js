import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },

   

   

    maxMarks: {
      type: Number,
      default: 100,
    },

    passMark: {
      type: Number,
      default: 40,
    },

    isElective: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Subject =
  mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);

export default Subject;