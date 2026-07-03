import api from "@/services/api";

export const createDatesheetApi = async (data) => {
  const res = await api.post("/datesheet", data);
  return res.data;
};

export const getDatesheetsApi = async () => {
  const res = await api.get("/datesheet");
  return res.data;
};

export const deleteDatesheetApi = async (id) => {
  const res = await api.delete(`/datesheet/${id}`);
  return res.data;
};