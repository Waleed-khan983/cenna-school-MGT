import api from "./api";

export const getStudentsByClassApi = async (classId) => {
  const res = await api.get(`/students/class/${classId}`);
  return res.data;
};

export const saveTeacherResultApi = async (data) => {
  const res = await api.post("/results", data);
  return res.data;
};