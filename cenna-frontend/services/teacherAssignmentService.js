import api from "./api";

export const getMyTeacherAssignmentsApi = async () => {
  const res = await api.get(
    "/class-subjects/teacher/my-assignments"
  );

  return res.data;
};