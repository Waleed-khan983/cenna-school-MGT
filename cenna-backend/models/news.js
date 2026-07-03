import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },

    category: {
      type: String,
      enum: ["announcement", "event", "achievement", "holiday", "sports", "academic"],
      default: "announcement",
    },

    image: { type: String },

    isPublished: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    eventDate: { type: Date },

    tags: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const News = mongoose.models.News || mongoose.model("News", NewsSchema);
export default News;