import api from "@/services/api";

export const registerAlumniApi = async (data) => {
  const res = await api.post("/alumni/register", data);
  return res.data;
};