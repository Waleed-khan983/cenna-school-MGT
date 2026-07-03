import api from "./api";

export const getTeachers = async (params = {}) => {
  const res = await api.get("/teachers", { params });
  return res.data;
};

export const getTeacher = async (id) => {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
};

export const createTeacher = async (data) => {
  const res = await api.post("/teachers", data);
  return res.data;
};

export const updateTeacher = async ({ id, data }) => {
  const res = await api.put(`/teachers/${id}`, data);
  return res.data;
};

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};