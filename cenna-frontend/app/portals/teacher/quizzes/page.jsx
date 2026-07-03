"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import {
  fetchMyQuizzes,
  fetchQuiz,
  addQuiz,
  addQuestion,
  removeQuiz,
  removeQuestion,
  clearSelectedQuiz,
  publishQuiz,
  fetchQuizResults,
  publishQuizResults,
} from "@/store/quizSlice";

import PageLoader from "@/components/ui/PageLoader";

const initialQuizForm = {
  assignmentId: "",
  title: "",
  description: "",
  duration: 20,
};

const initialQuestionForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
  marks: 1,
};

export default function TeacherQuizzesPage() {
  const dispatch = useDispatch();

  const [quizForm, setQuizForm] = useState(initialQuizForm);
  const [questionForm, setQuestionForm] = useState(initialQuestionForm);
  const [search, setSearch] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [selectedResultsQuiz, setSelectedResultsQuiz] = useState(null);

  const { assignments = [], loading: assignmentsLoading } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  const {
    quizzes = [],
    quiz,
    questions = [],
    quizResults = [],
    loading,
    error,
  } = useSelector((state) => state.quizzes || {});

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
    dispatch(fetchMyQuizzes());
  }, [dispatch]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item._id === quizForm.assignmentId);
  }, [assignments, quizForm.assignmentId]);

  const filteredQuizzes = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return quizzes;

    return quizzes.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const className = item.class?.displayName?.toLowerCase() || "";
      const subject = item.subject?.name?.toLowerCase() || "";

      return (
        title.includes(value) ||
        className.includes(value) ||
        subject.includes(value)
      );
    });
  }, [quizzes, search]);

  const totalResultMarks = selectedResultsQuiz?.totalMarks || 0;

  const handleQuizChange = (event) => {
    const { name, value } = event.target;

    setQuizForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (event) => {
    const { name, value } = event.target;

    setQuestionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateQuiz = async (event) => {
    event.preventDefault();

    if (!selectedAssignment) {
      toast.error("Please select class and subject");
      return;
    }

    if (!quizForm.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    try {
      await dispatch(
        addQuiz({
          classId: selectedAssignment.class._id,
          subjectId: selectedAssignment.subject._id,
          title: quizForm.title,
          description: quizForm.description,
          duration: Number(quizForm.duration),
        })
      ).unwrap();

      toast.success("Quiz created as draft. Add questions, then publish it.");
      setQuizForm(initialQuizForm);
      dispatch(fetchMyQuizzes());
    } catch (error) {
      toast.error(error || "Failed to create quiz");
    }
  };

  const handleOpenQuiz = async (id) => {
    setSelectedQuizId(id);
    await dispatch(fetchQuiz(id));
  };

  const handleAddQuestion = async (event) => {
    event.preventDefault();

    if (!selectedQuizId) {
      toast.error("Please open a quiz first");
      return;
    }

    if (quiz?.isPublished) {
      toast.error("This quiz is already published. You cannot add more questions.");
      return;
    }

    if (!questionForm.question.trim()) {
      toast.error("Question is required");
      return;
    }

    if (
      !questionForm.optionA.trim() ||
      !questionForm.optionB.trim() ||
      !questionForm.optionC.trim() ||
      !questionForm.optionD.trim()
    ) {
      toast.error("All options are required");
      return;
    }

    try {
      await dispatch(
        addQuestion({
          quizId: selectedQuizId,
          question: questionForm.question,
          optionA: questionForm.optionA,
          optionB: questionForm.optionB,
          optionC: questionForm.optionC,
          optionD: questionForm.optionD,
          correctAnswer: questionForm.correctAnswer,
          marks: Number(questionForm.marks),
        })
      ).unwrap();

      toast.success("Question added successfully");
      setQuestionForm(initialQuestionForm);
      dispatch(fetchQuiz(selectedQuizId));
      dispatch(fetchMyQuizzes());
    } catch (error) {
      toast.error(error || "Failed to add question");
    }
  };

  const handlePublishQuiz = async (item) => {
    const confirmed = window.confirm(
      `Publish "${item.title}" to students? After publishing, you cannot add/delete questions.`
    );

    if (!confirmed) return;

    try {
      await dispatch(publishQuiz(item._id)).unwrap();
      toast.success("Quiz published and assigned to students");
      dispatch(fetchMyQuizzes());

      if (selectedQuizId === item._id) {
        dispatch(fetchQuiz(item._id));
      }
    } catch (error) {
      toast.error(error || "Failed to publish quiz");
    }
  };

  const handleViewResults = async (item) => {
    try {
      setSelectedResultsQuiz(item);
      await dispatch(fetchQuizResults(item._id)).unwrap();
    } catch (error) {
      toast.error(error || "Failed to load quiz results");
    }
  };

  const handlePublishResults = async (item) => {
    const confirmed = window.confirm(
      `Publish results for "${item.title}"? Students will be able to see their marks.`
    );

    if (!confirmed) return;

    try {
      await dispatch(publishQuizResults(item._id)).unwrap();
      toast.success("Quiz results published to students");
      dispatch(fetchMyQuizzes());

      if (selectedResultsQuiz?._id === item._id) {
        setSelectedResultsQuiz({
          ...selectedResultsQuiz,
          resultsPublished: true,
        });
      }
    } catch (error) {
      toast.error(error || "Failed to publish results");
    }
  };

  const handleDeleteQuiz = async (item) => {
    const confirmed = window.confirm(`Delete quiz "${item.title}"?`);

    if (!confirmed) return;

    try {
      await dispatch(removeQuiz(item._id)).unwrap();
      toast.success("Quiz deleted successfully");

      if (selectedQuizId === item._id) {
        setSelectedQuizId("");
        dispatch(clearSelectedQuiz());
      }

      if (selectedResultsQuiz?._id === item._id) {
        setSelectedResultsQuiz(null);
      }
    } catch (error) {
      toast.error(error || "Failed to delete quiz");
    }
  };

  const handleDeleteQuestion = async (question) => {
    if (quiz?.isPublished) {
      toast.error("This quiz is already published. You cannot delete questions.");
      return;
    }

    const confirmed = window.confirm("Delete this question?");

    if (!confirmed) return;

    try {
      await dispatch(removeQuestion(question._id)).unwrap();
      toast.success("Question deleted successfully");
      dispatch(fetchQuiz(selectedQuizId));
      dispatch(fetchMyQuizzes());
    } catch (error) {
      toast.error(error || "Failed to delete question");
    }
  };

  if (assignmentsLoading) {
    return <PageLoader text="Loading assigned classes..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Quizzes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create quiz as draft, add all questions, then publish it to students.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search quiz, class, subject..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreateQuiz}
        className="rounded-3xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-extrabold text-black">
          Create New Draft Quiz
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Class & Subject"
            name="assignmentId"
            value={quizForm.assignmentId}
            onChange={handleQuizChange}
          >
            <option value="">Select Assignment</option>

            {assignments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.class?.displayName ||
                  `${item.class?.name || ""} - ${item.class?.section || ""}`}{" "}
                | {item.subject?.name || "Subject"}
              </option>
            ))}
          </Select>

          <Input
            label="Quiz Title"
            name="title"
            value={quizForm.title}
            onChange={handleQuizChange}
            placeholder="Biology Chapter 1 Quiz"
          />

          <Input
            label="Duration Minutes"
            name="duration"
            type="number"
            value={quizForm.duration}
            onChange={handleQuizChange}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={quizForm.description}
              onChange={handleQuizChange}
              rows={3}
              placeholder="Quiz instructions..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Create Draft Quiz"}
        </button>
      </form>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-black">My Quizzes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Total quizzes: {quizzes.length}
          </p>

          <div className="mt-5 space-y-4">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((item) => (
                <div
                  key={item._id}
                  className={`rounded-2xl border p-5 ${selectedQuizId === item._id ? "bg-yellow-50" : "bg-gray-50"
                    }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-black">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-gray-600">
                        {item.class?.displayName || "Class N/A"} |{" "}
                        {item.subject?.name || "Subject N/A"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        text={item.isPublished ? "Published" : "Draft"}
                        color={item.isPublished ? "green" : "yellow"}
                      />

                      <Badge
                        text={
                          item.resultsPublished
                            ? "Results Published"
                            : "Results Hidden"
                        }
                        color={item.resultsPublished ? "blue" : "gray"}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Duration: {item.duration || 0} minutes | Total Marks:{" "}
                    {item.totalMarks || 0}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenQuiz(item._id)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"
                    >
                      Manage Questions
                    </button>

                    {!item.isPublished && (
                      <button
                        type="button"
                        onClick={() => handlePublishQuiz(item)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-500"
                      >
                        Publish / Assign
                      </button>
                    )}

                    {item.isPublished && (
                      <button
                        type="button"
                        onClick={() => handleViewResults(item)}
                        className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500"
                      >
                        View Marks
                      </button>
                    )}

                    {item.isPublished && !item.resultsPublished && (
                      <button
                        type="button"
                        onClick={() => handlePublishResults(item)}
                        className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
                      >
                        Publish Results
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteQuiz(item)}
                      className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
                No quizzes found.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-black">Quiz Questions</h2>

          {quiz ? (
            <div className="mt-1">
              <p className="text-sm text-gray-500">
                Managing: <b>{quiz.title}</b>
              </p>

              {quiz.isPublished && (
                <p className="mt-2 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
                  This quiz is published. Questions are locked.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Open a quiz to add questions.
            </p>
          )}

          {quiz && !quiz.isPublished && (
            <form onSubmit={handleAddQuestion} className="mt-5 space-y-4">
              <textarea
                name="question"
                value={questionForm.question}
                onChange={handleQuestionChange}
                rows={3}
                placeholder="Write question..."
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Option A"
                  name="optionA"
                  value={questionForm.optionA}
                  onChange={handleQuestionChange}
                />
                <Input
                  label="Option B"
                  name="optionB"
                  value={questionForm.optionB}
                  onChange={handleQuestionChange}
                />
                <Input
                  label="Option C"
                  name="optionC"
                  value={questionForm.optionC}
                  onChange={handleQuestionChange}
                />
                <Input
                  label="Option D"
                  name="optionD"
                  value={questionForm.optionD}
                  onChange={handleQuestionChange}
                />

                <Select
                  label="Correct Answer"
                  name="correctAnswer"
                  value={questionForm.correctAnswer}
                  onChange={handleQuestionChange}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </Select>

                <Input
                  label="Marks"
                  name="marks"
                  type="number"
                  value={questionForm.marks}
                  onChange={handleQuestionChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
              >
                Add Question
              </button>
            </form>
          )}

          <div className="mt-6 space-y-3">
            {questions.length > 0 ? (
              questions.map((item, index) => (
                <div key={item._id} className="rounded-2xl border bg-gray-50 p-4">
                  <p className="font-bold text-black">
                    {index + 1}. {item.question}
                  </p>

                  <div className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                    <p>A. {item.optionA}</p>
                    <p>B. {item.optionB}</p>
                    <p>C. {item.optionC}</p>
                    <p>D. {item.optionD}</p>
                  </div>

                  <p className="mt-3 text-sm font-bold text-green-700">
                    Correct: {item.correctAnswer} | Marks: {item.marks}
                  </p>

                  {!quiz?.isPublished && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(item)}
                      className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                    >
                      Delete Question
                    </button>
                  )}
                </div>
              ))
            ) : quiz ? (
              <div className="rounded-2xl bg-gray-50 p-6 text-center font-semibold text-gray-500">
                No questions added yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {selectedResultsQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-black">
                  Quiz Marks
                </h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  {selectedResultsQuiz.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Total Marks: {totalResultMarks}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResultsQuiz(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 font-bold text-black hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            {quizResults.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Student</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Score</th>
                      <th className="p-3 text-left">Percentage</th>
                      <th className="p-3 text-left">Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {quizResults.map((attempt, index) => (
                      <tr key={attempt._id} className="border-b">
                        <td className="p-3 font-bold">{index + 1}</td>
                        <td className="p-3 font-semibold">
                          {attempt.student?.user?.name || "N/A"}
                        </td>
                        <td className="p-3 text-gray-500">
                          {attempt.student?.user?.email || "N/A"}
                        </td>
                        <td className="p-3 font-bold">
                          {attempt.score || 0} / {totalResultMarks}
                        </td>
                        <td className="p-3 font-bold">
                          {attempt.percentage || 0}%
                        </td>
                        <td className="p-3 text-gray-500">
                          {attempt.createdAt
                            ? new Date(attempt.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-50 p-10 text-center font-semibold text-gray-500">
                No student has submitted this quiz yet.
              </div>
            )}

            {!selectedResultsQuiz.resultsPublished && (
              <button
                type="button"
                onClick={() => handlePublishResults(selectedResultsQuiz)}
                className="mt-5 w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800"
              >
                Publish Results to Students
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Badge({ text, color }) {
  const styles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold ${styles[color] || styles.gray
        }`}
    >
      {text}
    </span>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}