import express from 'express'

const router = express.Router();
import { submitAdmission, getAdmissions, updateAdmissionStatus } from '../controllers/admissionController.js';
import { uploadLocal } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';
router.post('/admission', uploadLocal.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resultCard', maxCount: 1 },
    { name: 'cnic', maxCount: 1 },
    { name: 'slc', maxCount: 1 }
]), submitAdmission);
router.get('/admission', protect, adminOnly, getAdmissions);
router.put('/admission/:id', protect, adminOnly, updateAdmissionStatus);

export default router;