// models/alumni.js

import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    fullName: String,
    fatherName: String,
    admissionNo: String,
    batch: String,
    passingYear: Number,

    email: String,
    phone: String,
    cnic: String,

    profession: String,
    organization: String,
    designation: String,

    address: String,
    city: String,
    country: String,

    linkedIn: String,

    status: {
      type: String,
      enum: ["pending", "approved"],                // change to approved               
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Alumni",
  alumniSchema
);