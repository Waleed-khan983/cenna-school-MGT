import mongoose from "mongoose";
import { getNextSequence } from "../utils/sequence.js";

const FeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    month: { type: String, required: true },
    year: { type: Number, required: true },
    monthNum: { type: Number, required: true },

    monthlyFee: { type: Number, required: true },
    admissionFee: { type: Number, default: 0 },
    examFee: { type: Number, default: 0 },
    lateFine: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    totalAmount: { type: Number, default: 0 },

    dueDate: { type: Date, required: true },
    paidDate: Date,

    paidAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Partial", "Waived"],
      default: "Unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "Bank", "JazzCash", "Easypaisa"],
      default: "Cash",
    },

    challanNo: { type: String, unique: true, sparse: true },
    receiptNo: { type: String, unique: true, sparse: true },

    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

FeeSchema.pre("save", async function (next) {
  this.totalAmount =
    Number(this.monthlyFee || 0) +
    Number(this.admissionFee || 0) +
    Number(this.examFee || 0) +
    Number(this.lateFine || 0) -
    Number(this.discount || 0);

  if (!this.challanNo) {
    // Date.now() alone collides under concurrent challan generation (same
    // millisecond, two requests). An atomic counter can't collide.
    const seq = await getNextSequence("feeChallanNo", this.$session());
    this.challanNo = `CHN-${String(seq).padStart(6, "0")}`;
  }

  next();
});

const Fee = mongoose.models.Fee || mongoose.model("Fee", FeeSchema);
export default Fee;