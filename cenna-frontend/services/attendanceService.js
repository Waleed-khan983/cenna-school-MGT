import api from "./api";

export const markAttendanceApi = async (data) => {
  const res = await api.post("/attendance/mark", data);
  return res.data;
};

export const getClassAttendanceApi = async ({
  classId,
  subjectId,
  date,
  period,
}) => {
  const res = await api.get(
    `/attendance/class/${classId}`,
    {
      params: {
        subjectId,
        date,
        period,
      },
    }
  );

  return res.data;
};

export const getMonthlyAttendanceReportApi = async ({
  classId,
  subjectId,
  month,
  year,
}) => {
  const res = await api.get(
    "/attendance/report/monthly",
    {
      params: {
        classId,
        subjectId,
        month,
        year,
      },
    }
  );

  return res.data;
};

export const getStudentAttendanceApi = async ({
  studentId,
  subjectId,
  month,
  year,
}) => {
  const res = await api.get(
    `/attendance/student/${studentId}`,
    {
      params: {
        subjectId,
        month,
        year,
      },
    }
  );

  return res.data;
};