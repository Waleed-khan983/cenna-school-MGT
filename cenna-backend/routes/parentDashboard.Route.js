import express from 'express'

const router = express.Router();
import { getParentDashboard } from '../controllers/parentDashboardController.js';
import { protect, authorize } from '../middleware/auth.js';
router.get('/parent', protect, authorize('parent'), getParentDashboard);

export default router;