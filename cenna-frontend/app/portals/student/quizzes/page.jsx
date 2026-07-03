"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchStudentQuizzes,
  fetchQuiz,
  submitQuiz,
} from "@/store/quizSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function StudentQuizzesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  const { quizzes = [], quiz, questions = [], loading, error } = useSelector(
    (state) => state.quizzes || {}
  );

  useEffect(() => {
    dispatch(fetchStudentQuizzes());
  }, [dispatch]);

  const filteredQuizzes = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return quizzes;

    return quizzes.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const subject = item.subject?.name?.toLowerCase() || "";
      const teacher = item.teacher?.user?.name?.toLowerCase() || "";

      return (
        title.includes(value) ||
        subject.includes(value) ||
        teacher.includes(value)
      );
    });
  }, [quizzes, search]);

  const openQuiz = async (item) => {
    if (item.attempted) {
      toast.info("You already attempted this quiz");
      return;
    }

    setSelectedQuiz(item);
    setAnswers({});
    await dispatch(fetchQuiz(item._id));
  };

  const handleAnswer = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedQuiz) return;

    if (questions.length === 0) {
      toast.error("No questions found in this quiz");
      return;
    }

    const formattedAnswers = questions.map((question) => ({
      questionId: question._id,
      selectedAnswer: answers[question._id] || "",
    }));

    const unanswered = formattedAnswers.some((answer) => !answer.selectedAnswer);

    if (unanswered) {
      toast.error("Please answer all questions");
      return;
    }

    try {
      const result = await dispatch(
        submitQuiz({
          quizId: selectedQuiz._id,
          answers: formattedAnswers,
        })
      ).unwrap();

      toast.success("Quiz submitted successfully. Result will be shown after teacher publishes it.");

      setSelectedQuiz(null);
      setAnswers({});
      dispatch(fetchStudentQuizzes());
    } catch (error) {
      toast.error(error || "Failed to submit quiz");
    }
  };

  if (loading && !selectedQuiz) {
    return <PageLoader text="Loading quizzes..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Quizzes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Attempt quizzes assigned by your teachers.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search quiz, subject, teacher..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {filteredQuizzes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuizzes.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-extrabold text-black">
                {item.title}
              </h2>

              <p className="mt-2 text-sm font-semibold text-gray-600">
                Subject: {item.subject?.name || "N/A"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Teacher: {item.teacher?.user?.name || "N/A"}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Duration: {item.duration || 0} minutes
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Total Marks: {item.totalMarks || 0}
              </p>

              {item.attempted ? (
                <div className="mt-4 rounded-xl bg-green-50 p-4">
                  <p className="font-bold text-green-700">Attempted</p>

                  {item.attempt ? (
                    <>
                      <p className="mt-1 text-sm text-green-700">
                        Score: {item.attempt.score || 0}
                      </p>
                      <p className="text-sm text-green-700">
                        Percentage: {item.attempt.percentage || 0}%
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-yellow-700">
                      Result pending. Teacher has not published marks yet.
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openQuiz(item)}
                  className="mt-5 w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800"
                >
                  Start Quiz
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-600">
            No Quizzes Found
          </h2>
          <p className="mt-2 text-gray-500">
            Your teachers have not assigned quizzes yet.
          </p>
        </div>
      )}

      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-black">
                  {quiz?.title || selectedQuiz.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Answer all questions and submit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedQuiz(null);
                  setAnswers({});
                }}
                className="rounded-xl bg-gray-100 px-4 py-2 font-bold text-black hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            {questions.length > 0 ? (
              <div className="space-y-5">
                {questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="rounded-2xl border bg-gray-50 p-5"
                  >
                    <h3 className="font-extrabold text-black">
                      {index + 1}. {question.question}
                    </h3>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {["A", "B", "C", "D"].map((option) => (
                        <label
                          key={option}
                          className={`cursor-pointer rounded-xl border bg-white p-3 text-sm font-semibold ${answers[question._id] === option
                            ? "border-black"
                            : ""
                            }`}
                        >
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={answers[question._id] === option}
                            onChange={() => handleAnswer(question._id, option)}
                            className="mr-2"
                          />

                          {option}. {question[`option${option}`]}
                        </label>
                      ))}
                    </div>

                    <p className="mt-3 text-sm font-bold text-gray-500">
                      Marks: {question.marks || 1}
                    </p>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {loading ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-50 p-10 text-center font-semibold text-gray-500">
                No questions found.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}