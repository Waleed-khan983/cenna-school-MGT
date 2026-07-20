import express from "express";

import {
    createLecture,
    getMyLectures,
    deleteLecture,
    getStudentLectures,
} from "../controllers/lectureController.js";
import { uploadLectureAttachment } from "../config/cloudinary.js";

import {
    protect,
    authorize,
} from "../middleware/auth.js";


const router = express.Router();
router.post("/",
    protect,
    authorize("teacher"),
    uploadLectureAttachment.single("attachment"),
    createLecture
);

router.get(
    "/my",
    protect,
    authorize("teacher"),
    getMyLectures
);

router.get(
    "/student",
    protect,
    authorize("student"),
    getStudentLectures
);

router.delete(
    "/:id",
    protect,
    authorize("teacher"),
    deleteLecture
);

export default router;