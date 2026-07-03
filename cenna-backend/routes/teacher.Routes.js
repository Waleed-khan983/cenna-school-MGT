import express from 'express';
const router = express.Router();
import { getMyTeacherProfile, getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher  } from '../controllers/teacherController.js';

import { protect, adminOnly, teacherOrAdmin, authorize } from '../middleware/auth.js';

router.get('/me', protect, authorize('teacher'), getMyTeacherProfile);
router.get('/', protect, teacherOrAdmin, getTeachers);
router.get('/:id', protect, teacherOrAdmin, getTeacher);
router.post('/', protect, adminOnly, createTeacher);
router.put('/:id', protect, adminOnly, updateTeacher);
router.delete('/:id', protect, adminOnly, deleteTeacher);

export default router;
