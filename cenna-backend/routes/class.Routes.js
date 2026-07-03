import express from 'express';
import {  getClasses, getClass, createClass, updateClass, deleteClass } from '../controllers/classController.js';
import { protect, adminOnly, teacherOrAdmin, authorize, allPortalUsers } from '../middleware/auth.js';

const router = express.Router();



// ── CLASS ROUTES ─────────────────────────────────────
 
router.get('/', protect, allPortalUsers, getClasses);
router.get('/:id', protect, allPortalUsers, getClass);
router.post('/', protect, adminOnly, createClass);
router.put('/:id', protect, adminOnly, updateClass);
router.delete('/:id', protect, adminOnly, deleteClass);


export default router;