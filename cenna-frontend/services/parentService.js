import api from "./api";

export const getParents = async (params = {}) => {
  const res = await api.get("/parents", { params });
  return res.data;
};

export const getParent = async (id) => {
  const res = await api.get(`/parents/${id}`);
  return res.data;
};

export const getMyParentProfileApi = async () => {
  const res = await api.get("/parents/me");
  return res.data;
};

export const getMyChildrenAttendanceApi = async (params = {}) => {
  const res = await api.get("/parents/attendance", { params });
  return res.data;
};

export const getMyChildrenResultsApi = async (params = {}) => {
  const res = await api.get("/parents/results", { params });
  return res.data;
};

export const getMyChildrenAssignmentsApi = async (params = {}) => {
  const res = await api.get("/parents/assignments", { params });
  return res.data;
};

export const getMyChildrenFeesApi = async (params = {}) => {
  const res = await api.get("/parents/fees", { params });
  return res.data;
};

export const createParent = async (data) => {
  const res = await api.post("/parents", data);
  return res.data;
};

export const updateParent = async ({ id, data }) => {
  const res = await api.put(`/parents/${id}`, data);
  return res.data;
};

export const updateParentProfileImageApi = async (formData) => {
  const res = await api.put(
    "/parents/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteParent = async (id) => {
  const res = await api.delete(`/parents/${id}`);
  return res.data;
};