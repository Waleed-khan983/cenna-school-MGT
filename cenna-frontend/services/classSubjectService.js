import api from "./api";

export const getClassSubjects = async () => {
  const res = await api.get("/class-subjects");
  return res.data;
};

export const getClassSubject = async (id) => {
  const res = await api.get(`/class-subjects/${id}`);
  return res.data;
};

export const createClassSubject = async (data) => {
  const res = await api.post("/class-subjects", data);
  return res.data;
};

export const updateClassSubject = async ({ id, data }) => {
  const res = await api.put(`/class-subjects/${id}`, data);
  return res.data;
};

export const deleteClassSubject = async (id) => {
  const res = await api.delete(`/class-subjects/${id}`);
  return res.data;
};