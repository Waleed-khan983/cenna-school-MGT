import asyncHandler from 'express-async-handler';
import Parent from '../models/parent.js';
import Attendance from '../models/attendance.js';
import Result from '../models/result.js';
import Fee from '../models/fee.js';


export const getParentDashboard = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ user: req.user._id }).populate({
    path: 'children',
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'class', select: 'displayName name section' },
    ],
  });

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

      // Percentage of the child's most recent 20 marked attendance periods
      // (see the query above) where status is "present". Attendance.status
      // enum is lowercase ("present"/"absent"/"late"/"leave") — "late" and
      // "leave" are not counted as present. No records yet -> 0%, not NaN.
      const attPct = attendance.length
        ? Math.round(
          (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
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