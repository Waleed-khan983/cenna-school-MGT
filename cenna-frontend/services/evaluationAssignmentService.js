import api from "./api";

export const createAssignmentApi = async (data) => {
  const res = await api.post("/evaluation-assignments", data);
  return res.data;
};

export const getAssignmentsApi = async () => {
  const res = await api.get("/evaluation-assignments");
  return res.data;
};

export const getAssignmentApi = async (id) => {
  const res = await api.get(`/evaluation-assignments/${id}`);
  return res.data;
};

export const updateAssignmentApi = async ({ id, data }) => {
  const res = await api.put(`/evaluation-assignments/${id}`, data);
  return res.data;
};

export const deleteAssignmentApi = async (id) => {
  const res = await api.delete(`/evaluation-assignments/${id}`);
  return res.data;
};

export const publishAssignmentApi = async (id) => {
  const res = await api.put(`/evaluation-assignments/publish/${id}`);
  return res.data;
};

export const closeAssignmentApi = async (id) => {
  const res = await api.put(`/evaluation-assignments/close/${id}`);
  return res.data;
};

export const getMyAssignmentsApi = async () => {
  const res = await api.get("/evaluation-assignments/my");
  return res.data;
};
