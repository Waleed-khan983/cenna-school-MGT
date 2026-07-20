import api from "@/services/api";

export const getParentDashboardApi = async () => {
  const res = await api.get("/parentDashboard/parent");
  return res.data;
};
