import mongoose from "mongoose";

const PromotionHistorySchema = new mongoose.Schema(
  {
    fromClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    toClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    fromSection: {
      type: String,
      trim: true,
    },

    toSection: {
      type: String,
      trim: true,
      default: "A",
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    promotedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    promotedAt: {
      type: Date,
      default: Date.now,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true }
);

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rollNumber: {
      type: String,
      trim: true,
      sparse: true,
      default: undefined,
    },

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

    // ==========================
    // Promotion Fields
    // ==========================

    academicYear: {
      type: String,
      trim: true,
      default: "2026-2027",
      index: true,
    },

    promotionStatus: {
      type: String,
      enum: ["studying", "promoted", "graduated", "left"],
      default: "studying",
      index: true,
    },

    promotionHistory: {
      type: [PromotionHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;