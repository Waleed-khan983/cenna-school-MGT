import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    category: {
      type: String,
      enum: ["events", "sports", "classroom", "achievement", "function", "general"],
      default: "general",
    },

    image: { type: String, required: true },

    eventDate: { type: Date },

    isPublished: { type: Boolean, default: true },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default Gallery;