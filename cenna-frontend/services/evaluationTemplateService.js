import api, { openPdfInNewTab } from "./api";

export const createTemplateApi = async (data) => {
  const res = await api.post("/evaluation-templates", data);
  return res.data;
};

export const getTemplatesApi = async () => {
  const res = await api.get("/evaluation-templates");
  return res.data;
};

export const getTemplateApi = async (id) => {
  const res = await api.get(`/evaluation-templates/${id}`);
  return res.data;
};

export const updateTemplateApi = async ({ id, data }) => {
  const res = await api.put(`/evaluation-templates/${id}`, data);
  return res.data;
};

export const deleteTemplateApi = async (id) => {
  const res = await api.delete(`/evaluation-templates/${id}`);
  return res.data;
};

export const publishTemplateApi = async (id) => {
  const res = await api.put(`/evaluation-templates/publish/${id}`);
  return res.data;
};

export const archiveTemplateApi = async (id) => {
  const res = await api.put(`/evaluation-templates/archive/${id}`);
  return res.data;
};

export const addSectionApi = async ({ templateId, data }) => {
  const res = await api.post(
    `/evaluation-templates/${templateId}/sections`,
    data
  );
  return res.data;
};

export const deleteSectionApi = async ({ templateId, sectionId }) => {
  const res = await api.delete(
    `/evaluation-templates/${templateId}/sections/${sectionId}`
  );
  return res.data;
};

export const addQuestionApi = async ({ templateId, sectionId, data }) => {
  const res = await api.post(
    `/evaluation-templates/${templateId}/sections/${sectionId}/questions`,
    data
  );
  return res.data;
};

export const updateQuestionApi = async ({
  templateId,
  sectionId,
  questionId,
  data,
}) => {
  const res = await api.put(
    `/evaluation-templates/${templateId}/sections/${sectionId}/questions/${questionId}`,
    data
  );
  return res.data;
};

export const deleteQuestionApi = async ({
  templateId,
  sectionId,
  questionId,
}) => {
  const res = await api.delete(
    `/evaluation-templates/${templateId}/sections/${sectionId}/questions/${questionId}`
  );
  return res.data;
};

export const addOptionApi = async ({
  templateId,
  sectionId,
  questionId,
  text,
}) => {
  const res = await api.post(
    `/evaluation-templates/${templateId}/sections/${sectionId}/questions/${questionId}/options`,
    { text }
  );
  return res.data;
};

export const deleteOptionApi = async ({
  templateId,
  sectionId,
  questionId,
  optionIndex,
}) => {
  const res = await api.delete(
    `/evaluation-templates/${templateId}/sections/${sectionId}/questions/${questionId}/options/${optionIndex}`
  );
  return res.data;
};

export const downloadBlankTemplatePdf = async (id) => {
  await openPdfInNewTab(`/evaluation-pdf/template/${id}/blank`);
};
