import api from "./api";

export const sendNotificationApi = async (data) => {
  const res = await api.post("/notifications", data);
  return res.data;
};

export const getAllNotificationsApi = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const getMyNotificationsApi = async () => {
  const res = await api.get("/notifications/me");
  return res.data;
};

export const markNotificationReadApi = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsReadApi = async () => {
  const res = await api.put("/notifications/read-all");
  return res.data;
};

export const deleteNotificationApi = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};