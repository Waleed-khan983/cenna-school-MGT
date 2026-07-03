import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
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

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadLocal = multer({
  storage: localStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export { cloudinary };