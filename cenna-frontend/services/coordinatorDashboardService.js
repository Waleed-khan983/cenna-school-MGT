import api from "./api";

export const getCoordinatorDashboardApi = async () => {
  const res = await api.get("/coordinator/dashboard");
  return res.data;
};