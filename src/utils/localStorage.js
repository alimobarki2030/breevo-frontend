// 🔧 إصلاح عمليات LocalStorage مع Error Handling

// ✅ دالة آمنة لحفظ البيانات
export function safeLocalStorageSet(key, value) {
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    // عرض رسالة للمستخدم
    if (error.name === 'QuotaExceededError') {
      alert('تم امتلاء مساحة التخزين. يرجى مسح بيانات المتصفح.');
    }
    return false;
  }
}

// ✅ دالة آمنة لاسترجاع البيانات
export function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // محاولة تحليل JSON
    try {
      return JSON.parse(item);
    } catch {
      // إذا لم يكن JSON، أرجع النص كما هو
      return item;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

// ✅ دالة آمنة لحذف البيانات
export function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

// ✅ تنظيف LocalStorage من البيانات الفاسدة
export function cleanupLocalStorage() {
  try {
    const keysToCheck = ['saved_products', 'user', 'subscription', 'seo_generate_options', 'seo_trial_usage'];
    
    keysToCheck.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          // محاولة تحليل JSON للتأكد من صحته
          JSON.parse(item);
        }
      } catch (error) {
        console.warn(`Removing corrupted localStorage item: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ LocalStorage cleanup completed');
  } catch (error) {
    console.error('Error during localStorage cleanup:', error);
  }
}

// ✅ دوال محددة للمنتجات
export const ProductStorage = {
  // حفظ منتج واحد
  saveProduct: function(product) {
    const products = this.getAllProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex !== -1) {
      products[existingIndex] = { ...product, lastUpdated: new Date().toISOString() };
    } else {
      products.push({ ...product, lastUpdated: new Date().toISOString() });
    }
    
    return safeLocalStorageSet('saved_products', products);
  },
  
  // استرجاع جميع المنتجات
  getAllProducts: function() {
    return safeLocalStorageGet('saved_products', []);
  },
  
  // استرجاع منتج واحد
  getProduct: function(id) {
    const products = this.getAllProducts();
    return products.find(p => p.id == id) || null;
  },
  
  // حذف منتج
  deleteProduct: function(id) {
    const products = this.getAllProducts();
    const filteredProducts = products.filter(p => p.id != id);
    return safeLocalStorageSet('saved_products', filteredProducts);
  },
  
  // تصدير البيانات
  exportData: function() {
    return {
      products: this.getAllProducts(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  },
  
  // استيراد البيانات
  importData: function(data) {
    if (data && Array.isArray(data.products)) {
      return safeLocalStorageSet('saved_products', data.products);
    }
    return false;
  }
};

// ✅ تهيئة وتنظيف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // تنظيف البيانات الفاسدة
  cleanupLocalStorage();
  
  // التأكد من وجود البيانات الأساسية
  if (!safeLocalStorageGet('saved_products')) {
    safeLocalStorageSet('saved_products', []);
  }
  
  if (!safeLocalStorageGet('seo_generate_options')) {
    safeLocalStorageSet('seo_generate_options', {
      productNameAction: "keep",
      keywordAction: "generate",
      customKeyword: "",
      audience: "العملاء العرب",
      tone: "احترافية"
    });
  }
});