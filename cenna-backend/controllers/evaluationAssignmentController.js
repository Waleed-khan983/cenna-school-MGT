import asyncHandler from "express-async-handler";
import EvaluationAssignment from "../models/evaluationAssignment.js";
import EvaluationTemplate from "../models/evaluationTemplate.js";
import Student from "../models/Student.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";

const assignmentPopulateSpec = [
  { path: "template", select: "title templateType" },
  { path: "assignedTeachers", select: "employeeId" },
  { path: "assignedClasses", select: "name" },
  { path: "assignedBy", select: "name email" },
];

/*
|--------------------------------------------------------------------------
| Create Assignment
|--------------------------------------------------------------------------
*/

export const createAssignment = asyncHandler(async (req, res) => {
  const {
    title,
    template,
    targetRole,
    assignedUsers,
    assignedTeachers,
    assignedClasses,
    assignedSections,
    startDate,
    dueDate,
    allowMultipleResponses,
    status,
  } = req.body;

  const templateExists = await EvaluationTemplate.findById(template);

  if (!templateExists) {
    res.status(404);
    throw new Error("Evaluation template not found.");
  }

  const existingAssignment = await EvaluationAssignment.findOne({
    template,
    targetRole,
    status: { $ne: "closed" },
    isActive: true,
  });

  if (existingAssignment) {
    res.status(400);
    throw new Error(
      "An active assignment already exists for this template."
    );
  }

  const assignment = await EvaluationAssignment.create({
    title,
    template,
    targetRole,
    assignedUsers,
    assignedTeachers,
    assignedClasses,
    assignedSections,
    startDate,
    dueDate,
    allowMultipleResponses,
    status,
    assignedBy: req.user._id,
  });

  await assignment.populate(assignmentPopulateSpec);

  res.status(201).json({
    success: true,
    message: "Assignment created successfully.",
    assignment,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Assignments
|--------------------------------------------------------------------------
*/

export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await EvaluationAssignment.find()
    .populate(assignmentPopulateSpec)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: assignments.length,
    assignments,
  });
});

/*
|--------------------------------------------------------------------------
| Get Single Assignment
|--------------------------------------------------------------------------
*/

export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await EvaluationAssignment.findById(req.params.id)
    .populate("template")
    .populate("assignedUsers", "name email role")
    .populate("assignedTeachers")
    .populate("assignedClasses")
    .populate("assignedBy", "name email");

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found.");
  }

  res.json({
    success: true,
    assignment,
  });
});

/*
|--------------------------------------------------------------------------
| Update Assignment
|--------------------------------------------------------------------------
*/

export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await EvaluationAssignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found.");
  }

  Object.assign(assignment, req.body);

  await assignment.save();
  await assignment.populate(assignmentPopulateSpec);

  res.json({
    success: true,
    message: "Assignment updated successfully.",
    assignment,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Assignment
|--------------------------------------------------------------------------
*/

export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await EvaluationAssignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found.");
  }

  await assignment.deleteOne();

  res.json({
    success: true,
    message: "Assignment deleted successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| Publish Assignment
|--------------------------------------------------------------------------
*/

export const publishAssignment = asyncHandler(async (req, res) => {
  const assignment = await EvaluationAssignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found.");
  }

  assignment.status = "published";
  assignment.isActive = true;

  await assignment.save();
  await assignment.populate(assignmentPopulateSpec);

  res.json({
    success: true,
    message: "Assignment published successfully.",
    assignment,
  });
});

/*
|--------------------------------------------------------------------------
| Close Assignment
|--------------------------------------------------------------------------
*/

export const closeAssignment = asyncHandler(async (req, res) => {
  const assignment = await EvaluationAssignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found.");
  }

  assignment.status = "closed";
  assignment.isActive = false;

  await assignment.save();
  await assignment.populate(assignmentPopulateSpec);

  res.json({
    success: true,
    message: "Assignment closed successfully.",
    assignment,
  });
});

/*
|--------------------------------------------------------------------------
| Get My Assignments
|--------------------------------------------------------------------------
*/

export const getMyAssignments = asyncHandler(async (req, res) => {
  const user = req.user;

  let filter = {
    isActive: true,
    status: "published",
  };

  switch (user.role) {
    case "student": {
      const student = await Student.findOne({ user: user._id });

      if (!student) {
        return res.json({
          success: true,
          assignments: [],
        });
      }

      filter.targetRole = "student";

      filter.$or = [
        {
          assignedUsers: user._id,
        },
        {
          assignedClasses: student.class,
          $or: [
            {
              assignedSections: {
                $exists: false,
              },
            },
            {
              assignedSections: {
                $size: 0,
              },
            },
            {
              assignedSections: student.section,
            },
          ],
        },
      ];

      break;
    }

    case "teacher": {
      const teacher = await Teacher.findOne({ user: user._id });

      if (!teacher) {
        return res.json({
          success: true,
          assignments: [],
        });
      }

      filter.targetRole = "teacher";

      filter.assignedTeachers = teacher._id;

      break;
    }

    case "parent": {
      const parent = await Parent.findOne({ user: user._id });

      if (!parent) {
        return res.json({
          success: true,
          assignments: [],
        });
      }

      filter.targetRole = "parent";

      filter.assignedUsers = user._id;

      break;
    }

    case "coordinator": {
      filter.targetRole = "coordinator";

      filter.assignedUsers = user._id;

      break;
    }

    default:
      return res.json({
        success: true,
        assignments: [],
      });
  }

  const assignments = await EvaluationAssignment.find(filter)
    .populate("template")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: assignments.length,
    assignments,
  });
});