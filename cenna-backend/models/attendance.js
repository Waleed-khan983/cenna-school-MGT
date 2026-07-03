import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    period: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      required: true,
      default: "present",
    },

    remark: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
A student cannot be marked twice for the same:
subject + date + period.
*/
AttendanceSchema.index(
  {
    student: 1,
    subject: 1,
    date: 1,
    period: 1,
  },
  {
    unique: true,
  }
);

/*
Useful for loading attendance for one class and subject.
*/
AttendanceSchema.index({
  class: 1,
  subject: 1,
  date: 1,
  period: 1,
});

const Attendance =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);

export default Attendance;