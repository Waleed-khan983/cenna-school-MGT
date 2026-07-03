import api from "@/services/api";

export const createTimetableApi = async (data) => {
  const res = await api.post("/timetable", data);
  return res.data;
};

export const getTimetablesApi = async () => {
  const res = await api.get("/timetable");
  return res.data;
};

export const deleteTimetableApi = async (id) => {
  const res = await api.delete(`/timetable/${id}`);
  return res.data;
};