import asyncHandler from "express-async-handler";

import Lecture from "../models/lecture.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import ClassSubject from "../models/ClassSubject.js";

export const createLecture = asyncHandler(async (req, res) => {
    const { classId, subjectId, title, description, videoUrl } = req.body;

    if (!classId || !subjectId || !title) {
        res.status(400);
        throw new Error("Class, subject, and title are required");
    }

    const teacher = await Teacher.findOne({
        user: req.user._id,
    });

    if (!teacher) {
        res.status(404);
        throw new Error("Teacher not found");
    }

    const assignment = await ClassSubject.findOne({
        class: classId,
        subject: subjectId,
        teacher: teacher._id,
        isActive: true,
    });

    if (!assignment) {
        res.status(403);
        throw new Error("You are not assigned to this class and subject");
    }

    const lecture = await Lecture.create({
        teacher: teacher._id,
        class: classId,
        subject: subjectId,
        title,
        description,
        attachment: req.file ? `/uploads/lectures/${req.file.filename}` : "",
        videoUrl,
        isPublished: true,
    });

    const populated = await Lecture.findById(lecture._id)
        .populate("class", "displayName name section")
        .populate("subject", "name code")
        .populate({
            path: "teacher",
            populate: {
                path: "user",
                select: "name email",
            },
        });

    res.status(201).json({
        success: true,
        message: "Lecture created successfully",
        lecture: populated,
    });
});

export const getMyLectures = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findOne({
        user: req.user._id,
    });

    if (!teacher) {
        res.status(404);
        throw new Error("Teacher not found");
    }

    const lectures = await Lecture.find({
        teacher: teacher._id,
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
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        lectures,
    });
});

export const getStudentLectures = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        user: req.user._id,
    });

    if (!student) {
        res.status(404);
        throw new Error("Student profile not found");
    }

    const lectures = await Lecture.find({
        class: student.class,
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
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        lectures,
    });
});

export const deleteLecture = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        res.status(404);
        throw new Error("Lecture not found");
    }

    if (req.user.role === "teacher") {
        const teacher = await Teacher.findOne({
            user: req.user._id,
        });

        if (!teacher || String(lecture.teacher) !== String(teacher._id)) {
            res.status(403);
            throw new Error("You cannot delete this lecture");
        }
    }

    await Lecture.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Lecture deleted",
        id: req.params.id,
    });
});