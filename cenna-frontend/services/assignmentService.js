import api from "./api";

export const getMyAssignmentsApi = async () => {
  const res = await api.get("/assignments/my");
  return res.data;
};

export const createAssignmentApi = async (data) => {
  const res = await api.post("/assignments", data);
  return res.data;
};

export const getStudentAssignmentsApi = async () => {
  const res = await api.get("/assignments/student");
  return res.data;
};

export const deleteAssignmentApi = async (id) => {
  const res = await api.delete(`/assignments/${id}`);
  return res.data;
};