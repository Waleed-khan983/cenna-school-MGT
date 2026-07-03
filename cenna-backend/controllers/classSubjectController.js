import asyncHandler from "express-async-handler";

import ClassSubject from "../models/ClassSubject.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

// ===============================
// Get All Assignments
// ===============================
export const getClassSubjects = asyncHandler(async (req, res) => {
    const assignments = await ClassSubject.find({ isActive: true })
        .populate("class", "displayName name section")
        .populate("subject", "name code")
        .populate({
            path: "teacher",
            select: "designation",
            populate: {
                path: "user",
                select: "name email phone",
            },
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: assignments.length,
        assignments,
    });
});


// ===============================
// Get Single Assignment
// ===============================
export const getClassSubject = asyncHandler(async (req, res) => {
    const assignment = await ClassSubject.findById(req.params.id)
        .populate("class", "displayName name section")
        .populate("subject", "name code")
        .populate({
            path: "teacher",
            select: "designation",
            populate: {
                path: "user",
                select: "name email phone",
            },
        });



    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    res.status(200).json({
        success: true,
        assignment,
    });
});


// ===============================
// Get Students of a Class
// ===============================
export const getMyClassSubjects = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        user: req.user.id,
    }).populate("class", "displayName name section");

    if (!student) {
        res.status(404);
        throw new Error("Student profile not found");
    }

    const assignments = await ClassSubject.find({
        class: student.class._id,
        isActive: true,
    })
        .populate("class", "displayName name section")
        .populate("subject", "name code maxMarks passMark isElective")
        .populate({
            path: "teacher",
            populate: {
                path: "user",
                select: "name email phone avatar",
            },
        });

    res.status(200).json({
        success: true,
        count: assignments.length,
        class: student.class,
        assignments,
    });
});

// ===============================
// Create Assignment
// ===============================
export const createClassSubject = asyncHandler(async (req, res) => {
    const { classId, subjectId, teacherId } = req.body;

    if (!classId || !subjectId || !teacherId) {
        res.status(400);
        throw new Error("Class, Subject and Teacher are required");
    }

    const cls = await Class.findById(classId);
    const subject = await Subject.findById(subjectId);
    const teacher = await Teacher.findById(teacherId);

    if (!cls) {
        res.status(404);
        throw new Error("Class not found");
    }

    if (!subject) {
        res.status(404);
        throw new Error("Subject not found");
    }

    if (!teacher) {
        res.status(404);
        throw new Error("Teacher not found");
    }

    const existing = await ClassSubject.findOne({
        class: classId,
        subject: subjectId,
        isActive: true,
    });

    if (existing) {
        res.status(400);
        throw new Error(
            "This subject is already assigned to this class"
        );
    }

    const assignment = await ClassSubject.create({
        class: classId,
        subject: subjectId,
        teacher: teacherId,
    });

    const populated = await ClassSubject.findById(assignment._id)
        .populate("class", "displayName name section")
        .populate("subject", "name code")
        .populate({
            path: "teacher",
            select: "designation",
            populate: {
                path: "user",
                select: "name email phone",
            },
        });

    res.status(201).json({
        success: true,
        message: "Assignment created successfully",
        assignment: populated,
    });
});

// ===============================
// Update Assignment
// ===============================
export const updateClassSubject = asyncHandler(async (req, res) => {
    const { teacherId } = req.body;

    const assignment = await ClassSubject.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    if (teacherId) {
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            res.status(404);
            throw new Error("Teacher not found");
        }

        assignment.teacher = teacherId;
    }

    await assignment.save();

    const populated = await ClassSubject.findById(assignment._id)
        .populate("class", "displayName name section")
        .populate("subject", "name code")
        .populate({
            path: "teacher",
            select: "designation",
            populate: {
                path: "user",
                select: "name email phone",
            },
        });

    res.status(200).json({
        success: true,
        message: "Assignment updated successfully",
        assignment: populated,
    });
});

// ===============================
// Delete Assignment
// ===============================
export const deleteClassSubject = asyncHandler(async (req, res) => {
    const assignment = await ClassSubject.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    await ClassSubject.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Assignment deleted successfully",
        id: req.params.id,
    });
});

// ===============================
// Get Subjects of a Class
// ===============================
export const getClassSubjectsByClass = asyncHandler(async (req, res) => {
    const assignments = await ClassSubject.find({
        class: req.params.classId,
        isActive: true,
    })
        .populate("subject", "name code")
        .populate({
            path: "teacher",
            populate: {
                path: "user",
                select: "name",
            },
        });

    res.status(200).json({
        success: true,
        assignments,
    });
});

// ===============================
// Get Teacher Subjects
// ===============================
export const getTeacherAssignments = asyncHandler(async (req, res) => {
    const assignments = await ClassSubject.find({
        teacher: req.params.teacherId,
        isActive: true,
    })
        .populate("class", "displayName")
        .populate("subject", "name code");

    res.status(200).json({
        success: true,
        assignments,
    });
});


export const getMyTeacherAssignments = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findOne({
        user: req.user.id,
    }).populate("user", "name email phone avatar");

    if (!teacher) {
        res.status(404);
        throw new Error("Teacher profile not found");
    }

    const assignments = await ClassSubject.find({
        teacher: teacher._id,
        isActive: true,
    })
        .populate("class", "displayName name section room")
        .populate("subject", "name code maxMarks passMark isElective")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        teacher,
        count: assignments.length,
        assignments,
    });
});