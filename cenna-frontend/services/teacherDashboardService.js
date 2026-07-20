import api from "@/services/api";

export const getTeacherDashboardApi = async () => {
  const res = await api.get("/teacherDashboard/teacher");
  return res.data;
};
