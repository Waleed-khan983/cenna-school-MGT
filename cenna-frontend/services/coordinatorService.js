import api from "./api";




export const getClassMonitoringApi = async () => {
  const res = await api.get("/coordinator/classes");
  return res.data;
};

export const getCoordinatorAttendanceApi = async () => {
  const res = await api.get("/coordinator/attendance");
  
  return res.data;
};

export const getTeacherMonitoringApi = async () => {
  const res = await api.get("/coordinator/teachers");
  return res.data;
};

export const getStudentPerformanceApi = async () => {
  const res = await api.get("/coordinator/performance");
  return res.data;
};

export const getStudentRemarksApi = async () => {
  const { data } = await api.get("/coordinator/remarks");
  return data;
};

export const getAwardRecommendationsApi =
async () => {
  const { data } =
  await api.get("/coordinator/awards");
  
  return data;
};

 

export const getCoordinatorDashboardApi = async () => {
  const { data } = await api.get("/coordinator/dashboard");
  return data;
};