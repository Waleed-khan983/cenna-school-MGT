import asyncHandler from 'express-async-handler';
import Student from '../models/Student.js';
import Teacher from '../models/teacher.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/assignment.js';
import Notification from '../models/notification.js';
import ClassSubject from '../models/ClassSubject.js';


export const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id }).populate(
    'user',
    'name email'
  );

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher profile not found');
  }

  // Teacher has no `classes`/`subjects` fields of its own — the real
  // relationship is ClassSubject (teacher -> class + subject), referenced
  // from Teacher.assignments.
  const classSubjects = await ClassSubject.find({
    teacher: teacher._id,
    isActive: true,
  })
    .populate('class', 'displayName name section')
    .populate('subject', 'name code');

  const classById = new Map();
  const subjectById = new Map();

  for (const cs of classSubjects) {
    if (cs.class) classById.set(cs.class._id.toString(), cs.class);
    if (cs.subject) subjectById.set(cs.subject._id.toString(), cs.subject);
  }

  const classes = Array.from(classById.values());
  const subjects = Array.from(subjectById.values());
  const classIds = classes.map((c) => c._id);

  const studentCount = classIds.length
    ? await Student.countDocuments({
        class: { $in: classIds },
        isActive: true,
      })
    : 0;

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
    classes,
    subjects,
    studentCount,
    pendingAssignments,
    myQuizzes,
    notifications: recentNotifs
  });
});