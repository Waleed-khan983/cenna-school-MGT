import api from "./api";

export const getNewsApi = async (params = {}) => {
  const res = await api.get("/news", { params });
  return res.data;
};

export const getNewsItemApi = async (id) => {
  const res = await api.get(`/news/${id}`);
  return res.data;
};

export const createNewsApi = async (data) => {
  const res = await api.post("/news", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const updateNewsApi = async ({ id, data }) => {
  const res = await api.put(`/news/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteNewsApi = async (id) => {
  const res = await api.delete(`/news/${id}`);
  return res.data;
};