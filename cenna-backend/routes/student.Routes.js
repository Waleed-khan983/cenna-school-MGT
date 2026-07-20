import express from "express";
import { uploadImage } from "../config/cloudinary.js";

import {
  getMyProfile,
  updateMyAvatar,
  getStudentsByClass,
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudentsForFees,
  promoteStudent,
  promoteStudentsBulk,
} from "../controllers/studentController.js";

import {
  protect,
  adminOnly,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Special Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/search/fees",
  protect,
  authorize("admin", "accountant"),
  searchStudentsForFees
);

router.get(
  "/me",
  protect,
  authorize("student"),
  getMyProfile
);

router.put(
  "/me/avatar",
  protect,
  authorize("student"),
  uploadImage.single("avatar"),
  updateMyAvatar
);

/*
|--------------------------------------------------------------------------
| Promotion Routes
|--------------------------------------------------------------------------
| Keep these BEFORE /:id routes
*/

router.put(
  "/promote/bulk",
  protect,
  adminOnly,
  promoteStudentsBulk
);

router.put(
  "/:id/promote",
  protect,
  adminOnly,
  promoteStudent
);

/*
|--------------------------------------------------------------------------
| Class Based Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/class/:classId",
  protect,
  authorize("admin", "teacher", "operator", "coordinator"),
  getStudentsByClass
);

/*
|--------------------------------------------------------------------------
| Main CRUD Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  authorize("admin", "accountant", "operator", "coordinator"),
  getStudents
);

router.post(
  "/",
  protect,
  adminOnly,
  createStudent
);

router.get(
  "/:id",
  protect,
  authorize("admin", "teacher", "operator", "accountant", "coordinator"),
  getStudent
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateStudent
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteStudent
);

export default router;