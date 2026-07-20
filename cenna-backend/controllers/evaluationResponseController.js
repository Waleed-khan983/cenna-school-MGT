import asyncHandler from "express-async-handler";
import EvaluationResponse from "../models/evaluationResponse.js";
import EvaluationAssignment from "../models/evaluationAssignment.js";
import EvaluationTemplate from "../models/evaluationTemplate.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import Parent from "../models/parent.js";

const isAllowedTeacherForAssignment = (assignment, teacherId) => {
    if (!assignment.assignedTeachers || assignment.assignedTeachers.length === 0) {
        return true;
    }

    return assignment.assignedTeachers.some(
        (id) => String(id) === String(teacherId)
    );
};

/*
|--------------------------------------------------------------------------
| Submit Evaluation
|--------------------------------------------------------------------------
*/

export const submitEvaluation = asyncHandler(async (req, res) => {
    const assignment = await EvaluationAssignment.findById(req.body.assignment)
        .populate("template");

    if (!assignment) {
        res.status(404);
        throw new Error("Evaluation assignment not found.");
    }

    if (!assignment.isActive || assignment.status !== "published") {
        res.status(400);
        throw new Error("This evaluation is not accepting responses.");
    }

    const teacherExists = await Teacher.findById(req.body.teacher);

    if (!teacherExists) {
        res.status(404);
        throw new Error("Teacher not found.");
    }

    if (!isAllowedTeacherForAssignment(assignment, req.body.teacher)) {
        res.status(400);
        throw new Error("This teacher is not part of this evaluation assignment.");
    }

    if (!assignment.allowMultipleResponses) {
        const alreadySubmitted = await EvaluationResponse.findOne({
            assignment: assignment._id,
            submittedBy: req.user._id,
        });

        if (alreadySubmitted) {
            res.status(400);
            throw new Error("You have already submitted this evaluation.");
        }
    }

    let totalScore = 0;
    let maxScore = 0;

    assignment.template.sections.forEach((section) => {
        section.questions.forEach((question) => {
            if (question.type === "mcq") {
                maxScore += question.options.length - 1;
            }
        });
    });

    req.body.answers.forEach((answer) => {
        if (!isNaN(answer.answer)) {
            totalScore += Number(answer.answer);
        }
    });

    const percentage =
        maxScore === 0 ? 0 : Number(((totalScore / maxScore) * 100).toFixed(2));

    const responseData = {
        assignment: assignment._id,
        template: assignment.template._id,
        submittedBy: req.user._id,
        submittedRole: req.user.role,
        teacher: req.body.teacher,
        answers: req.body.answers,
        totalScore,
        percentage,
    };

    if (req.user.role === "student") {
        const student = await Student.findOne({ user: req.user._id });
        if (student) responseData.student = student._id;
    }

    if (req.user.role === "parent") {
        const parent = await Parent.findOne({ user: req.user._id });
        if (parent) responseData.parent = parent._id;
    }

    if (req.user.role === "coordinator") {
        responseData.coordinator = req.user._id;
    }

    const response = await EvaluationResponse.create(responseData);

    await response.populate([
        { path: "template", select: "title" },
        { path: "teacher", populate: { path: "user", select: "name email" } },
        { path: "submittedBy", select: "name" },
    ]);

    res.status(201).json({
        success: true,
        message: "Evaluation submitted successfully.",
        response,
    });
});

/*
|--------------------------------------------------------------------------
| Get All Responses
|--------------------------------------------------------------------------
*/

export const getEvaluationResponses = asyncHandler(async (req, res) => {
    const responses = await EvaluationResponse.find()
        .populate("submittedBy", "name")
        .populate({
            path: "teacher",
            populate: { path: "user", select: "name email" },
        })
        .populate("template", "title")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: responses.length,
        responses,
    });
});

export const getMyResponses = asyncHandler(async (req, res) => {
    const responses = await EvaluationResponse.find({
        submittedBy: req.user._id,
    })
        .populate({
            path: "teacher",
            populate: { path: "user", select: "name email" },
        })
        .populate("template", "title")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: responses.length,
        responses,
    });
});

export const getResponsesByAssignment = asyncHandler(async (req, res) => {
    const responses = await EvaluationResponse.find({
        assignment: req.params.assignmentId,
    })
        .populate("submittedBy", "name")
        .populate({
            path: "teacher",
            populate: { path: "user", select: "name email" },
        })
        .populate("template", "title")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: responses.length,
        responses,
    });
});

export const getTeacherResponses = asyncHandler(async (req, res) => {
    const responses = await EvaluationResponse.find({
        teacher: req.params.teacherId,
    })
        .populate("submittedBy", "name role")
        .populate({
            path: "teacher",
            populate: { path: "user", select: "name email" },
        })
        .populate("template", "title")
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: responses.length,
        responses,
    });
});
/*
|--------------------------------------------------------------------------
| Get Single Response
|--------------------------------------------------------------------------
*/

export const getEvaluationResponse = asyncHandler(async (req, res) => {
    const response = await EvaluationResponse.findById(req.params.id)
        .populate("submittedBy", "name email")
        .populate({
            path: "teacher",
            populate: { path: "user", select: "name email" },
        })
        .populate("template", "title");

    if (!response) {
        res.status(404);
        throw new Error("Evaluation response not found.");
    }

    res.json({
        success: true,
        response,
    });
});

/*
|--------------------------------------------------------------------------
| Mark Response Reviewed
|--------------------------------------------------------------------------
*/

export const reviewEvaluationResponse = asyncHandler(async (req, res) => {
    const response = await EvaluationResponse.findById(req.params.id);

    if (!response) {
        res.status(404);
        throw new Error("Evaluation response not found.");
    }

    response.status = "reviewed";

    await response.save();

    await response.populate([
        { path: "submittedBy", select: "name" },
        { path: "template", select: "title" },
        { path: "teacher", populate: { path: "user", select: "name email" } },
    ]);

    res.json({
        success: true,
        message: "Evaluation marked as reviewed.",
        response,
    });
});

/*
|--------------------------------------------------------------------------
| Delete Response
|--------------------------------------------------------------------------
*/

export const deleteEvaluationResponse = asyncHandler(async (req, res) => {
    const response = await EvaluationResponse.findById(req.params.id);

    if (!response) {
        res.status(404);
        throw new Error("Evaluation response not found.");
    }

    await response.deleteOne();

    res.json({
        success: true,
        message: "Evaluation response deleted successfully.",
    });
});