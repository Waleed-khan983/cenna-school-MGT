import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Optional
    rollNumber: {
      type: String,
      trim: true,
      sparse: true,
      default: undefined,
    },

    // Login ID
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    section: {
      type: String,
      default: "A",
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    religion: {
      type: String,
      default: "Islam",
    },

    nationality: {
      type: String,
      default: "Pakistani",
    },

    bForm: String,

    address: String,

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
    },

    bloodGroup: String,

    prevSchool: String,

    prevMarks: String,

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);

export default Student;