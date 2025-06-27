// src/config/api.js

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://breevo-backend.onrender.com"
    : "http://localhost:8000";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    googleLogin: `${API_BASE_URL}/auth/google-login`,
  },
  products: {
    list: `${API_BASE_URL}/products`,
    create: `${API_BASE_URL}/products/create`,
  },
};

export default API_ENDPOINTS;
