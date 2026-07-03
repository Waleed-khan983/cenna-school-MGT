import api from "@/services/api";

export const getDashboardStatsApi =
  async () => {
    const res =
      await api.get("/dashboard/stats");

    return res.data;
  };