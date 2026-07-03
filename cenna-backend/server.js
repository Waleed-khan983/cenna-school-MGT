import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './config/db.js';
import coordinatorDashboardRoutes from "./routes/coordinatorDashboardRoutes.js";
import coordinatorRoutes from "./routes/coordinatorRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  "/api/coordinator/dashboard",
  coordinatorDashboardRoutes
);

app.use("/api/coordinator", coordinatorRoutes);

// ── Security Middleware ──────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Auth rate limit (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);

// ── Core Middleware ──────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Static uploads folder
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// ── Routes ───────────────────────────────────────────
import authRoutes from './routes/auth.Routes.js';
import studentRoutes from './routes/student.Routes.js';


import teacherRoutes from './routes/teacher.Routes.js';
import parentRoutes from './routes/parent.Routes.js';
import classRoutes from './routes/class.Routes.js';
import subjectRoutes from './routes/subject.Routes.js';
import attendanceRoutes from './routes/attendance.Routes.js';
import resultRoutes from './routes/result.Routes.js';
import feeRoutes from './routes/fee.Routes.js';
import evaluationRoutes from './routes/evaluation.Routes.js';
import assignmentRoutes from './routes/assignment.Routes.js';
import lectureRoutes from './routes/lecture.Routes.js';
import quizRoutes from './routes/quiz.Routes.js';
import notificationRoutes from './routes/notification.Routes.js';
import newsRoutes from './routes/news.Routes.js';
import galleryRoutes from './routes/gallery.Routes.js';
import teacherDashboardRoutes from './routes/teacherDashboard.Route.js';
import studentDashboardRoutes from './routes/studentDashboard.Route.js';
import parentDashboardRoutes from './routes/parentDashboard.Route.js';
import admissionRoutes from './routes/admission.Route.js';
import registerRequestRoutes from './routes/registerRequest.Route.js';
import userRoutes from "./routes/user.Routes.js";
import settingsRoutes from "./routes/setting.Routes.js"
import timetableRoutes from "./routes/timetable.Routes.js";
import datesheetRoutes from "./routes/datesheet.Routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.Route.js";
import jobVacancyRoutes from "./routes/jobVacancy.Routes.js";
import jobApplicationRoutes from "./routes/jobApplication.Routes.js";
import alumniRoutes from "./routes/alumini.Routes.js";
import classSubjectRoutes from "./routes/classSubject.Routes.js";
import remarkRoutes from "./routes/remark.Route.js"
import liveClassRoutes from "./routes/liveClass.Routes.js"
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/register-requests', registerRequestRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/evaluations', evaluationRoutes);


app.use('/api/assignments', assignmentRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/teacherDashboard', teacherDashboardRoutes);
app.use('/api/studentDashboard', studentDashboardRoutes);
app.use('/api/parentDashboard', parentDashboardRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes);
app.use('/api/admission', admissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/datesheet", datesheetRoutes);
app.use("/api/dashboard", adminDashboardRoutes);
app.use("/api/job-vacancies", jobVacancyRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/class-subjects", classSubjectRoutes);

app.use("/api/remarks", remarkRoutes);
app.use("/api/live-classes", liveClassRoutes);

// ── Health Check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CENNA School API is running', env: process.env.NODE_ENV });
});

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});



app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 CENNA School Server running on port ${process.env.PORT || 5000} [${process.env.NODE_ENV}]`);
});

export default app;