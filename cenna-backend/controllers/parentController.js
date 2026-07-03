import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Parent from "../models/parent.js";
import Student from "../models/Student.js";
import Attendance from "../models/attendance.js";
import Result from "../models/result.js";
import Assignment from "../models/assignment.js";
import Fee from "../models/Fee.js";
import ParentMessage from "../models/parentMessage.js";
import { getPagination } from "../utils/helpers.js";

const getParentByUser = async (userId) => {
  const parent = await Parent.findOne({ user: userId });

  if (!parent) {
    throw new Error("Parent profile not found");
  }

  return parent;
};

export const getParents = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const total = await Parent.countDocuments();

  const parents = await Parent.find()
    .populate("user", "name phone")
    .populate({
      path: "children",
      populate: [
        { path: "user", select: "name email phone" },
        { path: "class", select: "displayName name section" },
      ],
    })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: parents.length,
    total,
    page,
    parents,
  });
});

export const getParent = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id)
    .populate("user", "name phone")
    .populate({
      path: "children",
      populate: [
        { path: "user", select: "name email phone" },
        { path: "class", select: "displayName name section" },
      ],
    });

  if (!parent) {
    res.status(404);
    throw new Error("Parent not found");
  }

  res.status(200).json({ success: true, parent });
});

export const createParent = asyncHandler(async (req, res) => {
  const {
    name,
    password,
    phone,
    cnic,
    occupation,
    address,
    whatsapp,
    studentAdmissionNo,
  } = req.body;

  if (!name || !password || !cnic) {
    res.status(400);
    throw new Error("Name, password, and CNIC are required");
  }

  const existingParent = await Parent.findOne({ cnic });

  if (existingParent) {
    res.status(400);
    throw new Error("CNIC already registered");
  }

  let user = null;

  try {
    user = await User.create({
      name,
      password,
      role: "parent",
      phone,
    });

    const parent = await Parent.create({
      user: user._id,
      cnic,
      occupation,
      address,
      whatsapp: whatsapp || phone,
    });

    if (studentAdmissionNo) {
      const student = await Student.findOne({ admissionNo: studentAdmissionNo });

      if (student) {
        student.parent = parent._id;
        await student.save();

        await Parent.findByIdAndUpdate(parent._id, {
          $addToSet: { children: student._id },
        });
      }
    }

    const populated = await Parent.findById(parent._id)
      .populate("user", "name phone")
      .populate({
        path: "children",
        populate: [
          { path: "user", select: "name email phone" },
          { path: "class", select: "displayName name section" },
        ],
      });

    res.status(201).json({
      success: true,
      message: "Parent created",
      parent: populated,
    });
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }

    throw error;
  }
});

export const updateParent = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id);

  if (!parent) {
    res.status(404);
    throw new Error("Parent not found");
  }

  const {
    name,
    phone,
    cnic,
    occupation,
    address,
    whatsapp,
    smsAlerts,
    studentAdmissionNo,
  } = req.body;

  if (name || phone) {
    await User.findByIdAndUpdate(
      parent.user,
      { name, phone },
      { runValidators: true }
    );
  }

  const updated = await Parent.findByIdAndUpdate(
    req.params.id,
    {
      cnic,
      occupation,
      address,
      whatsapp,
      smsAlerts,
    },
    { new: true, runValidators: true }
  );

  if (studentAdmissionNo) {
    const student = await Student.findOne({ admissionNo: studentAdmissionNo });

    if (student) {
      student.parent = updated._id;
      await student.save();

      await Parent.findByIdAndUpdate(updated._id, {
        $addToSet: { children: student._id },
      });
    }
  }

  const populated = await Parent.findById(updated._id)
    .populate("user", "name phone")
    .populate({
      path: "children",
      populate: [
        { path: "user", select: "name email phone" },
        { path: "class", select: "displayName name section" },
      ],
    });

  res.status(200).json({
    success: true,
    message: "Parent updated",
    parent: populated,
  });
});

export const deleteParent = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id);

  if (!parent) {
    res.status(404);
    throw new Error("Parent not found");
  }

  await Student.updateMany({ parent: parent._id }, { $unset: { parent: "" } });

  await User.findByIdAndDelete(parent.user);
  await Parent.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Parent deleted",
  });
});

export const getMyParentProfile = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ user: req.user._id })
    .populate("user", "name phone email")
    .populate({
      path: "children",
      populate: [
        { path: "user", select: "name email phone avatar" },
        { path: "class", select: "displayName name section" },
      ],
    });

  if (!parent) {
    res.status(404);
    throw new Error("Parent profile not found");
  }

  res.status(200).json({
    success: true,
    parent,
  });
});

export const getMyChildrenAttendance = asyncHandler(async (req, res) => {
  const parent = await getParentByUser(req.user._id);

  const filter = {
    student: { $in: parent.children },
  };

  if (req.query.studentId) {
    if (!parent.children.map(String).includes(String(req.query.studentId))) {
      res.status(403);
      throw new Error("This student is not linked to your account");
    }

    filter.student = req.query.studentId;
  }

  const attendance = await Attendance.find(filter)
    .populate({
      path: "student",
      populate: { path: "user", select: "name" },
    })
    .populate("subject", "name code")
    .populate("class", "displayName name section")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    attendance,
  });
});

export const getMyChildrenResults = asyncHandler(async (req, res) => {
  const parent = await getParentByUser(req.user._id);

  const filter = {
    student: { $in: parent.children },
  };

  if (req.query.studentId) {
    if (!parent.children.map(String).includes(String(req.query.studentId))) {
      res.status(403);
      throw new Error("This student is not linked to your account");
    }

    filter.student = req.query.studentId;
  }

  const results = await Result.find(filter)
    .populate({
      path: "student",
      populate: { path: "user", select: "name" },
    })
    .populate("class", "displayName name section")
    .populate("marks.subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results,
  });
});

export const getMyChildrenAssignments = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ user: req.user._id }).populate({
    path: "children",
    populate: [
      { path: "user", select: "name" },
      { path: "class", select: "displayName name section" },
    ],
  });

  if (!parent) {
    res.status(404);
    throw new Error("Parent profile not found");
  }

  const children = parent.children || [];

  let selectedChildren = children;

  if (req.query.studentId) {
    selectedChildren = children.filter(
      (child) => String(child._id) === String(req.query.studentId)
    );

    if (selectedChildren.length === 0) {
      res.status(403);
      throw new Error("This student is not linked to your account");
    }
  }

  const classIds = selectedChildren.map((child) => child.class?._id || child.class);

  console.log("Parent children:", selectedChildren.map((c) => ({
    name: c.user?.name,
    class: c.class?._id || c.class,
  })));


  const assignments = await Assignment.find({
    class: { $in: classIds },
    isPublished: true,
  })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .populate({
      path: "teacher",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ dueDate: 1 });



  const assignmentsWithChildren = assignments.map((assignment) => {
    const childNames = selectedChildren
      .filter(
        (child) =>
          String(child.class?._id || child.class) === String(assignment.class._id)
      )
      .map((child) => child.user?.name || "Student");

    return {
      ...assignment.toObject(),
      childNames,
    };
  });

  res.status(200).json({
    success: true,
    assignments: assignmentsWithChildren,
  });
});

export const getMyChildrenFees = asyncHandler(async (req, res) => {
  const parent = await getParentByUser(req.user._id);

  const filter = {
    student: { $in: parent.children },
  };

  if (req.query.studentId) {
    if (!parent.children.map(String).includes(String(req.query.studentId))) {
      res.status(403);
      throw new Error("This student is not linked to your account");
    }

    filter.student = req.query.studentId;
  }

  const fees = await Fee.find(filter)
    .populate({
      path: "student",
      populate: { path: "user", select: "name" },
    })
    .populate("class", "displayName name section")
    .sort({ year: -1, monthNum: -1 });

  res.status(200).json({
    success: true,
    fees,
  });
});


 


 



 

export const updateProfileImage =
  asyncHandler(async (req, res) => {
    const parent =
      await Parent.findOne({
        user: req.user._id,
      });

    parent.profileImage =
      `/uploads/parents/${req.file.filename}`;

    await parent.save();

    res.status(200).json({
      success: true,
      profileImage:
        parent.profileImage,
    });
  });