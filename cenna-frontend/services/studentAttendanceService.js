import api from "./api";

export const getMyAttendanceApi = async (
  params = {}
) => {
  const response = await api.get(
    "/attendance/me",
    {
      params,
    }
  );

  return response.data;
};