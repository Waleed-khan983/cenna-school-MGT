import asyncHandler from "express-async-handler";
import Timetable from "../models/Timetable.js";

export const createTimetable = asyncHandler(async (req, res) => {
    const timetable = await Timetable.create(req.body);

    res.status(201).json({
        success: true,
        timetable,
    });
});

export const getAllTimetables = asyncHandler(async (req, res) => {
    const timetables = await Timetable.find()
        .populate("classId")
        .populate("subjectId")
        .populate({
            path: "teacherId",
            populate: {
                path: "user",
                select: "name",
            },
        });

    res.json({
        success: true,
        timetables,
    });
});

export const deleteTimetable = asyncHandler(async (req, res) => {
    await Timetable.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Timetable deleted",
    });
});