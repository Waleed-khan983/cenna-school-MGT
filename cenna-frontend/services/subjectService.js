import api from "./api";

export const getSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data;
};

export const getSubject = async (id) => {
  const res = await api.get(`/subjects/${id}`);
  return res.data;
};

export const createSubject = async (data) => {
  const res = await api.post("/subjects", data);
  return res.data;
};

export const updateSubject = async ({ id, data }) => {
  const res = await api.put(`/subjects/${id}`, data);
  return res.data;
};

export const deleteSubject = async (id) => {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
};