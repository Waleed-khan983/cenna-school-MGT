import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // MongoDB already enforces a unique index on this field (created by an
  // earlier schema version). It was never actually populated by
  // createTeacher, so every teacher had employeeId===undefined — which a
  // non-sparse unique index treats as one shared value, so only the FIRST
  // teacher ever created could succeed. createTeacher now generates a real
  // "TCH-NNN" value via utils/sequence.js for every new teacher.
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
  },

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