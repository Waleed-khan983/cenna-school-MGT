import api from "./api";

// ADMIN

export const launchCampaignApi = async (data) => {
  const res = await api.post("/evaluations/campaign", data);
  return res.data;
};

export const getCampaignsApi = async () => {
  const res = await api.get("/evaluations/campaigns");
  return res.data;
};

export const closeCampaignApi = async (id) => {
  const res = await api.put(`/evaluations/campaign/${id}/close`);
  return res.data;
};

export const getReportsApi = async () => {
  const res = await api.get("/evaluations/reports");
  return res.data;
};

// STUDENT

export const getActiveEvaluationsApi = async () => {
  const res = await api.get("/evaluations/active");
  return res.data;
};

export const submitEvaluationApi = async (data) => {
  const res = await api.post("/evaluations/submit", data);
  return res.data;
};