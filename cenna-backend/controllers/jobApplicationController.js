import asyncHandler from "express-async-handler";
import JobApplication from "../models/jobApplication.js";

export const submitJobApplication = asyncHandler(async (req, res) => {
    const {
        vacancy,
        position,
        fullName,
        fatherName,
        cnic,
        phone,
        email,
        address,
        qualification,
        experience,
        expectedSalary,
        coverLetter,
    } = req.body;

    if (!position || !fullName) {
        res.status(400);
        throw new Error("Position and full name are required");
    }

    const application = await JobApplication.create({
        vacancy: vacancy || undefined,
        position,
        fullName,
        fatherName,
        cnic,
        phone,
        email,
        address,
        qualification,
        experience,
        expectedSalary,
        coverLetter,
        cv: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
        success: true,
        message: "Job application submitted successfully",
        application,
    });
});

export const getAllJobApplications = asyncHandler(async (req, res) => {
    const applications = await JobApplication.find()
        .populate("vacancy", "title department jobType")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications,
    });
});

export const updateJobApplicationStatus = asyncHandler(async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error("Job application not found");
    }

    application.status = req.body.status || application.status;

    await application.save();

    res.status(200).json({
        success: true,
        message: "Application status updated",
        application,
    });
});

export const deleteJobApplication = asyncHandler(async (req, res) => {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error("Job application not found");
    }

    await application.deleteOne();

    res.status(200).json({
        success: true,
        message: "Application deleted successfully",
    });
});