import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobVacancy",
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: String,
    cnic: String,
    phone: String,
    email: String,
    address: String,
    qualification: String,
    experience: String,
    expectedSalary: String,
    coverLetter: String,

    cv: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "interview", "selected", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;