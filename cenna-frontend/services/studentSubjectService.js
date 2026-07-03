import api from "./api";

export const getMySubjectsApi = async () => {
  const res = await api.get("/class-subjects/student/my-subjects");
  return res.data;
};