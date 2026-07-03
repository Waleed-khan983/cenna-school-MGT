import api from "./api";

export const getMyProfileApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfileApi = async (data) => {
  const res = await api.put("/auth/update-profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const changePasswordApi = async (data) => {
  const res = await api.put("/auth/change-password", data);
  return res.data;
};


