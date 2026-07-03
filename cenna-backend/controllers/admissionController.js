import asyncHandler from 'express-async-handler';
import Admission from '../models/admission.js';




export const submitAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.create({
    ...req.body,
    documents: {
      photo: req.files?.photo?.[0]?.path,
      resultCard: req.files?.resultCard?.[0]?.path,
      cnic: req.files?.cnic?.[0]?.path,
      slc: req.files?.slc?.[0]?.path
    }
  });

  if (req.body.email) {
    await sendEmail({
      to: req.body.email,
      subject: 'Admission Application Received — CENNA School',
      html: `
        <h2>Application Received</h2>
        <p>Dear ${req.body.fatherName},</p>
        <p>Your admission application for <strong>${req.body.firstName} ${req.body.lastName}</strong> has been received.</p>
        <p><strong>Reference No:</strong> ${admission.refNo}</p>
        <p>We will contact you within 2–3 working days.</p>
        <br><p>CENNA School & College Pabbi</p>
      `
    });
  }

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    refNo: admission.refNo,
    admission
  });
});




//
// 2. Get All Admissions
// ─────────────────────────────────────────────
export const getAdmissions = asyncHandler(async (req, res) => {
  const admissions = await Admission.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: admissions.length,
    data: admissions
  });
});

// ─────────────────────────────────────────────
// 3. Update Admission Status
// ─────────────────────────────────────────────
export const updateAdmissionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const admission = await Admission.findById(id);

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: "Admission not found"
    });
  }

  admission.status = status || admission.status;
  await admission.save();

  res.status(200).json({
    success: true,
    message: "Admission status updated",
    data: admission
  });
});