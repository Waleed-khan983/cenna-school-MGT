import asyncHandler from "express-async-handler";
import Alumni from "../models/alumini.js";  // change to alumni 

export const registerAlumni = asyncHandler(async (req, res) => {
    const alumni = await Alumni.create(req.body);

    res.status(201).json({
        success: true,
        message: "Alumni registration submitted successfully",
        alumni,
    });
});

export const getAlumniRegistrations = asyncHandler(async (req, res) => {
    const alumni = await Alumni.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        alumni,
    });
});




export const approveAlumni =
    asyncHandler(async (req, res) => {
        const alumni = await Alumni.findById(
            req.params.id
        );

        if (!alumni) {
            res.status(404);
            throw new Error("Alumni not found");
        }

        alumni.status = "approved";

        await alumni.save();

        res.status(200).json({
            success: true,
            alumni,
        });
    });

export const deleteAlumni =
    asyncHandler(async (req, res) => {
        await Alumni.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
        });
    });