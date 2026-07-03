import express from "express";

const router = express.Router();

import {
  sendNotification,
  getAllNotifications,
  getMyNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import {
  protect,
  adminOnly,
  allPortalUsers,
  authorize,
} from "../middleware/auth.js";

router.post(
  "/",
  protect,
  adminOnly,
  sendNotification
);

router.get(
  "/",
  protect,
  adminOnly,
  getAllNotifications
);

router.get(
  "/me",
  protect,
  allPortalUsers,
  getMyNotifications
);

router.put(
  "/:id/read",
  protect,
  allPortalUsers,
  markAsRead
);

router.put(
  "/read-all",
  protect,
  allPortalUsers,
  markAllRead
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteNotification
);

export default router;