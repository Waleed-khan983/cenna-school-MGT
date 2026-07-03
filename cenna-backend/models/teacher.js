import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  employeeId: String,

  assignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSubject",
    },
  ],


  qualification: String,

  designation: {
    type: String,
    default: "Teacher",
  },

  joiningDate: {
    type: Date,
    default: Date.now,
  },

  salary: Number,

  cnic: String,

  address: String,

  isActive: {
    type: Boolean,
    default: true,
  },
});


const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);

export default Teacher;