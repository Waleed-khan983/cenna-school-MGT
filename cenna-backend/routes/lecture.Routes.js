import express from "express";

import {
    createLecture,
    getMyLectures,
    deleteLecture,
    getStudentLectures,
} from "../controllers/lectureController.js";
import uploadLecture from "../middleware/uploadlecture.js";

import {
    protect,
    authorize,
} from "../middleware/auth.js";


const router = express.Router();
router.post("/",
    protect,
    authorize("teacher"),
    uploadLecture.single("attachment"),
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

router.post(
    "/",
    protect,
    authorize("teacher"),
    createLecture
);

router.delete(
    "/:id",
    protect,
    authorize("teacher"),
    deleteLecture
);

export default router;