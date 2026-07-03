import api from "@/services/api";

export const getStudentDashboardApi =
  async () => {
    const res =
      await api.get(
        "/studentDashboard/student"
      );

    return res.data;
  };