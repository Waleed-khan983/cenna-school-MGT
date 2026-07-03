import mongoose from "mongoose";

const EvaluationCampaignSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    month: { type: String, required: true },
    year: { type: Number, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EvaluationCampaign =
  mongoose.models.EvaluationCampaign ||
  mongoose.model("EvaluationCampaign", EvaluationCampaignSchema);

export default EvaluationCampaign;