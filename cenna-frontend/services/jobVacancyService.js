import api from "@/services/api";

export const createJobVacancyApi = async (data) => {
  const res = await api.post("/job-vacancies", data);
  return res.data;
};

export const getJobVacanciesApi = async () => {
  const res = await api.get("/job-vacancies");
  return res.data;
};

export const getPublicJobVacanciesApi = async () => {
  const res = await api.get("/job-vacancies/public");
  return res.data;
};

export const updateJobVacancyApi = async (id, data) => {
  const res = await api.put(`/job-vacancies/${id}`, data);
  return res.data;
};

export const deleteJobVacancyApi = async (id) => {
  const res = await api.delete(`/job-vacancies/${id}`);
  return res.data;
};