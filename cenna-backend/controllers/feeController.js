import asyncHandler from "express-async-handler";

import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
import { getPagination, sendFeeAlert } from "../utils/helpers.js";

const generateReceiptNo = () => `RCPT-${Date.now()}`;

export const generateChallan = asyncHandler(async (req, res) => {
  const {
    studentId,
    month,
    year,
    monthNum,
    monthlyFee,
    admissionFee,
    examFee,
    lateFine,
    discount,
    dueDate,
    notes,
  } = req.body;

  if (!studentId || !month || !year || !monthNum || !monthlyFee || !dueDate) {
    res.status(400);
    throw new Error("Student, month, year, fee, and due date are required");
  }

  const student = await Student.findById(studentId)
    .populate("user", "name phone")
    .populate("class", "displayName");

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const existingFee = await Fee.findOne({
    student: studentId,
    month,
    year,
  });

  if (existingFee) {
    res.status(400);
    throw new Error("Fee challan already exists for this student and month");
  }

  const fee = await Fee.create({
    student: studentId,
    class: student.class?._id,
    month,
    year,
    monthNum,
    monthlyFee,
    admissionFee: admissionFee || 0,
    examFee: examFee || 0,
    lateFine: lateFine || 0,
    discount: discount || 0,
    dueDate,
    notes,
  });

  const populated = await Fee.findById(fee._id).populate({
    path: "student",
    populate: [
      { path: "user", select: "name phone" },
      { path: "class", select: "displayName" },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Challan generated successfully",
    fee: populated,
  });
});

export const collectFee = asyncHandler(async (req, res) => {
  const { paidAmount, paymentMethod } = req.body;

  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    res.status(404);
    throw new Error("Fee record not found");
  }

  const amount = Number(paidAmount || 0);

  if (amount <= 0) {
    res.status(400);
    throw new Error("Paid amount must be greater than 0");
  }

  const newPaidAmount = Number(fee.paidAmount || 0) + amount;

  if (newPaidAmount > Number(fee.totalAmount || 0)) {
    res.status(400);
    throw new Error("Paid amount cannot exceed total fee amount");
  }

  fee.paidAmount = newPaidAmount;
  fee.paidDate = Date.now();
  fee.paymentMethod = paymentMethod || "Cash";
  fee.status = newPaidAmount >= fee.totalAmount ? "Paid" : "Partial";

  if (!fee.receiptNo) {
    fee.receiptNo = generateReceiptNo();
  }

  fee.collectedBy = req.user._id;

  await fee.save();

  const populated = await Fee.findById(fee._id)
    .populate({
      path: "student",
      populate: [
        { path: "user", select: "name phone" },
        { path: "class", select: "displayName" },
      ],
    })
    .populate("class", "displayName");

  res.status(200).json({
    success: true,
    message: "Fee collected successfully",
    fee: populated,
  });
});
export const getAllFees = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.month) filter.month = req.query.month;
  if (req.query.year) filter.year = Number(req.query.year);
  if (req.query.classId) filter.class = req.query.classId;

  const total = await Fee.countDocuments(filter);

  const fees = await Fee.find(filter)
    .populate({
      path: "student",
      populate: [
        { path: "user", select: "name phone" },
        { path: "class", select: "displayName" },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: fees.length,
    total,
    page,
    fees,
  });
});

export const getFeesByStudent = asyncHandler(async (req, res) => {
  const fees = await Fee.find({
    student: req.params.studentId,
  })
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name phone",
      },
    })
    .populate("class", "displayName")
    .sort({
      year: -1,
      monthNum: -1,
    });

  const summary = {
    totalDue: fees.reduce((sum, fee) => sum + fee.totalAmount, 0),
    totalPaid: fees.reduce((sum, fee) => sum + fee.paidAmount, 0),
    unpaidCount: fees.filter((fee) => fee.status === "Unpaid").length,
    partialCount: fees.filter((fee) => fee.status === "Partial").length,
  };

  res.status(200).json({
    success: true,
    summary,
    fees,
  });
});

export const getMyFees = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const fees = await Fee.find({ student: student._id }).sort({
    year: -1,
    monthNum: -1,
  });

  res.status(200).json({
    success: true,
    fees,
  });
});

export const getDefaulters = asyncHandler(async (req, res) => {
  const fees = await Fee.find({
    status: { $in: ["Unpaid", "Partial"] },
  })
    .populate({
      path: "student",
      populate: [
        { path: "user", select: "name phone" },
        { path: "class", select: "displayName" },
      ],
    })
    .sort({ dueDate: 1 });

  if (req.query.sendAlert === "true") {
    for (const fee of fees) {
      try {
        if (fee.student?.parent) {
          const parent = await Parent.findById(fee.student.parent).populate(
            "user",
            "phone"
          );

          if (parent && sendFeeAlert) {
            await sendFeeAlert(parent, fee.student, fee);
          }
        }
      } catch (error) {
        console.log("Fee alert error:", error.message);
      }
    }
  }

  res.status(200).json({
    success: true,
    count: fees.length,
    defaulters: fees,
  });
});

export const deleteFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    res.status(404);
    throw new Error("Fee record not found");
  }

  await Fee.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Fee deleted successfully",
  });
});