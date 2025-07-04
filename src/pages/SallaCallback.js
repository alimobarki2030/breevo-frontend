// src/pages/SallaCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS, apiCall } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import PublicNavbar from '../components/navbars/PublicNavbar';
import Footer from '../components/Footer';

export default function SallaCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('جاري ربط متجرك مع سلة...');
  const [storeInfo, setStoreInfo] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('/products');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const error_description = urlParams.get('error_description');
    
    // التحقق من وجود خطأ من سلة
    if (error) {
      setStatus('error');
      setMessage(error_description || 'تم إلغاء العملية من سلة أو حدث خطأ في التفويض');
      toast.error(error_description || 'تم إلغاء العملية من سلة');
      return;
    }
    
    // إذا وجد الكود، ابدأ عملية الربط
    if (code && state) {
      handleSallaCallback(code, state);
    } else {
      // إذا لم يوجد كود ولا خطأ
      setStatus('error');
      setMessage('رابط غير صحيح أو معاملات مفقودة من سلة');
      toast.error('رابط غير صحيح من سلة');
    }
  }, [location.search]);

  const handleSallaCallback = async (code, state) => {
    try {
      setMessage('جاري التحقق من بيانات سلة...');
      console.log('🔄 Processing Salla callback:', { code: code.substring(0, 10) + '...', state });
      
      // التحقق من وجود المستخدم
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        setStatus('error');
        setMessage('يرجى تسجيل الدخول أولاً لربط المتجر');
        toast.error('يرجى تسجيل الدخول أولاً');
        
        // حفظ معاملات الاستعلام للعودة إليها بعد تسجيل الدخول
        localStorage.setItem('salla_callback_params', location.search);
        
        setTimeout(() => {
          navigate('/manual-login');
        }, 3000);
        return;
      }
      
      // إرسال الكود للـ backend للمعالجة
      const data = await apiCall(API_ENDPOINTS.salla.callback, {
        method: 'POST',
        body: JSON.stringify({ 
          code: code,
          state: state 
        }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (data.success) {
        setStatus('success');
        setStoreInfo(data.store);
        setMessage(`تم ربط متجر "${data.store.name}" بنجاح! 🎉`);
        
        // تحديد رابط التوجيه
        const finalRedirectUrl = data.redirect_url || `/products?connected=true&store=${encodeURIComponent(data.store.name)}`;
        setRedirectUrl(finalRedirectUrl);
        
        // عرض رسالة نجاح
        toast.success(`تم ربط متجر ${data.store.name} بنجاح!`, {
          duration: 4000,
          icon: '🎉'
        });
        
        // توجيه تلقائي بعد 3 ثوان
        setTimeout(() => {
          navigate(finalRedirectUrl);
        }, 3000);
        
        console.log('✅ Store connected successfully:', data.store);
        
      } else {
        setStatus('error');
        setMessage(data.message || 'فشل في ربط المتجر مع سلة');
        toast.error(data.message || 'فشل في ربط المتجر');
        console.error('❌ Store connection failed:', data);
      }
      
    } catch (error) {
      console.error('❌ خطأ في معالجة callback:', error);
      setStatus('error');
      
      // رسائل خطأ مفصلة حسب نوع الخطأ
      if (error.message.includes('401')) {
        setMessage('انتهت صلاحية جلسة المستخدم. يرجى تسجيل الدخول مرة أخرى.');
        toast.error('انتهت صلاحية الجلسة');
        setTimeout(() => navigate('/manual-login'), 3000);
      } else if (error.message.includes('404')) {
        setMessage('لم يتم العثور على endpoint المطلوب. تحقق من إعدادات النظام.');
        toast.error('خطأ في النظام');
      } else if (error.message.includes('500')) {
        setMessage('خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.');
        toast.error('خطأ في الخادم');
      } else {
        setMessage(error.message || 'خطأ في الاتصال بالخادم');
        toast.error(error.message || 'خطأ في الاتصال');
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'success': return 'from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20';
      case 'error': return 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20';
      default: return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
    }
  };

  const getHeaderBackground = () => {
    switch (status) {
      case 'success': return 'bg-gradient-to-r from-green-500 to-blue-500';
      case 'error': return 'bg-gradient-to-r from-red-500 to-orange-500';
      default: return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PublicNavbar />
      
      <div className={`flex-grow bg-gradient-to-br ${getBackgroundColor()} flex items-center justify-center p-4 pt-24`}>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className={`px-8 py-6 text-white text-center ${getHeaderBackground()}`}>
            <div className="text-4xl mb-2">
              {status === 'processing' ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              ) : (
                getStatusIcon()
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {status === 'processing' && 'جاري المعالجة...'}
              {status === 'success' && 'تم بنجاح!'}
              {status === 'error' && 'حدث خطأ'}
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            
            {/* Status Message */}
            <div className="text-center mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{message}</p>
            </div>

            {/* Store Info (Success) */}
            {status === 'success' && storeInfo && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                <h3 className="text-green-800 dark:text-green-400 font-semibold mb-2">معلومات المتجر المربوط:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-500">الاسم:</span>
                    <span className="text-green-800 dark:text-green-400 font-medium">{storeInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-500">النطاق:</span>
                    <span className="text-green-800 dark:text-green-400">{storeInfo.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-500">الخطة:</span>
                    <span className="text-green-800 dark:text-green-400">{storeInfo.plan}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Indicator (Processing) */}
            {status === 'processing' && (
              <div className="mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="animate-pulse h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-800 dark:text-blue-400 text-sm">نقوم الآن بربط متجر سلة بحسابك وجلب بيانات المنتجات...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'success' && (
                <>
                  <button
                    onClick={() => navigate(redirectUrl)}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    🚀 الذهاب للمنتجات
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">سيتم التوجيه تلقائياً خلال ثوان...</p>
                  </div>
                </>
              )}
              
              {status === 'error' && (
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    🔄 المحاولة مرة أخرى
                  </button>
                  
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    🔗 ربط متجر جديد
                  </button>
                  
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium"
                  >
                    🏠 العودة للمنتجات
                  </button>
                </div>
              )}

              {status === 'processing' && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">يرجى عدم إغلاق هذه الصفحة...</p>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">تواجه مشكلة؟</p>
                <div className="flex justify-center space-x-4 space-x-reverse">
                  <button 
                    onClick={() => navigate('/help')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    مركز المساعدة
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    تواصل معنا
                  </button>
                </div>
              </div>
            </div>

            {/* Debug Info (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Status: {status}</p>
                <p>Search: {location.search}</p>
                {storeInfo && <p>Store: {JSON.stringify(storeInfo)}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}