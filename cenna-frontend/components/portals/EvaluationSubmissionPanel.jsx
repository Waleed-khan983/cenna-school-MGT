"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchTeachers } from "@/store/teacherSlice";
import {
  fetchMyAssignments,
  fetchMyResponses,
  submitEvaluationResponse,
} from "@/store/evaluationSlice";

import PageLoader from "@/components/ui/PageLoader";

const answerKey = (sectionId, questionId) => `${sectionId}:${questionId}`;

export default function EvaluationSubmissionPanel() {
  const dispatch = useDispatch();

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [answers, setAnswers] = useState({});

  const { teachers } = useSelector((state) => state.teachers);

  const {
    myAssignments,
    myAssignmentsStatus,
    myAssignmentsError,
    myResponses,
    myResponsesStatus,
    submitStatus,
  } = useSelector((state) => state.evaluations);

  useEffect(() => {
    dispatch(fetchMyAssignments());
    dispatch(fetchMyResponses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const teacherOptions = useMemo(() => {
    if (!selectedAssignment) return [];

    const assignedTeacherIds = (selectedAssignment.assignedTeachers || []).map(
      (id) => String(id)
    );

    if (assignedTeacherIds.length === 0) return teachers;

    return teachers.filter((teacher) =>
      assignedTeacherIds.includes(String(teacher._id))
    );
  }, [selectedAssignment, teachers]);

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswers({});

    const assignedTeacherIds = assignment.assignedTeachers || [];
    setSelectedTeacher(
      assignedTeacherIds.length === 1 ? String(assignedTeacherIds[0]) : ""
    );
  };

  const handleAnswerChange = (sectionId, questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [answerKey(sectionId, questionId)]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTeacher) {
      toast.error("Please select who you are evaluating");
      return;
    }

    const missingRequired = selectedAssignment.template.sections.some(
      (section) =>
        section.questions.some(
          (question) =>
            question.required &&
            !answers[answerKey(section._id, question._id)]?.trim?.()
        )
    );

    if (missingRequired) {
      toast.error("Please answer all required questions");
      return;
    }

    const payloadAnswers = [];

    selectedAssignment.template.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const value = answers[answerKey(section._id, question._id)];

        if (value !== undefined && value !== "") {
          payloadAnswers.push({
            sectionId: section._id,
            questionId: question._id,
            answer: value,
          });
        }
      });
    });

    try {
      await dispatch(
        submitEvaluationResponse({
          assignment: selectedAssignment._id,
          teacher: selectedTeacher,
          answers: payloadAnswers,
        })
      ).unwrap();

      toast.success("Evaluation submitted successfully");

      setSelectedAssignment(null);
      setAnswers({});
      dispatch(fetchMyAssignments());
      dispatch(fetchMyResponses());
    } catch (error) {
      toast.error(error || "Failed to submit evaluation");
    }
  };

  if (myAssignmentsStatus === "loading" && myAssignments.length === 0) {
    return <PageLoader text="Loading evaluations..." />;
  }

  return (
    <div>
      {myAssignmentsError && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {myAssignmentsError}
        </div>
      )}

      {!selectedAssignment && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {myAssignments.length > 0 ? (
              myAssignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="rounded-3xl border bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-extrabold text-black">
                    {assignment.title || assignment.template?.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {assignment.template?.description || "No description"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Due:{" "}
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSelectAssignment(assignment)}
                    className="mt-5 !cursor-pointer rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
                  >
                    Start Evaluation
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm md:col-span-2">
                No active evaluations are available right now.
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-extrabold text-black">
              My Submitted Evaluations
            </h2>

            {myResponsesStatus === "loading" ? (
              <PageLoader text="Loading responses..." />
            ) : myResponses.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-4 py-4">#</th>
                      <th className="px-4 py-4 text-left">Template</th>
                      <th className="px-4 py-4 text-left">Teacher</th>
                      <th className="px-4 py-4">Score</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {myResponses.map((response, index) => (
                      <tr
                        key={response._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 text-center font-bold">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          {response.template?.title || "N/A"}
                        </td>

                        <td className="px-4 py-4">
                          {response.teacher?.user?.name || "N/A"}
                        </td>

                        <td className="px-4 py-4 text-center">
                          {response.percentage}%
                        </td>

                        <td className="px-4 py-4 text-center font-bold capitalize">
                          {response.status}
                        </td>

                        <td className="px-4 py-4 text-center">
                          {response.submittedAt
                            ? new Date(
                                response.submittedAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
                You haven&apos;t submitted any evaluations yet.
              </div>
            )}
          </div>
        </>
      )}

      {selectedAssignment && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-black">
                {selectedAssignment.title || selectedAssignment.template?.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAssignment(null)}
              className="!cursor-pointer rounded-xl bg-gray-100 px-5 py-3 font-bold text-black"
            >
              Back
            </button>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Who are you evaluating?
            </label>

            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            >
              <option value="">Select Teacher</option>

              {teacherOptions.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.user?.name || "Unnamed Teacher"}
                </option>
              ))}
            </select>
          </div>

          {selectedAssignment.template.sections.map((section) => (
            <div key={section._id} className="mb-6">
              <h3 className="mb-1 text-lg font-extrabold text-black">
                {section.title}
              </h3>

              {section.description && (
                <p className="mb-3 text-sm text-gray-500">
                  {section.description}
                </p>
              )}

              <div className="space-y-4">
                {section.questions.map((question) => (
                  <div
                    key={question._id}
                    className="rounded-2xl border bg-gray-50 p-4"
                  >
                    <p className="mb-3 font-bold text-black">
                      {question.question}
                      {question.required && (
                        <span className="text-red-600"> *</span>
                      )}
                    </p>

                    {question.type === "mcq" ? (
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option) => {
                          const value =
                            answers[answerKey(section._id, question._id)];

                          return (
                            <label
                              key={option._id}
                              className={`!cursor-pointer rounded-xl px-4 py-2 text-sm font-bold ${
                                value === option.text
                                  ? "bg-black text-white"
                                  : "border bg-white text-gray-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name={answerKey(section._id, question._id)}
                                value={option.text}
                                checked={value === option.text}
                                onChange={(e) =>
                                  handleAnswerChange(
                                    section._id,
                                    question._id,
                                    e.target.value
                                  )
                                }
                                className="hidden"
                              />
                              {option.text}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea
                        rows={3}
                        value={
                          answers[answerKey(section._id, question._id)] || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            section._id,
                            question._id,
                            e.target.value
                          )
                        }
                        placeholder="Write your answer..."
                        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitStatus === "loading"}
            className="mt-2 !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {submitStatus === "loading" ? "Submitting..." : "Submit Evaluation"}
          </button>
        </form>
      )}
    </div>
  );
}
