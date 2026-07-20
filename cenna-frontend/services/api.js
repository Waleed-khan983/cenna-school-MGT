import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cenna_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const openPdfInNewTab = async (url) => {
  const res = await api.get(url, { responseType: "blob" });

  const blobUrl = URL.createObjectURL(
    new Blob([res.data], { type: "application/pdf" })
  );

  window.open(blobUrl, "_blank");

  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
};

export default api;