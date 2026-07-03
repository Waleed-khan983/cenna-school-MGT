import asyncHandler from "express-async-handler";
import Notification from "../models/notification.js";
import User from "../models/User.js";
import { getPagination } from "../utils/helpers.js";

export const sendNotification = asyncHandler(async (req, res) => {
  const {
    title,
    message,
    type,
    priority,
    roles,
    classes,
    users,
    channels,
  } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error("Title and message are required");
  }

  const notification = await Notification.create({
    title,
    message,
    type,
    priority,

    sentBy: req.user._id,

    recipients: {
      roles: roles || [],
      classes: classes || [],
      users: users || [],
    },

    channels: channels || {
      app: true,
      sms: false,
      email: false,
    },
  });

  res.status(201).json({
    success: true,
    message: "Notification sent successfully",
    notification,
  });
});

export const getAllNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const total = await Notification.countDocuments();

  const notifications = await Notification.find()
    .populate("sentBy", "name role")
    .sort({ sentAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    notifications,
  });
});

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const notifications = await Notification.find({
    $or: [
      { "recipients.roles": req.user.role },
      { "recipients.users": req.user._id },
    ],
  })
    .populate("sentBy", "name role")
    .sort({ sentAt: -1 })
    .skip(skip)
    .limit(limit);

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.readBy.some(
        (id) => id.toString() === req.user._id.toString()
      )
  ).length;

  res.status(200).json({
    success: true,
    unreadCount,
    count: notifications.length,
    notifications,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  await Notification.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      readBy: req.user._id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      $or: [
        { "recipients.roles": req.user.role },
        { "recipients.users": req.user._id },
      ],
    },
    {
      $addToSet: {
        readBy: req.user._id,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});