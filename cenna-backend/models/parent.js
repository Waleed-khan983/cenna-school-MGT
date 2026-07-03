import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    profileImage: {
      type: String,
      default: "",
    },

    cnic: {
      type: String,
      trim: true,
    },

    occupation: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    smsAlerts: {
      attendance: {
        type: Boolean,
        default: true,
      },

      results: {
        type: Boolean,
        default: true,
      },

      fees: {
        type: Boolean,
        default: true,
      },

      announcements: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Parent =
  mongoose.models.Parent ||
  mongoose.model("Parent", ParentSchema);

export default Parent;