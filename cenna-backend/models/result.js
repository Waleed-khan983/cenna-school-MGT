import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },

  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },

  examType: {
    type: String,
    enum: ['Monthly', 'Mid-Term', 'Final', 'Board'],
    required: true
  },

  session: {
    type: String,
    required: true
  },

  examMonth: {
    type: String
  },

  marks: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      },

      maxMarks: {
        type: Number,
        default: 100
      },

      obtained: {
        type: Number,
        default: 0
      },

      grade: {
        type: String
      },

      isPassed: {
        type: Boolean,
        default: false
      }
    }
  ],

  totalMarks: {
    type: Number,
    default: 0
  },

  totalObtained: {
    type: Number,
    default: 0
  },

  percentage: {
    type: Number,
    default: 0
  },

  grade: {
    type: String
  },

  position: {
    type: Number
  },

  isPassed: {
    type: Boolean,
    default: false
  },

  remarks: {
    type: String,
    trim: true
  },

  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  publishedAt: {
    type: Date
  }
}, { timestamps: true });

ResultSchema.methods.calculateGrade = function (pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
};

const Result =mongoose.models.Result || mongoose.model('Result', ResultSchema);

export default Result;