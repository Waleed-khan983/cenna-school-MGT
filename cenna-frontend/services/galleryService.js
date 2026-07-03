import api from "./api";

export const getGalleryApi = async (params = {}) => {
  const res = await api.get("/gallery", { params });
  return res.data;
};

export const createGalleryApi = async (formData) => {
  const res = await api.post("/gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateGalleryApi = async ({ id, formData }) => {
  const res = await api.put(`/gallery/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteGalleryApi = async (id) => {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
};