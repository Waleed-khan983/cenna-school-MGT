import api from "./api";

export const getMyRemarksApi = async () => {
  const res = await api.get("/remarks/my");
  return res.data;
};

export const getMyStudentRemarksApi = async () => {
  const res = await api.get("/remarks/me");
  return res.data;
};

export const createRemarkApi = async (data) => {
  const res = await api.post("/remarks", data);
  return res.data;
};

export const deleteRemarkApi = async (id) => {
  const res = await api.delete(`/remarks/${id}`);
  return res.data;
};