// src/pages/PaymentResult.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, RotateCcw, Home } from 'lucide-react';

export default function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const paymentId = urlParams.get('id');
        const status = urlParams.get('status');
        const message = urlParams.get('message');

        console.log('💳 Payment Result - URL Params:', { paymentId, status, message });

        // إذا كان هناك payment_id من localStorage
        const pendingPayment = localStorage.getItem('pending_payment');
        let orderData = null;
        
        if (pendingPayment) {
          try {
            orderData = JSON.parse(pendingPayment);
            console.log('📦 Order Data from localStorage:', orderData);
          } catch (e) {
            console.warn('⚠️ Could not parse pending payment data');
          }
        }

        if (status === 'paid' || status === 'success') {
          // ✅ الدفع نجح
          setPaymentStatus('success');
          setPaymentData({
            id: paymentId,
            status: 'success',
            amount: orderData?.order_data?.amount || 0,
            planName: orderData?.order_data?.planName || 'خطة مدفوعة',
            billingCycle: orderData?.order_data?.billingCycle || 'شهري',
            paymentMethod: orderData?.order_data?.paymentMethod || 'بطاقة',
            createdAt: new Date().toISOString()
          });

          // تحديث بيانات المستخدم
          if (orderData?.order_data) {
            const subscriptionData = {
              plan: orderData.order_data.planId,
              billingCycle: orderData.order_data.billingCycle,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + (orderData.order_data.billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
              amount: orderData.order_data.amount,
              paymentMethod: orderData.order_data.paymentMethod,
              status: 'active',
              moyasarPaymentId: paymentId
            };

            localStorage.setItem('subscription', JSON.stringify(subscriptionData));

            // تحديث بيانات المستخدم
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.plan = orderData.order_data.planId;
            user.subscriptionStatus = 'active';
            user.paymentStatus = 'paid';
            localStorage.setItem('user', JSON.stringify(user));
          }

          // مسح pending payment
          localStorage.removeItem('pending_payment');

          toast.success('🎉 تم الدفع بنجاح! مرحباً بك في SEO Rayca');

          // بدء العد التنازلي للتوجيه
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/products');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

        } else if (status === 'failed' || status === 'error') {
          // ❌ الدفع فشل
          setPaymentStatus('failed');
          setPaymentData({
            id: paymentId,
            status: 'failed',
            message: message || 'فشل في الدفع',
            error: urlParams.get('error') || 'خطأ غير محدد'
          });

          toast.error('❌ فشل في الدفع. يرجى المحاولة مرة أخرى.');

        } else {
          // ⏳ في الانتظار أو حالة غير معروفة
          setPaymentStatus('pending');
          setPaymentData({
            id: paymentId,
            status: status || 'unknown',
            message: message || 'جاري التحقق من حالة الدفع...'
          });

          // التحقق مرة أخرى بعد بضع ثوان
          setTimeout(() => {
            checkPaymentStatus();
          }, 3000);
        }

      } catch (error) {
        console.error('❌ Error checking payment status:', error);
        setPaymentStatus('error');
        toast.error('حدث خطأ أثناء التحقق من حالة الدفع');
      }};

    checkPaymentStatus();
  }, [location.search, navigate]);

  const handleRetryPayment = () => {
    // العودة لصفحة الدفع
    const pendingPayment = localStorage.getItem('pending_payment');
    if (pendingPayment) {
      try {
        const orderData = JSON.parse(pendingPayment);
        const planId = orderData?.order_data?.planId;
        const billingCycle = orderData?.order_data?.billingCycle;
        
        if (planId) {
          navigate(`/checkout?plan=${planId}&billing=${billingCycle}&retry=true`);
          return;
        }
      } catch (e) {
        console.warn('Could not parse retry data');
      }
    }
    
    // العودة للأسعار إذا لم توجد بيانات
    navigate('/pricing');
  };

  const handleGoToProducts = () => {
    navigate('/products');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#83dcc9] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">جاري التحقق من حالة الدفع...</h2>
          <p className="text-gray-400">يرجى الانتظار، لا تقم بإغلاق هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* نجح الدفع */}
        {paymentStatus === 'success' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">تم الدفع بنجاح! 🎉</h1>
              <p className="text-green-100">تم تفعيل اشتراكك بنجاح</p>
            </div>
            
            <div className="p-6 space-y-4">
              {paymentData && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الخطة:</span>
                    <span className="font-medium">{paymentData.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ:</span>
                    <span className="font-medium">{paymentData.amount} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">دورة الفوترة:</span>
                    <span className="font-medium">{paymentData.billingCycle === 'yearly' ? 'سنوي' : 'شهري'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم العملية:</span>
                    <span className="font-mono text-xs">{paymentData.id}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  🚀 سيتم توجيهك لمنتجاتك خلال <strong>{countdown}</strong> ثانية
                </p>
              </div>
              
              <button
                onClick={handleGoToProducts}
                className="w-full bg-[#83dcc9] text-gray-900 py-3 rounded-lg font-bold hover:bg-[#6cc9b9] transition-all flex items-center justify-center gap-2"
              >
                <span>ابدأ استخدام منتجاتك</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* فشل الدفع */}
        {paymentStatus === 'failed' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 text-white">
              <XCircle className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">فشل في الدفع</h1>
              <p className="text-red-100">لم تتم عملية الدفع بنجاح</p>
            </div>
            
            <div className="p-6 space-y-4">
              {paymentData?.message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{paymentData.message}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>الأسباب المحتملة:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>رصيد غير كافي في البطاقة</li>
                  <li>بيانات البطاقة غير صحيحة</li>
                  <li>البطاقة منتهية الصلاحية</li>
                  <li>تم رفض العملية من البنك</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRetryPayment}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>الرئيسية</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* في الانتظار */}
        {paymentStatus === 'pending' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-8 text-white">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">جاري معالجة الدفع</h1>
              <p className="text-yellow-100">يرجى الانتظار قليلاً</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  {paymentData?.message || 'جاري التحقق من عملية الدفع...'}
                </p>
              </div>
              
              <div className="animate-pulse flex justify-center">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                ستتم إعادة التحقق تلقائياً خلال بضع ثوان
              </p>
            </div>
          </div>
        )}

        {/* خطأ في النظام */}
        {paymentStatus === 'error' && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
            <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-8 text-white">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">خطأ في النظام</h1>
              <p className="text-gray-100">حدث خطأ غير متوقع</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 text-sm">
                  نعتذر، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRetryPayment}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  إعادة المحاولة
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}