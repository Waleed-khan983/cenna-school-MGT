import asyncHandler from "express-async-handler";
import EvaluationResponse from "../models/evaluationResponse.js";
import Teacher from "../models/teacher.js";

/*
|--------------------------------------------------------------------------
| Teacher Overall Report
|--------------------------------------------------------------------------
*/

export const getTeacherOverallReport = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId).populate(
        "user",
        "name email"
    );

    if (!teacher) {
        res.status(404);
        throw new Error("Teacher not found.");
    }

    const responses = await EvaluationResponse.find({
        teacher: teacherId,
    }).populate("template");

    if (!responses.length) {
        return res.json({
            success: true,
            teacher,
            totalResponses: 0,
            overallPercentage: 0,
            sections: [],
        });
    }

    let totalObtained = 0;
    let totalMaximum = 0;

    const sectionScores = {};

    for (const response of responses) {
        const template = response.template;

        for (const section of template.sections) {
            if (!sectionScores[section._id]) {
                sectionScores[section._id] = {
                    title: section.title,
                    obtained: 0,
                    maximum: 0,
                };
            }

            const maxScore =
                Math.max(
                    ...section.questions.flatMap((q) =>
                        q.options.map((o) => Number(o.text))
                    )
                ) || 0;

            for (const question of section.questions) {
                const answer = response.answers.find(
                    (a) =>
                        a.sectionId.toString() === section._id.toString() &&
                        a.questionId.toString() === question._id.toString()
                );

                if (!answer) continue;

                if (typeof answer.answer === "number") {
                    totalObtained += answer.answer;
                    totalMaximum += maxScore;

                    sectionScores[section._id].obtained += answer.answer;
                    sectionScores[section._id].maximum += maxScore;
                }

                if (
                    typeof answer.answer === "string" &&
                    !isNaN(answer.answer)
                ) {
                    const score = Number(answer.answer);

                    totalObtained += score;
                    totalMaximum += maxScore;

                    sectionScores[section._id].obtained += score;
                    sectionScores[section._id].maximum += maxScore;
                }
            }
        }
    }

    const sections = Object.values(sectionScores).map((section) => ({
        title: section.title,
        obtained: section.obtained,
        maximum: section.maximum,
        percentage:
            section.maximum > 0
                ? Number(
                    (
                        (section.obtained / section.maximum) *
                        100
                    ).toFixed(2)
                )
                : 0,
    }));

    const overallPercentage =
        totalMaximum > 0
            ? Number(
                (
                    (totalObtained / totalMaximum) *
                    100
                ).toFixed(2)
            )
            : 0;

    res.json({
        success: true,
        teacher,
        totalResponses: responses.length,
        obtainedScore: totalObtained,
        maximumScore: totalMaximum,
        overallPercentage,
        sections,
    });
});
