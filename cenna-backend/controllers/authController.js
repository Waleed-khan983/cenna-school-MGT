import asyncHandler from "express-async-handler";
import crypto from "crypto";

import User from "../models/User.js";
import Teacher from "../models/teacher.js";
import Parent from "../models/parent.js";
import Student from "../models/Student.js";
import ClassSubject from "../models/ClassSubject.js";
import { sendTokenResponse, sendEmail } from "../utils/helpers.js";

const allowedRoles = [
  "admin",
  "teacher",
  "student",
  "parent",
  "coordinator",
  "accountant",
  "operator",
  "alumni",
];

const emailRequiredRoles = [
  "admin",
  "teacher",
  "coordinator",
  "accountant",
  "operator",
  "alumni",
];

const getTeacherProfileWithAssignments = async (userId) => {
  const teacher = await Teacher.findOne({ user: userId }).populate(
    "user",
    "name email phone avatar isActive"
  );

  if (!teacher) return null;

  const assignments = await ClassSubject.find({
    teacher: teacher._id,
    isActive: true,
  })
    .populate("class", "displayName name section room")
    .populate("subject", "name code maxMarks passMark isElective")
    .sort({ createdAt: -1 });

  return {
    ...teacher.toObject(),
    assignments,
  };
};

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,

    studentAdmissionNo,

    admissionNo,
    rollNumber,
    fatherName,
    motherName,
    dob,
    gender,
    religion,
    nationality,
    bForm,
    classId,
    section,
    parentId,
    prevSchool,
    prevMarks,

    cnic,
    occupation,
    whatsapp,

    qualification,
    designation,
    salary,
    department,

    batch,
    profession,
  } = req.body;

  if (!name || !password || !role) {
    res.status(400);
    throw new Error("Name, password, and role are required");
  }

  if (!allowedRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  if (emailRequiredRoles.includes(role) && !email) {
    res.status(400);
    throw new Error("Email is required for this role");
  }

  if (role === "student") {
    if (!admissionNo) {
      res.status(400);
      throw new Error("Admission number is required for student");
    }

    if (!fatherName) {
      res.status(400);
      throw new Error("Father name is required for student");
    }

    if (!classId) {
      res.status(400);
      throw new Error("Class is required for student");
    }

    const existingStudent = await Student.findOne({ admissionNo });

    if (existingStudent) {
      res.status(400);
      throw new Error("Admission number already registered");
    }
  }

  if (role === "parent" && !cnic) {
    res.status(400);
    throw new Error("CNIC is required for parent");
  }

  if (emailRequiredRoles.includes(role)) {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      res.status(400);
      throw new Error("Email already registered");
    }
  }

  let user = null;

  try {
    user = await User.create({
      name,
      email: emailRequiredRoles.includes(role) ? email : undefined,
      password,
      role,
      phone,
    });

    let profile = null;

    if (role === "student") {
      profile = await Student.create({
        user: user._id,
        admissionNo,
        rollNumber,
        class: classId,
        section: section || "A",
        fatherName,
        motherName,
        dob,
        gender,
        religion,
        nationality,
        bForm,
        address,
        parent: parentId || undefined,
        prevSchool,
        prevMarks,
      });

      if (parentId) {
        await Parent.findByIdAndUpdate(parentId, {
          $addToSet: { children: profile._id },
        });
      }
    }

    if (role === "parent") {
      let existingParent = await Parent.findOne({ cnic });

      if (existingParent) {
        if (studentAdmissionNo) {
          const student = await Student.findOne({ admissionNo: studentAdmissionNo });

          if (!student) {
            res.status(404);
            throw new Error("Student not found");
          }

          student.parent = existingParent._id;
          await student.save();

          await Parent.findByIdAndUpdate(existingParent._id, {
            $addToSet: { children: student._id },
          });
        }

        profile = await Parent.findById(existingParent._id)
          .populate("user", "name phone")
          .populate({
            path: "children",
            populate: [
              { path: "user", select: "name" },
              { path: "class", select: "displayName" },
            ],
          });

        return res.status(200).json({
          success: true,
          message: "Student linked to existing parent successfully",
          profile,
        });
      }

      profile = await Parent.create({
        user: user._id,
        cnic,
        occupation,
        address,
        whatsapp: whatsapp || phone,
      });

      if (studentAdmissionNo) {
        const student = await Student.findOne({ admissionNo: studentAdmissionNo });

        if (student) {
          student.parent = profile._id;
          await student.save();

          await Parent.findByIdAndUpdate(profile._id, {
            $addToSet: { children: student._id },
          });
        }
      }

      profile = await Parent.findById(profile._id)
        .populate("user", "name phone")
        .populate({
          path: "children",
          populate: [
            { path: "user", select: "name" },
            { path: "class", select: "displayName" },
          ],
        });
    }

    if (role === "teacher") {
      profile = await Teacher.create({
        user: user._id,
        qualification,
        designation,
        cnic,
        address,
        salary,
        department,
      });
    }

    res.status(201).json({
      success: true,
      message: `${role} account created successfully by admin`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    if (user) await User.findByIdAndDelete(user._id);
    throw error;
  }
});

export const login = asyncHandler(async (req, res) => {
  const { role, email, admissionNo, cnic, password } = req.body;

  if (!role || !password) {
    res.status(400);
    throw new Error("Role and password are required");
  }

  let user = null;

  if (role === "student") {
    if (!admissionNo) {
      res.status(400);
      throw new Error("Admission number is required");
    }

    const student = await Student.findOne({ admissionNo }).populate("user");

    if (!student) {
      res.status(401);
      throw new Error("Invalid admission number or password");
    }

    user = await User.findById(student.user._id).select("+password");
  } else if (role === "parent") {
    if (!cnic) {
      res.status(400);
      throw new Error("CNIC is required");
    }
    

    const parent = await Parent.findOne({ cnic }).populate("user");

    if (!parent) {
      res.status(401);
      throw new Error("Invalid CNIC or password");
    }

    user = await User.findById(parent.user._id).select("+password");
  } else {
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    user = await User.findOne({ email }).select("+password");
  }

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error("Account deactivated. Contact admin.");
  }

  if (user.role !== role) {
    res.status(401);
    throw new Error(`This account is not registered as ${role}`);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  let profile = null;

  if (user.role === "student") {
    profile = await Student.findOne({ user: user._id }).populate(
      "class",
      "name section displayName"
    );
  } else if (user.role === "teacher") {
    profile = await getTeacherProfileWithAssignments(user._id);
  } else if (user.role === "parent") {
    profile = await Parent.findOne({ user: user._id }).populate({
      path: "children",
      populate: { path: "class", select: "displayName" },
    });
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      mustChangePassword: user.mustChangePassword,
    },
    profile,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  let profile = null;

  if (user.role === "student") {
    profile = await Student.findOne({ user: user._id })
      .populate("class", "name section displayName room")
      .populate("parent");
  } else if (user.role === "teacher") {
    profile = await getTeacherProfileWithAssignments(user._id);
  } else if (user.role === "parent") {
    profile = await Parent.findOne({ user: user._id }).populate({
      path: "children",
      populate: [
        { path: "class", select: "displayName" },
        { path: "user", select: "name email" },
      ],
    });
  }

  res.status(200).json({ success: true, user, profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.email) user.email = req.body.email;

  if (req.file?.path) {
    user.avatar = req.file.path;
  }

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();

  sendTokenResponse(user, 200, res, "Password changed successfully");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  // Always the same status, message and shape whether or not this email
  // has an account — otherwise the endpoint becomes an account-enumeration
  // oracle (try a list of emails, see which ones say "found").
  const genericResponse = {
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };

  const user = await User.findOne({ email });

  // Deactivated accounts are treated exactly like non-existent ones here —
  // confirming "this email exists but is deactivated" is its own leak.
  if (!user || !user.isActive) {
    return res.status(200).json(genericResponse);
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const sent = await sendEmail({
    to: user.email,
    subject: "Password Reset — CENNA School",
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 10 minutes.</p>`,
  });

  if (!sent) {
    // Operational failure only, logged server-side — never surfaced to the
    // client, which would otherwise confirm this email has an account.
    console.error(
      `[forgotPassword] Failed to send reset email for user ${user._id}`,
    );
  }

  res.status(200).json(genericResponse);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.mustChangePassword = false;

  await user.save();

  sendTokenResponse(user, 200, res, "Password reset successful");
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});