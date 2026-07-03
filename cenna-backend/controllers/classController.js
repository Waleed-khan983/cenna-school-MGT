import asyncHandler from "express-async-handler";
import Class from "../models/class.js";

export const getClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find({
    isActive: { $ne: false },
  })
    .populate({
      path: "classTeacher",
      populate: {
        path: "user",
        select: "name email phone",
      },
    })
    .sort({ name: 1, section: 1 });

  res.status(200).json({
    success: true,
    count: classes.length,
    classes,
  });
});

export const getClass = asyncHandler(async (req, res) => {
  const cls = await Class.findOne({
    _id: req.params.id,
    isActive: { $ne: false },
  }).populate({
    path: "classTeacher",
    populate: {
      path: "user",
      select: "name email phone",
    },
  });

  if (!cls) {
    res.status(404);
    throw new Error("Class not found");
  }

  res.status(200).json({
    success: true,
    class: cls,
  });
});

export const createClass = asyncHandler(async (req, res) => {
  const { name, section, classTeacher, room, capacity } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Class name is required");
  }

  const cls = await Class.create({
    name,
    section: section || "A",
    classTeacher: classTeacher || undefined,
    room,
    capacity,
    isActive: true,
  });

  const populated = await Class.findById(cls._id).populate({
    path: "classTeacher",
    populate: {
      path: "user",
      select: "name email phone",
    },
  });

  res.status(201).json({
    success: true,
    message: "Class created",
    class: populated,
  });
});

export const updateClass = asyncHandler(async (req, res) => {
  const { name, section, classTeacher, room, capacity, isActive } = req.body;

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (section !== undefined) updateData.section = section;
  if (classTeacher !== undefined) {
    updateData.classTeacher = classTeacher || undefined;
  }
  if (room !== undefined) updateData.room = room;
  if (capacity !== undefined) updateData.capacity = capacity;
  if (isActive !== undefined) updateData.isActive = isActive;

  const updated = await Class.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "classTeacher",
    populate: {
      path: "user",
      select: "name email phone",
    },
  });

  if (!updated) {
    res.status(404);
    throw new Error("Class not found");
  }

  res.status(200).json({
    success: true,
    message: "Class updated",
    class: updated,
  });
});

export const deleteClass = asyncHandler(async (req, res) => {
  const cls = await Class.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!cls) {
    res.status(404);
    throw new Error("Class not found");
  }

  res.status(200).json({
    success: true,
    message: "Class deactivated",
  });
});