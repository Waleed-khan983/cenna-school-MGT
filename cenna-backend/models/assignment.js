import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        attachment: {
            type: String,
            default: "",
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Assignment ||
    mongoose.model("Assignment", AssignmentSchema);