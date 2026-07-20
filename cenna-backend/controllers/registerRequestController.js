import asyncHandler from "express-async-handler";
import RegisterRequest from "../models/registerRequest.js";
import User from "../models/User.js";

export const createRegisterRequest = asyncHandler(async (req, res) => {
    const { role, fullName, fatherName, email, phone, className, childName } =
        req.body;

    if (!["student", "parent"].includes(role)) {
        res.status(400);
        throw new Error("Only student and parent can submit register requests");
    }

    if (!fullName || !phone) {
        res.status(400);
        throw new Error("Full name and phone are required");
    }

    if (role === "student" && (!fatherName || !className)) {
        res.status(400);
        throw new Error("Father name and class are required for student request");
    }

    if (role === "parent" && !childName) {
        res.status(400);
        throw new Error("Child name is required for parent request");
    }

    if (email) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400);
            throw new Error("This email already has an account");
        }
    }

    const request = await RegisterRequest.create({
        role,
        fullName,
        fatherName,
        email,
        phone,
        className,
        childName,
    });

    res.status(201).json({
        success: true,
        message: "Registration request submitted successfully",
        request,
    });
});

export const getRegisterRequests = asyncHandler(async (req, res) => {
    const { status, role } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;

    const requests = await RegisterRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: requests.length,
        requests,
    });
});

export const getRegisterRequest = asyncHandler(async (req, res) => {
    const request = await RegisterRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error("Registration request not found");
    }

    res.status(200).json({
        success: true,
        request,
    });
});

export const updateRegisterRequestStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
        res.status(400);
        throw new Error("Invalid status");
    }

    const request = await RegisterRequest.findByIdAndUpdate(
        req.params.id,
        { status, note },
        { new: true, runValidators: true }
    );

    if (!request) {
        res.status(404);
        throw new Error("Registration request not found");
    }

    res.status(200).json({
        success: true,
        message: "Registration request updated successfully",
        request,
    });
});

export const deleteRegisterRequest = asyncHandler(async (req, res) => {
    const request = await RegisterRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error("Registration request not found");
    }

    await request.deleteOne();

    res.status(200).json({
        success: true,
        message: "Registration request deleted successfully",
    });
});