import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import dotenv from "dotenv"
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "cenna-school/images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

const docStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "cenna-school/documents",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
  }),
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "cenna-school/lectures",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi"],
  }),
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadDoc = multer({
  storage: docStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

// ── Applicant documents (admission photo/resultCard/cnic/slc, job CVs) ──
//
// These are the two PUBLIC, unauthenticated upload endpoints, submitting
// documents that can include a national-ID copy — the most sensitive files
// in the app. Two layers of protection, same as the Tier 2 local-disk fix:
//   1. fileFilter below rejects anything outside the whitelist before any
//      network call to Cloudinary is even made.
//   2. Cloudinary's own `allowed_formats` rejects it again server-side.
// Stored with `type: "authenticated"` rather than the default "upload" —
// Cloudinary will not serve this asset from a bare URL at all, signed or
// not, unless the request carries a valid signature. Controllers store the
// returned public_id (not the URL) and generate a fresh, short-lived signed
// URL only when an admin actually views the record — see
// utils/documentAccess.js.
const APPLICANT_DOCUMENT_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const applicantDocumentFileFilter = (req, file, cb) => {
  const allowedExtensions = APPLICANT_DOCUMENT_TYPES[file.mimetype];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions || !allowedExtensions.includes(ext)) {
    const err = new Error(
      "Only JPG, JPEG, PNG, WEBP, and PDF files are allowed.",
    );
    err.statusCode = 400;
    return cb(err);
  }

  cb(null, true);
};

// Cloudinary can store and render a PDF under resource_type "image" (first
// page becomes the preview, and it's still downloadable as the original
// file) — using "image" uniformly for every admission document field means
// controllers never need to track a per-file resource_type just to
// regenerate a signed URL later.
const applicantDocumentStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "cenna-school/applicant-documents",
    resource_type: "image",
    type: "authenticated",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  }),
});

export const uploadApplicantDocument = multer({
  storage: applicantDocumentStorage,
  fileFilter: applicantDocumentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// CVs are PDF-only (see Tier 2 report — the frontend used to also offer
// DOC/DOCX; narrowed to match this whitelist) and are stored as "raw"
// (a plain downloadable file, not an image-viewer experience).
const cvFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype !== "application/pdf" || ext !== ".pdf") {
    const err = new Error("Only PDF files are allowed for a CV.");
    err.statusCode = 400;
    return cb(err);
  }

  cb(null, true);
};

const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "cenna-school/applicant-documents",
    resource_type: "raw",
    type: "authenticated",
    allowed_formats: ["pdf"],
  }),
});

export const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ── Lecture attachments ──────────────────────────────────────────────
// Not sensitive in the same sense (content a teacher deliberately shares
// with their whole class) — standard public "upload" delivery, same as
// gallery/news images. Broader format list than uploadDoc since lectures
// also accept slideshows.
const LECTURE_ATTACHMENT_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const lectureAttachmentFileFilter = (req, file, cb) => {
  const allowedExtensions = LECTURE_ATTACHMENT_TYPES[file.mimetype];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions || !allowedExtensions.includes(ext)) {
    const err = new Error(
      "Only PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, and PNG files are allowed.",
    );
    err.statusCode = 400;
    return cb(err);
  }

  cb(null, true);
};

const lectureAttachmentStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "cenna-school/lecture-attachments",
    resource_type: "auto",
  }),
});

export const uploadLectureAttachment = multer({
  storage: lectureAttachmentStorage,
  fileFilter: lectureAttachmentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export { cloudinary };
