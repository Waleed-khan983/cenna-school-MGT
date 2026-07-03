import api from "@/services/api";

export const submitJobApplicationApi = async (data) => {
  const res = await api.post("/job-applications/public", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getJobApplicationsApi = async () => {
  const res = await api.get("/job-applications");
  return res.data;
};

export const updateJobApplicationStatusApi = async (id, status) => {
  const res = await api.put(`/job-applications/${id}/status`, { status });
  return res.data;
};

export const deleteJobApplicationApi = async (id) => {
  const res = await api.delete(`/job-applications/${id}`);
  return res.data;
};