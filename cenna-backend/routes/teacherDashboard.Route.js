import express from 'express'

const router = express.Router();
import { getTeacherDashboard } from '../controllers/teacherDashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

router.get('/teacher', protect, authorize('teacher'), getTeacherDashboard);

export default router;
