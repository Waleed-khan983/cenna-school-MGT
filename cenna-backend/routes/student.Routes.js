import express from 'express';
const router = express.Router();
import { uploadLocal } from "../config/cloudinary.js";
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

} from "../controllers/studentController.js";
import { protect, adminOnly, teacherOrAdmin, authorize } from '../middleware/auth.js';


router.get(
    "/search/fees",
    protect,
    authorize("admin", "accountant"),
    searchStudentsForFees
);
router.get('/me', protect, authorize('student'), getMyProfile);
router.put(
    "/me/avatar",
    protect,
    authorize("student"),
    uploadLocal.single("avatar"),
    updateMyAvatar
);
router.get('/class/:classId', protect, authorize("admin", "teacher", 'operator'), getStudentsByClass);
router.get(
    "/",
    protect,
    authorize("admin", "accountant", "operator", "operator"),
    getStudents
); router.get('/:id', protect, authorize("admin", "teacher", 'operator', 'accountant'), getStudent);
router.post('/', protect, adminOnly, createStudent);
router.put('/:id', protect, adminOnly, updateStudent);
router.delete('/:id', protect, adminOnly, deleteStudent);

export default router;
