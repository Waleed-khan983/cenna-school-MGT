import mongoose from "mongoose";

const RemarkSchema = new mongoose.Schema(
  {
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

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },

    type: {
      type: String,
      enum: [
        "Academic",
        "Behavior",
        "Discipline",
        "Performance",
        "General",
      ],
      default: "General",
    },

    remark: {
      type: String,
      required: true,
      trim: true,
    },

    isPositive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Remark ||
  mongoose.model("Remark", RemarkSchema);