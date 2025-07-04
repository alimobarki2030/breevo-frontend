// utils/api.js - API Configuration محدث للعمل مع Render
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://breevo-backend.onrender.com';

// API endpoints - شامل ومتكامل مع سلة
export const API_ENDPOINTS = {
  // المصادقة والحسابات
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    googleLogin: `${API_BASE_URL}/auth/google-login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
  },
  
  // إدارة المنتجات
  products: {
    base: `${API_BASE_URL}/products`,
    byId: (id) => `${API_BASE_URL}/products/${id}`,
  },
  
  // ذكاء اصطناعي
  ai: {
    base: `${API_BASE_URL}/ai`,
    optimize: `${API_BASE_URL}/ai/optimize`,
    generate: `${API_BASE_URL}/ai/generate`,
  },
  
  // تكامل سلة - مجموعة شاملة
  salla: {
    // إعدادات التفويض
    authorize: `${API_BASE_URL}/api/salla/authorize`,
    callback: `${API_BASE_URL}/api/salla/oauth/callback`,
    
    // إدارة المتاجر
    stores: `${API_BASE_URL}/api/salla/stores`,
    userStores: `${API_BASE_URL}/api/salla/user-stores`,
    syncStore: (storeId) => `${API_BASE_URL}/api/salla/stores/${storeId}/sync`,
    storeProducts: (storeId) => `${API_BASE_URL}/api/salla/stores/${storeId}/products`,
    
    // المتاجر المؤقتة
    verifyPendingStore: `${API_BASE_URL}/api/salla/pending-store/verify`,
    connectPendingStore: `${API_BASE_URL}/api/salla/connect-pending-store`,
    pendingStores: `${API_BASE_URL}/api/salla/pending-stores`,
    
    // webhook وإعدادات أخرى
    webhook: `${API_BASE_URL}/api/salla/webhook`,
    
    // أدوات المطورين
    testEmail: `${API_BASE_URL}/api/salla/test-email`,
    runEmailTasks: `${API_BASE_URL}/api/salla/run-email-tasks`,
  },
  
  // تحسين محركات البحث
  seo: {
    base: `${API_BASE_URL}/dataforseo`,
    analyze: `${API_BASE_URL}/dataforseo/analyze`,
  },
  
  // حالة النظام
  health: `${API_BASE_URL}/health`,
  info: `${API_BASE_URL}/api/info`,
};

// Helper function for API calls - محسنة مع معالجة أخطاء أفضل
export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log(`🔗 API Call: ${options.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(endpoint, {
      ...defaultOptions,
      ...options,
    });

    // تحقق من نجاح الطلب
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error ${response.status}:`, errorData);
      
      // معالجة خطأ انتهاء صلاحية الرمز
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        // يمكن إضافة redirect للتسجيل هنا
        window.location.href = '/auth/login';
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data);
    return data;

  } catch (error) {
    console.error(`❌ API Call Failed:`, error);
    throw error;
  }
};

// دوال مساعدة سريعة لسلة
export const sallaAPI = {
  // الحصول على رابط التفويض
  async getAuthorizationUrl() {
    return await apiCall(API_ENDPOINTS.salla.authorize);
  },
  
  // جلب متاجر المستخدم
  async getUserStores() {
    return await apiCall(API_ENDPOINTS.salla.userStores);
  },
  
  // التحقق من متجر مؤقت
  async verifyPendingStore(token) {
    return await apiCall(`${API_ENDPOINTS.salla.verifyPendingStore}?token=${token}`);
  },
  
  // ربط متجر مؤقت
  async connectPendingStore(verificationToken) {
    return await apiCall(API_ENDPOINTS.salla.connectPendingStore, {
      method: 'POST',
      body: JSON.stringify({ verification_token: verificationToken })
    });
  },
  
  // مزامنة منتجات متجر
  async syncStore(storeId) {
    return await apiCall(API_ENDPOINTS.salla.syncStore(storeId), {
      method: 'POST'
    });
  },
  
  // جلب منتجات متجر
  async getStoreProducts(storeId) {
    return await apiCall(API_ENDPOINTS.salla.storeProducts(storeId));
  }
};

// دوال مساعدة للمصادقة
export const authAPI = {
  async login(email, password) {
    return await apiCall(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  async register(userData) {
    return await apiCall(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  async getCurrentUser() {
    return await apiCall(API_ENDPOINTS.auth.me);
  },
  
  async logout() {
    const result = await apiCall(API_ENDPOINTS.auth.logout, { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    return result;
  }
};

// دوال مساعدة للمنتجات
export const productsAPI = {
  async getAll() {
    return await apiCall(API_ENDPOINTS.products.base);
  },
  
  async getById(id) {
    return await apiCall(API_ENDPOINTS.products.byId(id));
  },
  
  async create(productData) {
    return await apiCall(API_ENDPOINTS.products.base, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },
  
  async update(id, productData) {
    return await apiCall(API_ENDPOINTS.products.byId(id), {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },
  
  async delete(id) {
    return await apiCall(API_ENDPOINTS.products.byId(id), {
      method: 'DELETE'
    });
  }
};

// اختبار اتصال النظام
export const testConnection = async () => {
  try {
    const health = await apiCall(API_ENDPOINTS.health);
    const info = await apiCall(API_ENDPOINTS.info);
    
    console.log('🟢 Backend connection successful:', { health, info });
    return { success: true, health, info };
  } catch (error) {
    console.error('🔴 Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

export default API_BASE_URL;