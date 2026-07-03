import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// ── Protect Route (must be logged in) ───────────────
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User no longer exists');
    }

    if (!req.user.isActive) {
      res.status(401);
      throw new Error('Your account has been deactivated. Contact admin.');
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

// ── Role-Based Access ────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user.role}' is not authorized to access this route`);
    }
    next();
  };
};

// ── Admin Only ───────────────────────────────────────
export const adminOnly = authorize('admin');

// ── Admin or Teacher ─────────────────────────────────
export const teacherOrAdmin = authorize('admin', 'teacher');

// ── All Portal Users ─────────────────────────────────
export const allPortalUsers = authorize(
  "admin",
  "teacher",
  "student",
  "parent",
  "accountant",
  "operator",
  "coordinator",

);