import axios from "axios";

export const API = axios.create({
  baseURL: "https://smartexpense-api.onrender.com/api/v1",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            "https://smartexpense-api.onrender.com/api/v1/auth/refresh",
            { refreshToken }
          );
          const newToken = res.data.data.accessToken;
          const newRefresh = res.data.data.refreshToken;
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefresh);
          original.headers.Authorization = `Bearer ${newToken}`;
          return API(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);