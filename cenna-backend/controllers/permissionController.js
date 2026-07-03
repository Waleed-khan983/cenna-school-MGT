import asyncHandler from "express-async-handler";
import Permission from "../models/permission.js";

const defaultPermissions = {
  admin: ["*"],

  teacher: [
    "dashboard.view",
    "attendance.view",
    "attendance.create",
    "results.view",
    "results.create",
    "assignments.view",
    "assignments.create",
    "lectures.view",
    "lectures.create",
    "quizzes.view",
    "quizzes.create",
    "notices.view",
  ],

  student: [
    "dashboard.view",
    "attendance.view",
    "results.view",
    "fees.view",
    "assignments.view",
    "lectures.view",
    "quizzes.view",
    "subjects.view",
    "notices.view",
    "evaluation.create",
  ],

  parent: [
    "dashboard.view",
    "children.view",
    "attendance.view",
    "results.view",
    "fees.view",
    "notices.view",
  ],

  coordinator: [
    "dashboard.view",
    "students.view",
    "teachers.view",
    "classes.view",
    "subjects.view",
    "attendance.view",
    "results.view",
    "evaluations.view",
    "notices.view",
  ],

  accountant: [
    "dashboard.view",
    "fees.view",
    "fees.create",
    "fees.update",
    "fees.collect",
    "invoices.view",
    "receipts.view",
    "reports.view",
    "notices.view",
  ],

  operator: [
    "dashboard.view",
    "certificates.view",
    "certificates.create",
    "studentcards.view",
    "studentcards.create",
    "feeStructure.view",
    "dmcc.view",
    "dmcc.create",
    "notices.view",
  ],

  alumni: ["dashboard.view", "profile.view", "notices.view"],
};

const roles = Object.keys(defaultPermissions);

export const seedPermissions = asyncHandler(async (req, res) => {
  for (const role of roles) {
    await Permission.findOneAndUpdate(
      { role },
      {
        role,
        permissions: defaultPermissions[role],
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "Default permissions created successfully",
  });
});

export const getPermissions = asyncHandler(async (req, res) => {
  let permissions = await Permission.find().sort({ role: 1 });

  if (permissions.length === 0) {
    for (const role of roles) {
      await Permission.create({
        role,
        permissions: defaultPermissions[role],
      });
    }

    permissions = await Permission.find().sort({ role: 1 });
  }

  res.status(200).json({
    success: true,
    permissions,
  });
});

export const getRolePermission = asyncHandler(async (req, res) => {
  const permission = await Permission.findOne({
    role: req.params.role,
  });

  if (!permission) {
    res.status(404);
    throw new Error("Role permission not found");
  }

  res.status(200).json({
    success: true,
    permission,
  });
});

export const updateRolePermission = asyncHandler(async (req, res) => {
  const { permissions } = req.body;

  if (!Array.isArray(permissions)) {
    res.status(400);
    throw new Error("Permissions must be an array");
  }

  const permission = await Permission.findOneAndUpdate(
    { role: req.params.role },
    {
      role: req.params.role,
      permissions,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Permissions updated successfully",
    permission,
  });
});