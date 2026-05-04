import axios from "axios";

/* ================================================================
   API LAYER
   - Centralized axios instance with base config
   - All API calls go through this — easy to swap base URL later
   ================================================================ */

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — add auth tokens, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Could add: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle global errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 404) {
      return Promise.reject(new Error("Resource not found"));
    }
    if (!error.response) {
      return Promise.reject(new Error("Network error — check your connection"));
    }
    return Promise.reject(error);
  }
);

/* ---- Product APIs ---- */
export const productApi = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${encodeURIComponent(category)}`),
  getCategories: () => api.get("/products/categories"),
  getLimited: (limit) => api.get(`/products?limit=${limit}`),
};

export default api;
