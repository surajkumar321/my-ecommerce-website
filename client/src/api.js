// src/api.js
import axios from "axios";
import store from "./redux/store";

// Backend API base URL
// Priority: .env value -> fallback localhost
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, ""),
});

// Attach token before every request
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Friendly error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      err.userMessage = "Please sign in to continue.";
    } else if (status === 403) {
      err.userMessage = "Admin only. You don't have permission for this action.";
    } else {
      err.userMessage =
        err?.response?.data?.message || "Something went wrong. Please try again.";
    }
    return Promise.reject(err);
  }
);

export default api;
