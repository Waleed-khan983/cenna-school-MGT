import asyncHandler from 'express-async-handler';
import Parent from '../models/Parent.js';
import Attendance from '../models/Attendance.js';
import Result from '../models/Result.js';
import Fee from '../models/Fee.js';


export const getParentDashboard = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ user: req.user._id }).populate('children');

  if (!parent) {
    res.status(404);
    throw new Error('Parent profile not found');
  }

  const dashboards = await Promise.all(
    parent.children.map(async (child) => {
      const [attendance, latestResult, fees] = await Promise.all([
        Attendance.find({ student: child._id }).sort({ date: -1 }).limit(20),
        Result.findOne({ student: child._id }).sort({ createdAt: -1 }).populate('marks.subject', 'name'),
        Fee.find({ student: child._id, status: { $in: ['Unpaid', 'Partial'] } }).sort('dueDate')
      ]);

      const attPct = attendance.length
        ? Math.round(
          (attendance.filter(a => a.status === 'Present').length / attendance.length) * 100
        )
        : 0;

      return {
        child,
        attendancePercentage: attPct,
        latestResult,
        pendingFees: fees
      };
    })
  );

  res.status(200).json({
    success: true,
    parent,
    children: dashboards
  });
});