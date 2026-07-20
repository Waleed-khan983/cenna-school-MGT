import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import { seedIdentifierCounters } from "./utils/sequence.js";
import { checkIndexDrift } from "./utils/indexSync.js";
import coordinatorDashboardRoutes from "./routes/coordinatorDashboardRoutes.js";
import coordinatorRoutes from "./routes/coordinatorRoutes.js";
import evaluationTemplateRoutes from "./routes/evaluationTemplate.Routes.js";
import evaluationAssignmentRoutes from "./routes/evaluationAssignmentRoutes.js";
import evaluationResponseRoutes from "./routes/evaluationResponseRoutes.js";
import evaluationPdfRoutes from "./routes/evaluationPdfRoutes.js";
import evaluationReportRoutes from "./routes/evaluationReportRoutes.js";

dotenv.config();

const app = express();

// Awaited (not fire-and-forget) so the identifier-counter seeding below only
// ever runs against a real connection.
await connectDB();

// Idempotent — seeds each identifier counter's starting value from existing
// historical data only the first time it's ever called; a no-op on every
// later boot.
await seedIdentifierCounters();

// Read-only — logs a warning if a deployed compound index no longer
// matches the schema (drift), never modifies anything itself. See
// utils/indexSync.js and the Tier 6A report for why this exists.
await checkIndexDrift();



// ── Security Headers ──────────────────────────────────
// crossOriginResourcePolicy is relaxed to "cross-origin" because /uploads
// (avatars, gallery images, lecture attachments) is loaded directly by the
// frontend from a different origin — Helmet's "same-origin" default would
// silently block those image/file loads in the browser.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ── CORS ───────────────────────────────────────────────
// CLIENT_URL is the frontend origin. Supports a comma-separated list for
// multiple environments, e.g. "https://cenna.school,https://staging.cenna.school".
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header (server-to-server calls, curl,
      // health checks) — browsers always send Origin for cross-site fetches.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const corsError = new Error("Not allowed by CORS");
      corsError.statusCode = 403;
      callback(corsError);
    },
    credentials: true,
  }),
);

// Rate limiting
// This is an internal school-portal API (not public), and a single admin
// page can legitimately fire 5-10 requests on load; multiple staff often
// share one office IP too. 100 req/15min was getting hit during normal use.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// Auth rate limit (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});
app.use("/api/auth/login", authLimiter);

// Password-reset rate limit — a few genuine attempts (typo'd email, resent
// link) should never be blocked, but this endpoint can otherwise be used to
// spam a target's inbox or probe emails for account existence.
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many password reset requests, please try again later.",
  },
});
app.use("/api/auth/forgot-password", forgotPasswordLimiter);

// ── Core Middleware ──────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// mongoSanitize must run after body parsing — otherwise req.body doesn't
// exist yet, and NoSQL-operator injection in JSON request bodies (e.g.
// {"email": {"$ne": null}}) is never stripped.
app.use(mongoSanitize());

// Logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Static uploads folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ── Routes ───────────────────────────────────────────

import authRoutes from "./routes/auth.Routes.js";
import studentRoutes from "./routes/student.Routes.js";

import teacherRoutes from "./routes/teacher.Routes.js";
import parentRoutes from "./routes/parent.Routes.js";
import classRoutes from "./routes/class.Routes.js";
import subjectRoutes from "./routes/subject.Routes.js";
import attendanceRoutes from "./routes/attendance.Routes.js";
import resultRoutes from "./routes/result.Routes.js";
import feeRoutes from "./routes/fee.Routes.js";
import evaluationRoutes from "./routes/evaluation.Routes.js";
import assignmentRoutes from "./routes/assignment.Routes.js";
import lectureRoutes from "./routes/lecture.Routes.js";
import quizRoutes from "./routes/quiz.Routes.js";
import notificationRoutes from "./routes/notification.Routes.js";
import newsRoutes from "./routes/news.Routes.js";
import galleryRoutes from "./routes/gallery.Routes.js";
import teacherDashboardRoutes from "./routes/teacherDashboard.Route.js";
import studentDashboardRoutes from "./routes/studentDashboard.Route.js";
import parentDashboardRoutes from "./routes/parentDashboard.Route.js";
import admissionRoutes from "./routes/admission.Route.js";
import registerRequestRoutes from "./routes/registerRequest.Route.js";
import userRoutes from "./routes/user.Routes.js";
import settingsRoutes from "./routes/setting.Routes.js";
import timetableRoutes from "./routes/timetable.Routes.js";
import datesheetRoutes from "./routes/datesheet.Routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.Route.js";
import jobVacancyRoutes from "./routes/jobVacancy.Routes.js";
import jobApplicationRoutes from "./routes/jobApplication.Routes.js";
import alumniRoutes from "./routes/alumini.Routes.js";
import classSubjectRoutes from "./routes/classSubject.Routes.js";
import remarkRoutes from "./routes/remark.Route.js";
import liveClassRoutes from "./routes/liveClass.Routes.js";

app.use("/api/coordinator/dashboard", coordinatorDashboardRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/register-requests", registerRequestRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/evaluations", evaluationRoutes);

app.use("/api/assignments", assignmentRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/teacherDashboard", teacherDashboardRoutes);
app.use("/api/studentDashboard", studentDashboardRoutes);
app.use("/api/parentDashboard", parentDashboardRoutes);
app.use("/api/adminDashboard", adminDashboardRoutes);
app.use("/api/admission", admissionRoutes);
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

app.use(
  "/api/evaluation-templates",
  evaluationTemplateRoutes
);

app.use(
  "/api/evaluation-assignments",
  evaluationAssignmentRoutes
);

app.use(
  "/api/evaluation-responses",
  evaluationResponseRoutes
);

app.use("/api/evaluation-pdf", evaluationPdfRoutes);
app.use("/api/evaluation-reports", evaluationReportRoutes);

// ── Health Check ─────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CENNA School API is running",
    env: process.env.NODE_ENV,
  });
});

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────
app.use(errorHandler);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `🚀 CENNA School Server running on port ${process.env.PORT || 5000} [${process.env.NODE_ENV}]`,
  );
});

// Everything inside a request goes through asyncHandler + errorHandler
// already. These two are the safety net for anything outside that cycle
// (a rejected promise nobody awaited, a genuine programmer error) — modern
// Node treats an unhandled rejection as fatal regardless, so the goal here
// is just to log clearly *what* crashed before the process exits, rather
// than an opaque exit with no context. Closing the HTTP server first lets
// in-flight requests finish instead of being dropped mid-response.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  server.close(() => process.exit(1));
});

export default app;
