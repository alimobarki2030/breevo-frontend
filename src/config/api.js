// src/config/api.js

// ✅ API Base URL Configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://breevo-backend.onrender.com"
    : "http://localhost:8000";

// ✅ Alternative API URLs (if needed)
const API_URLS = {
  development: "http://localhost:8000",
  staging: "https://breevo-staging.onrender.com",
  production: "https://breevo-backend.onrender.com"
};

// ✅ Get API URL based on environment
export const getApiUrl = () => {
  const environment = process.env.NODE_ENV || "development";
  return API_URLS[environment] || API_URLS.development;
};

// ✅ Complete API Endpoints Configuration
export const API_ENDPOINTS = {
  // 🔐 Authentication & User Management
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    googleLogin: `${API_BASE_URL}/auth/google-login`,
    facebookLogin: `${API_BASE_URL}/auth/facebook-login`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    resendVerification: `${API_BASE_URL}/auth/resend-verification`,
  },

  // 👤 User Profile & Settings
  user: {
    profile: `${API_BASE_URL}/user/profile`,
    updateProfile: `${API_BASE_URL}/user/profile`,
    changePassword: `${API_BASE_URL}/user/change-password`,
    uploadAvatar: `${API_BASE_URL}/user/avatar`,
    deleteAccount: `${API_BASE_URL}/user/delete`,
    preferences: `${API_BASE_URL}/user/preferences`,
  },

  // 📦 Products Management
  products: {
    list: `${API_BASE_URL}/products`,
    create: `${API_BASE_URL}/products/create`,
    update: (id) => `${API_BASE_URL}/products/${id}`,
    delete: (id) => `${API_BASE_URL}/products/${id}`,
    get: (id) => `${API_BASE_URL}/products/${id}`,
    duplicate: (id) => `${API_BASE_URL}/products/${id}/duplicate`,
    bulk: `${API_BASE_URL}/products/bulk`,
    export: `${API_BASE_URL}/products/export`,
    import: `${API_BASE_URL}/products/import`,
    search: `${API_BASE_URL}/products/search`,
    categories: `${API_BASE_URL}/products/categories`,
  },

  // 🎯 SEO & Content Generation
  seo: {
    generateKeyword: `${API_BASE_URL}/seo/generate-keyword`,
    generateTitle: `${API_BASE_URL}/seo/generate-title`,
    generateDescription: `${API_BASE_URL}/seo/generate-description`,
    generateMetaTitle: `${API_BASE_URL}/seo/generate-meta-title`,
    generateMetaDescription: `${API_BASE_URL}/seo/generate-meta-description`,
    generateUrlPath: `${API_BASE_URL}/seo/generate-url-path`,
    generateImageAlt: `${API_BASE_URL}/seo/generate-image-alt`,
    generateAll: `${API_BASE_URL}/seo/generate-all`,
    analyzeProduct: `${API_BASE_URL}/seo/analyze-product`,
    scoreProduct: `${API_BASE_URL}/seo/score-product`,
    checkKeyword: `${API_BASE_URL}/seo/check-keyword`,
    suggestions: `${API_BASE_URL}/seo/suggestions`,
  },

  // 💳 Subscription & Billing
  subscription: {
    plans: `${API_BASE_URL}/subscription/plans`,
    current: `${API_BASE_URL}/subscription/current`,
    subscribe: `${API_BASE_URL}/subscription/subscribe`,
    cancel: `${API_BASE_URL}/subscription/cancel`,
    upgrade: `${API_BASE_URL}/subscription/upgrade`,
    downgrade: `${API_BASE_URL}/subscription/downgrade`,
    invoices: `${API_BASE_URL}/subscription/invoices`,
    usage: `${API_BASE_URL}/subscription/usage`,
    trial: `${API_BASE_URL}/subscription/trial`,
  },

  // 💰 Payment Processing
  payment: {
    createIntent: `${API_BASE_URL}/payment/create-intent`,
    confirm: `${API_BASE_URL}/payment/confirm`,
    webhook: `${API_BASE_URL}/payment/webhook`,
    methods: `${API_BASE_URL}/payment/methods`,
    addMethod: `${API_BASE_URL}/payment/add-method`,
    removeMethod: (id) => `${API_BASE_URL}/payment/methods/${id}`,
    refund: `${API_BASE_URL}/payment/refund`,
  },

  // 📁 File Management
  files: {
    upload: `${API_BASE_URL}/files/upload`,
    uploadImage: `${API_BASE_URL}/files/upload-image`,
    uploadAvatar: `${API_BASE_URL}/files/upload-avatar`,
    delete: (id) => `${API_BASE_URL}/files/${id}`,
    get: (id) => `${API_BASE_URL}/files/${id}`,
    list: `${API_BASE_URL}/files`,
  },

  // 📊 Analytics & Reports
  analytics: {
    dashboard: `${API_BASE_URL}/analytics/dashboard`,
    products: `${API_BASE_URL}/analytics/products`,
    seo: `${API_BASE_URL}/analytics/seo`,
    usage: `${API_BASE_URL}/analytics/usage`,
    performance: `${API_BASE_URL}/analytics/performance`,
    export: `${API_BASE_URL}/analytics/export`,
  },

  // 🎯 AI & Generation Services
  ai: {
    generateText: `${API_BASE_URL}/ai/generate-text`,
    generateImage: `${API_BASE_URL}/ai/generate-image`,
    translate: `${API_BASE_URL}/ai/translate`,
    summarize: `${API_BASE_URL}/ai/summarize`,
    optimize: `${API_BASE_URL}/ai/optimize`,
    check: `${API_BASE_URL}/ai/check`,
    usage: `${API_BASE_URL}/ai/usage`,
  },

  // 🛠️ Admin & Management
  admin: {
    users: `${API_BASE_URL}/admin/users`,
    getUser: (id) => `${API_BASE_URL}/admin/users/${id}`,
    updateUser: (id) => `${API_BASE_URL}/admin/users/${id}`,
    deleteUser: (id) => `${API_BASE_URL}/admin/users/${id}`,
    stats: `${API_BASE_URL}/admin/stats`,
    logs: `${API_BASE_URL}/admin/logs`,
    settings: `${API_BASE_URL}/admin/settings`,
    backup: `${API_BASE_URL}/admin/backup`,
    maintenance: `${API_BASE_URL}/admin/maintenance`,
  },

  // 📧 Notifications & Communication
  notifications: {
    list: `${API_BASE_URL}/notifications`,
    markRead: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    markAllRead: `${API_BASE_URL}/notifications/read-all`,
    delete: (id) => `${API_BASE_URL}/notifications/${id}`,
    preferences: `${API_BASE_URL}/notifications/preferences`,
    send: `${API_BASE_URL}/notifications/send`,
  },

  // 🎫 Support & Tickets
  support: {
    tickets: `${API_BASE_URL}/support/tickets`,
    createTicket: `${API_BASE_URL}/support/tickets/create`,
    getTicket: (id) => `${API_BASE_URL}/support/tickets/${id}`,
    updateTicket: (id) => `${API_BASE_URL}/support/tickets/${id}`,
    closeTicket: (id) => `${API_BASE_URL}/support/tickets/${id}/close`,
    faq: `${API_BASE_URL}/support/faq`,
    contact: `${API_BASE_URL}/support/contact`,
  },

  // 🔧 System & Health
  system: {
    health: `${API_BASE_URL}/system/health`,
    status: `${API_BASE_URL}/system/status`,
    version: `${API_BASE_URL}/system/version`,
    config: `${API_BASE_URL}/system/config`,
    maintenance: `${API_BASE_URL}/system/maintenance`,
  },
};

// ✅ HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// ✅ Request Headers Configuration
export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const getFileUploadHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  // Don't set Content-Type for file uploads - let browser set it
});

export const getBasicHeaders = () => ({
  'Content-Type': 'application/json',
});

// ✅ API Request Timeout Configuration
export const API_CONFIG = {
  timeout: {
    default: 30000,      // 30 seconds
    upload: 120000,      // 2 minutes for file uploads
    generation: 60000,   // 1 minute for AI generation
    short: 10000,        // 10 seconds for quick requests
  },
  retry: {
    attempts: 3,
    delay: 1000,         // 1 second between retries
  },
  cache: {
    enabled: true,
    duration: 300000,    // 5 minutes
  },
};

// ✅ Error Status Codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  RATE_LIMITED: 429,
};

// ✅ Success Status Codes
export const SUCCESS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

// ✅ Helper Functions
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const buildFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  return formData;
};

// ✅ Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      apiUrl: API_URLS.development,
      debug: true,
      timeout: API_CONFIG.timeout.default,
      enableLogging: true,
    },
    staging: {
      apiUrl: API_URLS.staging,
      debug: true,
      timeout: API_CONFIG.timeout.default,
      enableLogging: true,
    },
    production: {
      apiUrl: API_URLS.production,
      debug: false,
      timeout: API_CONFIG.timeout.default,
      enableLogging: false,
    },
  };

  return configs[env] || configs.development;
};

// ✅ Default export
export default API_ENDPOINTS;

// ✅ Named exports for convenience
export {
  API_BASE_URL,
  API_URLS,
};