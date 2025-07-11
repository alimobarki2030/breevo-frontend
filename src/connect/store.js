// pages/connect-store.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_ENDPOINTS, apiCall } from '../utils/api';

const ConnectStorePage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      fetchStoreInfo();
      checkLoginStatus();
    }
  }, [token]);

  const fetchStoreInfo = async () => {
    try {
      // استدعاء Render Backend API
      const response = await fetch(`${API_ENDPOINTS.verifyPendingStore}?token=${token}`);
      const data = await response.json();
      
      if (data.success) {
        setStoreInfo(data.store);
      } else {
        setError(data.message || 'رابط غير صحيح أو منتهي الصلاحية');
      }
    } catch (err) {
      console.error('خطأ في التحقق:', err);
      setError('خطأ في التحقق من الرابط');
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleConnectStore = async () => {
    if (!isLoggedIn) {
      localStorage.setItem('pending_store_token', token);
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      
      // استدعاء Render Backend API
      const data = await apiCall(API_ENDPOINTS.connectPendingStore, {
        method: 'POST',
        body: JSON.stringify({ verification_token: token })
      });
      
      if (data.success) {
        // إظهار رسالة نجاح
        alert('تم ربط المتجر بنجاح! 🎉');
        router.push('/dashboard?connected=true&store=' + data.store?.name);
      } else {
        setError(data.message || 'فشل في ربط المتجر');
      }
    } catch (err) {
      console.error('خطأ في الربط:', err);
      setError('خطأ في ربط المتجر');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAuthorization = async () => {
    try {
      // جلب رابط التفويض من Render Backend
      const data = await apiCall(API_ENDPOINTS.sallaAuthorize);
      
      if (data.authorization_url) {
        // توجيه لسلة للموافقة
        window.location.href = data.authorization_url;
      } else {
        setError('فشل في إنشاء رابط التفويض');
      }
    } catch (err) {
      console.error('خطأ في التفويض:', err);
      setError('خطأ في الحصول على رابط التفويض');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الرابط...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">عذراً، حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link href="/" className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              العودة للرئيسية
            </Link>
            <button
              onClick={handleGetAuthorization}
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              ربط متجر جديد من سلة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h1 className="text-2xl font-bold">مرحباً بك في تحسين السيو</h1>
          <p className="text-blue-100 mt-2">مدعوم من Breevo</p>
        </div>

        {/* Store Info */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات المتجر</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">اسم المتجر:</span>
                <span className="font-medium">{storeInfo?.store_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">الرابط:</span>
                <a 
                  href={`https://${storeInfo?.store_domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {storeInfo?.store_domain}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">عدد المنتجات:</span>
                <span className="font-medium">{storeInfo?.products_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isLoggedIn ? (
              <button
                onClick={handleConnectStore}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? 'جاري الربط...' : '🚀 ربط المتجر بحسابي'}
              </button>
            ) : (
              <>
                <Link 
                  href={`/auth/login?redirect=/connect-store?token=${token}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 text-center block"
                >
                  🔑 تسجيل الدخول
                </Link>
                <Link 
                  href={`/auth/register?redirect=/connect-store?token=${token}`}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition duration-300 text-center block"
                >
                  📝 إنشاء حساب جديد
                </Link>
              </>
            )}
          </div>

          {/* Expiry Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 ml-2">⏰</span>
              <p className="text-sm text-yellow-800">
                هذا الرابط صالح لمدة {storeInfo?.days_remaining || 0} أيام فقط
              </p>
            </div>
          </div>

          {/* Backend Info */}
          <div className="mt-4 text-center text-xs text-gray-500">
            مدعوم من Breevo Backend
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectStorePage;