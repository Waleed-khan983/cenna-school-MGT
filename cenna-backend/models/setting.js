import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "CENNA School & College Pabbi",
    },

    schoolLogo: {
      type: String,
      default: "",
    },

    schoolAddress: {
      type: String,
      default: "",
    },

    schoolPhone: {
      type: String,
      default: "",
    },

    schoolEmail: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    whatsappNumber: {
      type: String,
      default: "",
    },

    googleMapLink: {
      type: String,
      default: "",
    },

    officeHours: {
      type: String,
      default: "Mon-Sat: 8 AM - 3 PM",
    },

    currentSession: {
      type: String,
      default: "2026-2027",
    },

    passingMarks: {
      type: Number,
      default: 40,
    },

    attendancePercentage: {
      type: Number,
      default: 75,
    },

    lateFeeFine: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "PKR",
    },

    feeDueDay: {
      type: Number,
      default: 10,
    },

    enableEvaluations: {
      type: Boolean,
      default: true,
    },

    enableNews: {
      type: Boolean,
      default: true,
    },

    enableGallery: {
      type: Boolean,
      default: true,
    },

    enableOnlineClasses: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting =
  mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);

export default Setting;