import mongoose from "mongoose";

const ClassSubjectSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
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

ClassSubjectSchema.index(
  {
    class: 1,
    subject: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.ClassSubject ||
  mongoose.model("ClassSubject", ClassSubjectSchema);