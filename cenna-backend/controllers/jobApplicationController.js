import asyncHandler from "express-async-handler";
import JobApplication from "../models/jobApplication.js";
import { resolveSignedDocumentUrl, destroyUploadedAsset } from "../utils/documentAccess.js";

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
        // The CV, if any, is already sitting in Cloudinary by this point —
        // clean it up rather than leaving it orphaned for a request that
        // fails validation.
        if (req.file?.filename) {
            await destroyUploadedAsset(req.file.filename, "raw", "authenticated");
        }

        res.status(400);
        throw new Error("Position and full name are required");
    }

    let application;

    try {
        application = await JobApplication.create({
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
            // Stored as a Cloudinary public_id (type:"authenticated"), same
            // reasoning as admission documents — see getAllJobApplications.
            cv: req.file?.filename || "",
        });
    } catch (error) {
        if (req.file?.filename) {
            await destroyUploadedAsset(req.file.filename, "raw", "authenticated");
        }

        throw error;
    }

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

    // Admin-only route — resolve each stored CV public_id into a
    // freshly-signed URL at view time (10-minute expiry). Legacy
    // "/uploads/..." paths pass through unchanged.
    const withResolvedCv = applications.map((application) => {
        const obj = application.toObject();
        obj.cv = resolveSignedDocumentUrl(obj.cv, "raw");
        return obj;
    });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications: withResolvedCv,
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