import asyncHandler from 'express-async-handler';
import Admission from '../models/admission.js';
import { sendEmail } from '../utils/helpers.js';
import { resolveSignedDocumentUrl, destroyUploadedAsset } from '../utils/documentAccess.js';

export const submitAdmission = asyncHandler(async (req, res) => {
  // Cloudinary uploads (see routes/admission.Route.js — uploadApplicantDocument)
  // already happened by the time this handler runs. `.filename` is the
  // Cloudinary public_id; stored instead of `.path` because these documents
  // are uploaded under type:"authenticated" — the returned secure_url isn't
  // servable without a fresh signature, only the public_id lets us generate
  // one later (see getAdmissions below).
  const uploadedPublicIds = Object.values(req.files || {})
    .flat()
    .map((file) => file.filename)
    .filter(Boolean);

  let admission;

  try {
    admission = await Admission.create({
      ...req.body,
      documents: {
        photo: req.files?.photo?.[0]?.filename,
        resultCard: req.files?.resultCard?.[0]?.filename,
        cnic: req.files?.cnic?.[0]?.filename,
        slc: req.files?.slc?.[0]?.filename,
      },
    });
  } catch (error) {
    // The files are already sitting in Cloudinary at this point — if the
    // database write that was supposed to reference them fails, don't
    // leave them orphaned there indefinitely.
    await Promise.all(
      uploadedPublicIds.map((id) => destroyUploadedAsset(id, "image", "authenticated")),
    );

    throw error;
  }

  let emailSent = false;

  if (req.body.email) {
    emailSent = await sendEmail({
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

    if (!emailSent) {
      // The application itself was already saved successfully — a failed
      // confirmation email must never roll that back, just get logged.
      console.error(`[submitAdmission] Confirmation email failed for admission ${admission._id}`);
    }
  }

  res.status(201).json({
    success: true,
    message: emailSent
      ? 'Application submitted successfully. A confirmation email has been sent.'
      : 'Application submitted successfully. We could not send a confirmation email — please keep your reference number.',
    refNo: admission.refNo,
    emailSent,
    admission
  });
});




//
// 2. Get All Admissions
// ─────────────────────────────────────────────
export const getAdmissions = asyncHandler(async (req, res) => {
  const admissions = await Admission.find().sort({ createdAt: -1 });

  // Admin-only route (see routes/admission.Route.js). Documents were stored
  // as Cloudinary public_ids under type:"authenticated" — turn each one
  // into a freshly-signed, 10-minute URL only now, at view time. Legacy
  // "/uploads/..." paths from before this migration pass through unchanged.
  const data = admissions.map((admission) => {
    const obj = admission.toObject();

    obj.documents = {
      photo: resolveSignedDocumentUrl(obj.documents?.photo),
      resultCard: resolveSignedDocumentUrl(obj.documents?.resultCard),
      cnic: resolveSignedDocumentUrl(obj.documents?.cnic),
      slc: resolveSignedDocumentUrl(obj.documents?.slc),
    };

    return obj;
  });

  res.status(200).json({
    success: true,
    count: admissions.length,
    data
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