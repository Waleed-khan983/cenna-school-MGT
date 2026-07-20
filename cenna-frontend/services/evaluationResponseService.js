import api, { openPdfInNewTab } from "./api";

export const submitEvaluationApi = async (data) => {
  const res = await api.post("/evaluation-responses/submit", data);
  return res.data;
};

export const getMyResponsesApi = async () => {
  const res = await api.get("/evaluation-responses/my");
  return res.data;
};

export const getResponsesByAssignmentApi = async (assignmentId) => {
  const res = await api.get(
    `/evaluation-responses/assignment/${assignmentId}`
  );
  return res.data;
};

export const getTeacherResponsesApi = async (teacherId) => {
  const res = await api.get(`/evaluation-responses/teacher/${teacherId}`);
  return res.data;
};

export const getEvaluationResponsesApi = async () => {
  const res = await api.get("/evaluation-responses");
  return res.data;
};

export const getEvaluationResponseApi = async (id) => {
  const res = await api.get(`/evaluation-responses/${id}`);
  return res.data;
};

export const reviewEvaluationResponseApi = async (id) => {
  const res = await api.put(`/evaluation-responses/review/${id}`);
  return res.data;
};

export const deleteEvaluationResponseApi = async (id) => {
  const res = await api.delete(`/evaluation-responses/${id}`);
  return res.data;
};

export const downloadFilledResponsePdf = async (id) => {
  await openPdfInNewTab(`/evaluation-pdf/response/${id}/filled`);
};

export const getTeacherReportApi = async (teacherId) => {
  const res = await api.get(`/evaluation-reports/teacher/${teacherId}`);
  return res.data;
};
