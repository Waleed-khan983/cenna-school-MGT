import api from "./api";

export const getMyLiveClassesApi = async () => {
  const res = await api.get("/live-classes/my");
  return res.data;
};

export const getStudentLiveClassesApi = async () => {
  const res = await api.get("/live-classes/student");
  return res.data;
};

export const createLiveClassApi = async (data) => {
  const res = await api.post("/live-classes", data);
  return res.data;
};

export const deleteLiveClassApi = async (id) => {
  const res = await api.delete(`/live-classes/${id}`);
  return res.data;
};

export const joinLiveClassApi = async (id) => {
  const res = await api.post(`/live-classes/${id}/join`);
  return res.data;
};

export const getLiveClassAttendanceApi = async (id) => {
  const res = await api.get(`/live-classes/${id}/attendance`);
  return res.data;
};