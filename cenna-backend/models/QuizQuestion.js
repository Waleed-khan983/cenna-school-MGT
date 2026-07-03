import mongoose from "mongoose";

const QuizQuestionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String,

    correctAnswer: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.QuizQuestion ||
  mongoose.model("QuizQuestion", QuizQuestionSchema);