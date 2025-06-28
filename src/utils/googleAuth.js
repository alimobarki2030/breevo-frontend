// 🔧 إصلاح Google Sign-In مع FedCM

// ✅ إعدادات Google Identity Services
const GOOGLE_CONFIG = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "403864871499-59f26jiafopipeplaq09bplabe594q0o.apps.googleusercontent.com", // ضع client_id الخاص بك
  // client_id: "123456789-abcdefghijklmnop.apps.googleusercontent.com", // مثال
};

// ✅ إعداد Google Identity Services مع FedCM
export function initializeGoogleSignIn() {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.client_id,
      callback: handleCredentialResponse,
      // ✅ تفعيل FedCM - مطلوب الآن
      use_fedcm_for_prompt: true,
      // ✅ إعدادات إضافية للتوافق
      auto_select: false,
      cancel_on_tap_outside: true,
      // ✅ إعدادات الخصوصية
      itp_support: true
    });

    // عرض One Tap إذا لم يكن المستخدم مسجل دخول
    if (!isUserLoggedIn()) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap not displayed:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('One Tap skipped:', notification.getSkippedReason());
        }
      });
    }
  } else {
    console.error('Google Identity Services not loaded');
  }
}

// ✅ معالج استجابة Google Sign-In
export function handleCredentialResponse(response) {
  try {
    // فك تشفير JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    
    // حفظ بيانات المستخدم بشكل آمن
    const userData = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      loginMethod: 'google',
      loginTime: new Date().toISOString()
    };
    
    // استخدام safe localStorage functions
    const { safeLocalStorageSet } = require('./localStorage');
    
    safeLocalStorageSet('user', userData);
    safeLocalStorageSet('token', response.credential);
    
    // عرض رسالة نجاح
    console.log('✅ تم تسجيل الدخول بنجاح:', userData);
    
    // إعادة توجيه أو تحديث UI
    if (window.location.pathname === '/login') {
      window.location.href = '/products';
    } else {
      window.location.reload();
    }
    
  } catch (error) {
    console.error('Error handling Google Sign-In:', error);
    alert('فشل في تسجيل الدخول. حاول مرة أخرى.');
  }
}

// ✅ إضافة HTML للـ Google Sign-In Button
export function renderGoogleSignInButton(containerId = 'google-signin-button') {
  const buttonContainer = document.getElementById(containerId);
  if (buttonContainer && window.google && window.google.accounts) {
    window.google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 250
    });
  } else {
    console.error(`Button container '${containerId}' not found or Google not loaded`);
  }
}

// ✅ تحميل Google Identity Services Script
export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    // التحقق من وجود Google Script مسبقاً
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ Google Identity Services loaded');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Google Identity Services');
      reject(new Error('Failed to load Google Script'));
    };
    
    document.head.appendChild(script);
  });
}

// ✅ تهيئة كاملة لـ Google Sign-In
export async function setupGoogleAuth() {
  try {
    // تحميل Google Script
    await loadGoogleScript();
    
    // انتظار تحميل Google APIs
    await new Promise(resolve => {
      const checkGoogle = () => {
        if (window.google && window.google.accounts) {
          resolve();
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    });
    
    // تهيئة Google Sign-In
    initializeGoogleSignIn();
    
    // عرض الزر
    renderGoogleSignInButton();
    
    console.log('✅ Google Auth setup complete');
    
  } catch (error) {
    console.error('❌ Failed to setup Google Auth:', error);
  }
}

// ✅ دالة مساعدة للتحقق من تسجيل الدخول
export function isUserLoggedIn() {
  const { safeLocalStorageGet } = require('./localStorage');
  return safeLocalStorageGet('user') !== null;
}

// ✅ الحصول على بيانات المستخدم الحالي
export function getCurrentUser() {
  const { safeLocalStorageGet } = require('./localStorage');
  return safeLocalStorageGet('user', null);
}

// ✅ تسجيل الخروج
export function signOut() {
  try {
    // إيقاف Google Auto Select
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    // مسح البيانات المحلية
    const { safeLocalStorageRemove } = require('./localStorage');
    safeLocalStorageRemove('user');
    safeLocalStorageRemove('token');
    
    console.log('✅ تم تسجيل الخروج بنجاح');
    
    // إعادة توجيه لصفحة الدخول
    window.location.href = '/login';
    
  } catch (error) {
    console.error('Error during sign out:', error);
  }
}

// ✅ التحقق من صحة Token
export function validateToken() {
  const { safeLocalStorageGet } = require('./localStorage');
  const token = safeLocalStorageGet('token');
  
  if (!token) return false;
  
  try {
    // فك تشفير JWT وفحص انتهاء الصلاحية
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    return payload.exp > now;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
}

// ✅ تهيئة تلقائية عند تحميل المكتبة
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    // تهيئة تلقائية إذا وجد container
    if (document.getElementById('google-signin-button')) {
      setupGoogleAuth();
    }
  });
}