import api from "./api";

export const getMyLecturesApi = async () => {
  const res = await api.get("/lectures/my");
  return res.data;
};

export const getStudentLecturesApi = async () => {
  const res = await api.get("/lectures/student");
  return res.data;
};

export const createLectureApi = async (data) => {
  const res = await api.post("/lectures", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteLectureApi = async (id) => {
  const res = await api.delete(`/lectures/${id}`);
  return res.data;
};