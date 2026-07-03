import api from "./api";

export const getSettingsApi = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettingsApi = async (data) => {
  const res = await api.put("/settings", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};