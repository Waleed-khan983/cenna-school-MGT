import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "announcement",
        "fee",
        "attendance",
        "result",
        "event",
        "holiday",
        "general",
      ],
      default: "general",
    },

    priority: {
      type: String,
      enum: ["normal", "important", "urgent"],
      default: "normal",
    },

    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    recipients: {
      roles: [
        {
          type: String,
          enum: [
            "admin",
            "teacher",
            "student",
            "parent",
            "coordinator",
            "accountant",
            "operator",
            "alumni",
          ],
        },
      ],

      classes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
      ],

      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    channels: {
      app: {
        type: Boolean,
        default: true,
      },

      sms: {
        type: Boolean,
        default: false,
      },

      email: {
        type: Boolean,
        default: false,
      },
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;