// src/pages/ConnectStore.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { sallaAPI, testConnection } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import PublicNavbar from '../components/navbars/PublicNavbar';
import Footer from '../components/Footer';


const ConnectStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  
  // استخراج token من URL
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');
  
  // States
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    // اختبار الاتصال بالـ Backend
    checkBackendConnection();
    
    if (token) {
      fetchStoreInfo();
    } else {
      setError('رابط غير صحيح - لا يوجد رمز تحقق');
      setLoading(false);
    }
    
    checkLoginStatus();
  }, [token]);

  const checkBackendConnection = async () => {
    try {
      const result = await testConnection();
      setConnectionStatus(result);
      
      if (!result.success) {
        console.error('🔴 Backend connection failed:', result.error);
      }
    } catch (error) {
      console.error('🔴 Connection test failed:', error);
      setConnectionStatus({ success: false, error: error.message });
    }
  };

  const fetchStoreInfo = async () => {
    try {
      setLoading(true);
      console.log('🔍 Verifying store token:', token);
      
      const data = await sallaAPI.verifyPendingStore(token);
      
      if (data.success) {
        setStoreInfo(data.store);
        console.log('✅ Store info loaded:', data.store);
      } else {
        setError(data.message || 'رابط غير صحيح أو منتهي الصلاحية');
      }
    } catch (err) {
      console.error('❌ خطأ في التحقق:', err);
      setError(err.message || 'خطأ في التحقق من الرابط');
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));
    console.log('🔐 Login status:', !!(token && user));
  };

  const handleConnectStore = async () => {
    if (!isLoggedIn) {
      // حفظ الرمز للاستخدام بعد تسجيل الدخول
      localStorage.setItem('pending_store_token', token);
      toast.info('يرجى تسجيل الدخول أولاً لربط المتجر');
      navigate(`/manual-login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    try {
      setLoading(true);
      console.log('🔗 Connecting store with token:', token);
      
      const data = await sallaAPI.connectPendingStore(token);
      
      if (data.success) {
        // إظهار رسالة نجاح
        toast.success(`تم ربط متجر ${data.store.name} بنجاح! 🎉`);
        
        // توجيه لصفحة المنتجات أو dashboard
        setTimeout(() => {
          navigate(`/products?connected=true&store=${encodeURIComponent(data.store.name)}`);
        }, 2000);
      } else {
        setError(data.message || 'فشل في ربط المتجر');
        toast.error(data.message || 'فشل في ربط المتجر');
      }
    } catch (err) {
      console.error('❌ خطأ في الربط:', err);
      setError(err.message || 'خطأ في ربط المتجر');
      toast.error(err.message || 'خطأ في ربط المتجر');
    } finally {
      setLoading(false);
    }
  };

  const handleGetNewAuthorization = async () => {
    try {
      if (!isLoggedIn) {
        toast.error('يرجى تسجيل الدخول أولاً');
        navigate('/manual-login');
        return;
      }

      console.log('🔄 Getting new authorization URL...');
      const data = await sallaAPI.getAuthorizationUrl();
      
      if (data.success && data.authorization_url) {
        // توجيه لسلة للموافقة
        window.location.href = data.authorization_url;
      } else {
        setError('فشل في إنشاء رابط التفويض');
        toast.error('فشل في إنشاء رابط التفويض');
      }
    } catch (err) {
      console.error('❌ خطأ في التفويض:', err);
      setError('خطأ في الحصول على رابط التفويض');
      toast.error('خطأ في الحصول على رابط التفويض');
    }
  };

  // مكونات المساعدة
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">جاري التحقق من الرابط...</p>
        {connectionStatus && !connectionStatus.success && (
          <p className="text-red-500 text-sm mt-2">
            تحقق من اتصال الإنترنت أو حالة الخادم
          </p>
        )}
      </div>
    </div>
  );

  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">عذراً، حدث خطأ</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                🔄 المحاولة مرة أخرى
              </button>
            )}
            
            <button
              onClick={handleGetNewAuthorization}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              🔗 ربط متجر جديد من سلة
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              🏠 العودة للمنتجات
            </button>
          </div>

          {/* معلومات تشخيصية للمطورين */}
          {connectionStatus && !connectionStatus.success && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
              <p className="text-sm text-red-800 dark:text-red-400 font-medium">Backend Connection Error:</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">{connectionStatus.error}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

  // عرض الحالات المختلفة
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => fetchStoreInfo()} />;
  }

  if (!storeInfo) {
    return <ErrorDisplay error="لم يتم العثور على معلومات المتجر" />;
  }

  // الصفحة الرئيسية
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      
      <div className="flex-grow flex items-center justify-center p-4 pt-24">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6 text-white text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h1 className="text-2xl font-bold">مرحباً بك في تحسين السيو</h1>
            <p className="text-green-100 mt-2">نظام متكامل لتحسين متجرك</p>
          </div>

          {/* Store Info */}
          <div className="p-8">
            <div className="bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6 border border-green-100 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl ml-2">🏪</span>
                معلومات متجرك
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">اسم المتجر:</span>
                  <span className="font-medium text-green-800 dark:text-green-400">{storeInfo.store_name}</span>
                </div>
                
                {storeInfo.store_domain && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">الرابط:</span>
                    <a 
                      href={`https://${storeInfo.store_domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      {storeInfo.store_domain}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">عدد المنتجات:</span>
                  <span className="font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                    {storeInfo.products_count || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">معرف المتجر:</span>
                  <span className="font-mono text-sm text-gray-500 dark:text-gray-400">#{storeInfo.store_id}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl ml-2">🎁</span>
                ما ستحصل عليه:
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <span className="text-green-500 text-xl ml-3">✅</span>
                  <span className="text-green-800 dark:text-green-400">تحليل تلقائي لجميع منتجاتك</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <span className="text-green-500 text-xl ml-3">✅</span>
                  <span className="text-green-800 dark:text-green-400">تحسين السيو بالذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <span className="text-green-500 text-xl ml-3">✅</span>
                  <span className="text-green-800 dark:text-green-400">زيادة الظهور في نتائج البحث</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <span className="text-green-500 text-xl ml-3">✅</span>
                  <span className="text-green-800 dark:text-green-400">تقارير شاملة عن أداء المتجر</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isLoggedIn ? (
                <button
                  onClick={handleConnectStore}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الربط...
                    </span>
                  ) : (
                    '🚀 ربط المتجر بحسابي'
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/manual-login?redirect=${encodeURIComponent(location.pathname + location.search)}`)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition duration-300 text-center shadow-lg"
                  >
                    🔑 تسجيل الدخول لربط المتجر
                  </button>
                  
                  <button
                    onClick={() => navigate(`/manual-login?redirect=${encodeURIComponent(location.pathname + location.search)}`)}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 font-bold py-4 px-6 rounded-xl hover:bg-green-50 dark:hover:bg-gray-600 transition duration-300 text-center"
                  >
                    📝 إنشاء حساب جديد
                  </button>
                </div>
              )}
            </div>

            {/* Expiry Notice */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl ml-2">⏰</span>
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                    هذا الرابط صالح لمدة {storeInfo.days_remaining || 0} أيام فقط
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    بعدها ستحتاج لإعادة تثبيت التطبيق من متجر سلة
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                مدعوم من 
                <span className="font-semibold text-green-600 dark:text-green-400 mx-1">Breevo Backend</span>
                • نظام آمن ومعتمد
              </p>
              
              {/* Connection Status */}
              {connectionStatus && (
                <div className="mt-2 text-xs">
                  {connectionStatus.success ? (
                    <span className="text-green-600 dark:text-green-400">🟢 الاتصال بالخادم سليم</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">🔴 مشكلة في الاتصال بالخادم</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConnectStore;