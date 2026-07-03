import api from "./api";

export const getUsers = async (role = "") => {
  const res = await api.get("/users", {
    params: role ? { role } : {},
  });

  return res.data;
};

export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const toggleUserStatus = async (id) => {
  const res = await api.put(`/users/toggle-status/${id}`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};