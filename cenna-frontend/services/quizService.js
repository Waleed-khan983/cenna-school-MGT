import api from "./api";

export const getMyQuizzesApi = async () => {
  const res = await api.get("/quizzes/my");
  return res.data;
};

export const getQuizApi = async (id) => {
  const res = await api.get(`/quizzes/${id}`);
  return res.data;
};

export const createQuizApi = async (data) => {
  const res = await api.post("/quizzes", data);
  return res.data;
};

export const publishQuizApi = async (id) => {
  const res = await api.put(`/quizzes/${id}/publish`);
  return res.data;
};

export const getQuizResultsApi = async (id) => {
  const res = await api.get(`/quizzes/${id}/results`);
  return res.data;
};

export const publishQuizResultsApi = async (id) => {
  const res = await api.put(`/quizzes/${id}/publish-results`);
  return res.data;
};

export const addQuizQuestionApi = async (data) => {
  const res = await api.post("/quizzes/questions", data);
  return res.data;
};

export const getStudentQuizzesApi = async () => {
  const res = await api.get("/quizzes/student");
  return res.data;
};

export const submitQuizAttemptApi = async (data) => {
  const res = await api.post("/quizzes/student/submit", data);
  return res.data;
};

export const deleteQuizApi = async (id) => {
  const res = await api.delete(`/quizzes/${id}`);
  return res.data;
};

export const deleteQuizQuestionApi = async (id) => {
  const res = await api.delete(`/quizzes/questions/${id}`);
  return res.data;
};