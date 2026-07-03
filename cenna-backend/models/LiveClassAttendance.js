import mongoose from "mongoose";

const LiveClassAttendanceSchema = new mongoose.Schema(
  {
    liveClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveClass",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

LiveClassAttendanceSchema.index(
  { liveClass: 1, student: 1 },
  { unique: true }
);

export default mongoose.models.LiveClassAttendance ||
  mongoose.model("LiveClassAttendance", LiveClassAttendanceSchema);