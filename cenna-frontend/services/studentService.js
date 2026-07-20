import api from "./api";

export const getStudents = async (params = {}) => {
  const response = await api.get("/students", { params });
  return response.data;
};

export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (data) => {
  const response = await api.post("/students", data);
  return response.data;
};

export const updateStudent = async ({ id, data }) => {
  const response = await api.put(`/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};


export const searchStudentsForFeesApi = async (query) => {
  const res = await api.get("/students/search/fees", {
    params: { query },
  });

  return res.data;
};

export const promoteStudentApi = async ({ id, data }) => {
  const response = await api.put(`/students/${id}/promote`, data);
  return response.data;
};

export const promoteStudentsBulkApi = async (data) => {
  const response = await api.put("/students/promote/bulk", data);
  return response.data;
};