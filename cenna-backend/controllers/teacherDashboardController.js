import asyncHandler from 'express-async-handler';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';
import Notification from '../models/Notification.js';


export const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id })
    .populate('classes')
    .populate('subjects', 'name');

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher profile not found');
  }

  const classIds = teacher.classes.map(c => c._id);

  const studentCount = await Student.countDocuments({
    class: { $in: classIds },
    isActive: true
  });

  const [pendingAssignments, myQuizzes, recentNotifs] = await Promise.all([
    Assignment.find({ teacher: teacher._id, isActive: true })
      .populate('subject', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
    Quiz.find({ teacher: teacher._id })
      .sort({ createdAt: -1 })
      .limit(5),
    Notification.find({ 'recipients.roles': 'teacher' })
      .sort({ sentAt: -1 })
      .limit(5)
  ]);

  res.status(200).json({
    success: true,
    teacher,
    studentCount,
    pendingAssignments,
    myQuizzes,
    notifications: recentNotifs
  });
});