import mongoose from "mongoose";

const RegisterRequestSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["student", "parent"],
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        fatherName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        className: {
            type: String,
            trim: true,
        },

        childName: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        note: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const RegisterRequest =
    mongoose.models.RegisterRequest ||
    mongoose.model("RegisterRequest", RegisterRequestSchema);

export default RegisterRequest;