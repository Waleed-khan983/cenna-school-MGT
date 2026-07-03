import api from "@/services/api";

export const getPublicVacanciesApi = async () => {
  const res = await api.get("/job-vacancies/public");
  return res.data;
};