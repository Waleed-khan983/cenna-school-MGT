import asyncHandler from "express-async-handler";

import Quiz from "../models/Quiz.js";
import QuizQuestion from "../models/QuizQuestion.js";
import Teacher from "../models/teacher.js";
import ClassSubject from "../models/ClassSubject.js";
import Student from "../models/Student.js";
import QuizAttempt from "../models/QuizAttempt.js";

const checkTeacherAssignment = async (userId, classId, subjectId) => {
  const teacher = await Teacher.findOne({ user: userId });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  const assignment = await ClassSubject.findOne({
    teacher: teacher._id,
    class: classId,
    subject: subjectId,
    isActive: true,
  });

  if (!assignment) {
    throw new Error("You are not assigned to this class and subject");
  }

  return teacher;
};

const updateQuizTotalMarks = async (quizId) => {
  const questions = await QuizQuestion.find({ quiz: quizId });

  const totalMarks = questions.reduce(
    (sum, question) => sum + Number(question.marks || 0),
    0
  );

  await Quiz.findByIdAndUpdate(quizId, { totalMarks });

  return totalMarks;
};

export const createQuiz = asyncHandler(async (req, res) => {
  const { classId, subjectId, title, description, duration } = req.body;

  if (!classId || !subjectId || !title) {
    res.status(400);
    throw new Error("Class, subject and title are required");
  }

  const teacher = await checkTeacherAssignment(
    req.user._id,
    classId,
    subjectId
  );

  const quiz = await Quiz.create({
    teacher: teacher._id,
    class: classId,
    subject: subjectId,
    title,
    description,
    duration,
    isPublished: false,
    resultsPublished: false,
  });

  const populated = await Quiz.findById(quiz._id)
    .populate("class", "displayName name section")
    .populate("subject", "name code");

  res.status(201).json({
    success: true,
    message: "Quiz created as draft",
    quiz: populated,
  });
});

export const getMyQuizzes = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher profile not found");
  }

  const quizzes = await Quiz.find({ teacher: teacher._id })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    quizzes,
  });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)
    .populate("class", "displayName name section")
    .populate("subject", "name code");

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  let questions = await QuizQuestion.find({ quiz: quiz._id }).sort({
    createdAt: 1,
  });

  if (req.user.role === "student") {
    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      res.status(404);
      throw new Error("Student profile not found");
    }

    if (String(student.class) !== String(quiz.class._id || quiz.class)) {
      res.status(403);
      throw new Error("You are not allowed to view this quiz");
    }

    if (!quiz.isPublished) {
      res.status(403);
      throw new Error("Quiz is not published yet");
    }

    questions = questions.map((question) => {
      const obj = question.toObject();
      delete obj.correctAnswer;
      return obj;
    });
  }

  res.status(200).json({
    success: true,
    quiz,
    questions,
  });
});

export const addQuizQuestion = asyncHandler(async (req, res) => {
  const {
    quizId,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    marks,
  } = req.body;

  if (!quizId || !question || !optionA || !optionB || !optionC || !optionD) {
    res.status(400);
    throw new Error("All question fields are required");
  }

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  if (quiz.isPublished) {
    res.status(400);
    throw new Error("Cannot add questions after quiz is published");
  }

  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher || String(quiz.teacher) !== String(teacher._id)) {
    res.status(403);
    throw new Error("You cannot add questions to this quiz");
  }

  const newQuestion = await QuizQuestion.create({
    quiz: quizId,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    marks,
  });

  const totalMarks = await updateQuizTotalMarks(quizId);

  res.status(201).json({
    success: true,
    message: "Question added successfully",
    question: newQuestion,
    totalMarks,
  });
});

export const deleteQuizQuestion = asyncHandler(async (req, res) => {
  const question = await QuizQuestion.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  const quiz = await Quiz.findById(question.quiz);

  if (quiz?.isPublished) {
    res.status(400);
    throw new Error("Cannot delete questions after quiz is published");
  }

  await QuizQuestion.findByIdAndDelete(req.params.id);

  const totalMarks = await updateQuizTotalMarks(question.quiz);

  res.status(200).json({
    success: true,
    message: "Question deleted successfully",
    id: req.params.id,
    totalMarks,
  });
});

export const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher || String(quiz.teacher) !== String(teacher._id)) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  const questionsCount = await QuizQuestion.countDocuments({ quiz: quiz._id });

  if (questionsCount === 0) {
    res.status(400);
    throw new Error("Add at least one question before publishing");
  }

  quiz.isPublished = true;
  await quiz.save();

  const populated = await Quiz.findById(quiz._id)
    .populate("class", "displayName name section")
    .populate("subject", "name code");

  res.status(200).json({
    success: true,
    message: "Quiz published successfully",
    quiz: populated,
  });
});

export const getQuizResults = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher || String(quiz.teacher) !== String(teacher._id)) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  const attempts = await QuizAttempt.find({ quiz: quiz._id })
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ score: -1 });

  res.status(200).json({
    success: true,
    attempts,
  });
});

export const publishQuizResults = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const teacher = await Teacher.findOne({ user: req.user._id });

  if (!teacher || String(quiz.teacher) !== String(teacher._id)) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  quiz.resultsPublished = true;
  await quiz.save();

  res.status(200).json({
    success: true,
    message: "Quiz results published successfully",
    quiz,
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await QuizAttempt.deleteMany({ quiz: quiz._id });
  await QuizQuestion.deleteMany({ quiz: quiz._id });
  await Quiz.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully",
    id: req.params.id,
  });
});

export const getStudentQuizzes = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const quizzes = await Quiz.find({
    class: student.class,
    isPublished: true,
  })
    .populate("class", "displayName name section")
    .populate("subject", "name code")
    .populate({
      path: "teacher",
      populate: { path: "user", select: "name email" },
    })
    .sort({ createdAt: -1 });

  const attempts = await QuizAttempt.find({
    student: student._id,
  }).select("quiz score percentage createdAt");

  const data = quizzes.map((quiz) => {
    const attempt = attempts.find(
      (item) => String(item.quiz) === String(quiz._id)
    );

    return {
      ...quiz.toObject(),
      attempted: !!attempt,
      attempt: quiz.resultsPublished ? attempt || null : null,
      resultPending: !!attempt && !quiz.resultsPublished,
    };
  });

  res.status(200).json({
    success: true,
    quizzes: data,
  });
});

export const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { quizId, answers } = req.body;

  if (!quizId || !answers || !Array.isArray(answers)) {
    res.status(400);
    throw new Error("Quiz and answers are required");
  }

  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const quiz = await Quiz.findById(quizId);

  if (!quiz || !quiz.isPublished) {
    res.status(404);
    throw new Error("Quiz not found or not published");
  }

  if (String(student.class) !== String(quiz.class)) {
    res.status(403);
    throw new Error("You are not allowed to attempt this quiz");
  }

  const existingAttempt = await QuizAttempt.findOne({
    quiz: quizId,
    student: student._id,
  });

  if (existingAttempt) {
    res.status(400);
    throw new Error("You already attempted this quiz");
  }

  const questions = await QuizQuestion.find({ quiz: quizId });

  let score = 0;
  let totalMarks = 0;

  questions.forEach((question) => {
    totalMarks += Number(question.marks || 1);

    const studentAnswer = answers.find(
      (answer) => String(answer.questionId) === String(question._id)
    );

    if (
      studentAnswer &&
      studentAnswer.selectedAnswer === question.correctAnswer
    ) {
      score += Number(question.marks || 1);
    }
  });

  const percentage =
    totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  await QuizAttempt.create({
    quiz: quizId,
    student: student._id,
    answers,
    score,
    percentage,
  });

  res.status(201).json({
    success: true,
    message: "Quiz submitted successfully. Result will be shown after teacher publishes it.",
  });
});