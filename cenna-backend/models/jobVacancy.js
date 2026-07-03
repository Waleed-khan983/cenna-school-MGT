
import mongoose from "mongoose";

const JobVacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract"],
      default: "Full-Time",
    },

    seats: {
      type: Number,
      default: 1,
    },

    qualification: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    lastDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const JobVacancy =
  mongoose.models.JobVacancy ||
  mongoose.model("JobVacancy", JobVacancySchema);

export default JobVacancy;