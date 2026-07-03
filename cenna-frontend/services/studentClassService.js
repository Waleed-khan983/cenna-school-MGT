import api from "./api";

export const getMyClassApi = async () => {
  const response = await api.get("/classes/me");

  return response.data;
};