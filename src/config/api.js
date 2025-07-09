// config/api.js - API Configuration محدث للعمل مع Render
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
    verify: `${API_BASE_URL}/auth/verify`, // أضفنا هذا السطر
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
  
  // النقاط
  points: {
    balance: `${API_BASE_URL}/api/points/balance`,
    packages: `${API_BASE_URL}/api/points/packages`,
    purchase: `${API_BASE_URL}/api/points/packages/purchase`,
    transactions: `${API_BASE_URL}/api/points/transactions`,
    services: `${API_BASE_URL}/api/points/services`,
    useService: `${API_BASE_URL}/api/points/services/use`,
  },
  
  // الاشتراكات
  subscription: {
    current: `${API_BASE_URL}/api/subscription/current`,
    plans: `${API_BASE_URL}/api/subscription/plans`,
    subscribe: `${API_BASE_URL}/api/subscription/subscribe`,
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

  // Add auth token if available - هام جداً
  const token = localStorage.getItem('token');
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
        localStorage.removeItem('user');
        localStorage.removeItem('clientName');
        // يمكن إضافة redirect للتسجيل هنا
        window.location.href = '/login';
      }
      
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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
    return await apiCall(API_ENDPOINTS.salla.stores);
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
    const response = await apiCall(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // حفظ التوكن
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  async register(userData) {
    const response = await apiCall(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    // حفظ التوكن
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  async getCurrentUser() {
    return await apiCall(API_ENDPOINTS.auth.me);
  },
  
  async verifyToken() {
    return await apiCall(API_ENDPOINTS.auth.verify);
  },
  
  async logout() {
    const result = await apiCall(API_ENDPOINTS.auth.logout, { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('clientName');
    return result;
  }
};

// دوال مساعدة للنقاط
export const pointsAPI = {
  async getBalance() {
    return await apiCall(API_ENDPOINTS.points.balance);
  },
  
  async getPackages() {
    return await apiCall(API_ENDPOINTS.points.packages);
  },
  
  async purchasePackage(packageId, paymentData) {
    return await apiCall(API_ENDPOINTS.points.purchase, {
      method: 'POST',
      body: JSON.stringify({
        package_id: packageId,
        ...paymentData
      })
    });
  },
  
  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`${API_ENDPOINTS.points.transactions}?${queryString}`);
  },
  
  async getServices() {
    return await apiCall(API_ENDPOINTS.points.services);
  },
  
  async useService(serviceType, options = {}) {
    return await apiCall(API_ENDPOINTS.points.useService, {
      method: 'POST',
      body: JSON.stringify({
        service_type: serviceType,
        ...options
      })
    });
  }
};

// دوال مساعدة للاشتراكات
export const subscriptionAPI = {
  async getCurrentSubscription() {
    return await apiCall(API_ENDPOINTS.subscription.current);
  },
  
  async getPlans() {
    return await apiCall(API_ENDPOINTS.subscription.plans);
  },
  
  async subscribe(planId, paymentData) {
    return await apiCall(API_ENDPOINTS.subscription.subscribe, {
      method: 'POST',
      body: JSON.stringify({
        plan_id: planId,
        ...paymentData
      })
    });
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