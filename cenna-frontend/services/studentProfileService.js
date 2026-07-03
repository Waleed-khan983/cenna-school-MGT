import api from "./api";

export const getStudentProfileApi = async () => {
  const res = await api.get("/students/me");
  return res.data;
};

export const updateStudentAvatarApi = async (formData) => {
  const res = await api.put("/students/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};