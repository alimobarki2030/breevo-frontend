// API Configuration
const API_BASE_URL = 'https://breevo-backend.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    googleLogin: `${API_BASE_URL}/auth/google-login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  products: {
    base: `${API_BASE_URL}/products`,
  },
  ai: {
    base: `${API_BASE_URL}/ai`,
  }
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
  });

  return response;
};

export default API_BASE_URL;