import api from "./api";

export const getMyResultsApi = async () => {
  const res = await api.get("/results/me");
  return res.data;
};