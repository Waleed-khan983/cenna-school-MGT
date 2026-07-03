import api from "./api";

export const enterResultApi = async (data) => {
  const res = await api.post("/results", data);
  return res.data;
};

export const getClassResultsApi = async (params = {}) => {
  const res = await api.get("/results", { params });
  return res.data;
};

export const getMyResultsApi = async () => {
  const res = await api.get("/results/me");
  return res.data;
};

export const getStudentResultsApi = async (studentId) => {
  const res = await api.get(`/results/student/${studentId}`);
  return res.data;
};

export const getSubjectsForClassApi = async (classId) => {
  const res = await api.get(`/results/subjects/${classId}`);
  return res.data;
};


export const updateResult = async ({ id, data }) => {
  const res = await api.put(`/results/${id}`, data);
  return res.data;
};

export const deleteResultApi = async (id) => {
  const res = await api.delete(`/results/${id}`);
  return res.data;
};