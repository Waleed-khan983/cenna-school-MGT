// services/jobApplicationPublicService.js

import api from "@/services/api";

export const submitApplication = async (formData) => {
  const res = await api.post(
    "/job-applications/public",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};