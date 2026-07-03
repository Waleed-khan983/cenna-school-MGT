import api from "./api";

export const getFeesApi = async (params = {}) => {
  const res = await api.get("/fees", { params });
  return res.data;
};

export const generateFeeApi = async (data) => {
  const res = await api.post("/fees/generate", data);
  return res.data;
};

export const collectFeeApi = async ({ id, data }) => {
  const res = await api.put(`/fees/collect/${id}`, data);
  return res.data;
};

export const getMyFeesApi = async () => {
  const res = await api.get("/fees/me");
  return res.data;
};

export const getStudentFeesApi = async (studentId) => {
  const res = await api.get(`/fees/student/${studentId}`);
  return res.data;
};
export const deleteFeeApi = async (id) => {
  const res = await api.delete(`/fees/${id}`);
  return res.data;
};

export const getDefaultersApi = async () => {
  const res = await api.get("/fees/defaulters");
  return res.data;
};