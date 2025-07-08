import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, Check, CreditCard, Shield, Clock, Percent, Tag, Gift } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

// ========== إعدادات Moyasar ==========
const MOYASAR_CONFIG = {
  publishableKey: process.env.REACT_APP_MOYASAR_PUBLISHABLE_KEY,
  version: '1.14.0'
};

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// ========== دالة تحميل Moyasar ==========
const loadMoyasar = () => {
  return new Promise((resolve, reject) => {
    if (window.Moyasar) {
      resolve();
      return;
    }

    console.log('🔄 Loading Moyasar...');

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = `https://cdn.moyasar.com/mpf/${MOYASAR_CONFIG.version}/moyasar.css`;
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = `https://cdn.moyasar.com/mpf/${MOYASAR_CONFIG.version}/moyasar.js`;
    script.onload = () => {
      setTimeout(() => {
        if (window.Moyasar) {
          console.log('✅ Moyasar loaded successfully');
          resolve();
        } else {
          reject(new Error('Moyasar not available after loading'));
        }
      }, 500);
    };
    script.onerror = () => reject(new Error('Failed to load Moyasar script'));
    document.head.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [moyasarLoaded, setMoyasarLoaded] = useState(false);
  const [moyasarInitialized, setMoyasarInitialized] = useState(false);

  // البيانات من API
  const [planDetails, setPlanDetails] = useState({});
  const [promoCodes, setPromoCodes] = useState({});

  // بيانات الفوترة
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: ''
  });

  // جلب بيانات الخطط من API
  const fetchPlanDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/plans`);
      if (!response.ok) throw new Error('Failed to fetch plans');
      
      const data = await response.json();
      setPlanDetails(data.plans || {});
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('خطأ في تحميل بيانات الخطط');
      
      // Fallback للبيانات الافتراضية
      setPlanDetails({
        free: {
          name: "المجانية",
          price: 0,
          originalPrice: 0,
          icon: "🆓",
          color: "from-green-500 to-blue-600",
          features: [
            "3 منتجات شهرياً",
            "جميع مميزات المنصة",
            "توليد تلقائي بالذكاء الاصطناعي",
            "تحليل SEO فوري",
            "معاينة Google محسنة",
            "دعم عبر البريد الإلكتروني"
          ]
        },
        pro: {
          name: "الاحترافية",
          price: 99,
          originalPrice: 129,
          icon: "💎",
          color: "from-blue-500 to-purple-600",
          features: [
            "30 منتج شهرياً",
            "مؤشرات سيو متقدمة", 
            "توليد تلقائي بالذكاء الاصطناعي",
            "دعم فني مخصص",
            "تحليلات مفصلة",
            "معاينة Google محسنة"
          ]
        },
        business: {
          name: "الأعمال", 
          price: 299,
          originalPrice: 399,
          icon: "👑",
          color: "from-yellow-500 to-orange-600",
          features: [
            "منتجات غير محدودة",
            "تحليل شامل متقدم", 
            "دعم خاص ومتابعة مخصصة",
            "تقارير مفصلة",
            "أولوية في الميزات الجديدة",
            "API مخصص للتكامل",
            "استشارة SEO شخصية"
          ]
        }
      });
    }
  };

  // التحقق من صحة كود الخصم
  const validatePromoCode = async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          code: code.toUpperCase(),
          planId: selectedPlan,
          billingCycle
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'كود خصم غير صالح');
      }

      const data = await response.json();
      return { success: true, promoData: data.promoCode };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      setDataLoading(true);
      
      // جلب البيانات من API
      await fetchPlanDetails();
      
      const urlParams = new URLSearchParams(location.search);
      const planParam = urlParams.get('plan');
      const promoParam = urlParams.get('promo');
      const billingParam = urlParams.get('billing');
      
      if (billingParam === 'annual' || billingParam === 'yearly') {
        setBillingCycle('yearly');
      }
      
      if (planParam && Object.keys(planDetails).includes(planParam)) {
        setSelectedPlan(planParam);
      } else {
        navigate('/pricing');
        return;
      }

      // تطبيق كود الخصم من URL
      if (promoParam) {
        setPromoCode(promoParam);
        setTimeout(() => applyPromoCode(promoParam), 1000);
      }

      // تحميل بيانات المستخدم
      if (isAuthenticated && user) {
        setBillingInfo(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || ''
        }));
      }

      // تحميل Moyasar للخطط المدفوعة فقط
      if (planParam !== 'free') {
        if (!MOYASAR_CONFIG.publishableKey) {
          console.error('❌ Moyasar publishable key is missing');
          toast.error('خطأ في إعدادات الدفع - يرجى التحقق من الإعدادات');
          return;
        }

        try {
          await loadMoyasar();
          setMoyasarLoaded(true);
          console.log('✅ Moyasar ready for payments');
        } catch (error) {
          console.error('❌ Moyasar loading failed:', error);
          toast.error('فشل في تحميل نظام الدفع: ' + error.message);
        }
      }
      
      setDataLoading(false);
    };

    initializePage();
  }, [location.search, navigate, isAuthenticated, user]);

  // تطبيق كود الخصم
  const applyPromoCode = async (codeToApply = null) => {
    const code = codeToApply || promoCode;
    if (!code.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    setLoading(true);
    const result = await validatePromoCode(code);
    
    if (result.success) {
      setAppliedPromo(result.promoData);
      toast.success('تم تطبيق كود الخصم بنجاح! 🎉');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  // حساب الخصم
  const calculateDiscount = () => {
    if (!appliedPromo || selectedPlan === 'free') return 0;

    const plan = planDetails[selectedPlan];
    if (!plan) return 0;
    
    let basePrice = plan.price;
    
    if (billingCycle === 'yearly') {
      basePrice = basePrice * 12 * 0.8;
    }

    if (appliedPromo.discountType === 'percentage') {
      return Math.round(basePrice * appliedPromo.discountValue / 100);
    } else {
      return Math.min(appliedPromo.discountValue, basePrice);
    }
  };

  // حساب المجموع
  const calculateTotal = () => {
    if (!selectedPlan || !planDetails[selectedPlan]) return 0;
    
    const plan = planDetails[selectedPlan];
    let price = plan.price;
    
    if (billingCycle === 'yearly') {
      price = price * 12 * 0.8;
    }
    
    const discountAmount = calculateDiscount();
    price = Math.max(0, price - discountAmount);
    
    return price;
  };

  // معالجة الاشتراك المجاني
  const handleFreeSubscription = async () => {
    setLoading(true);
    
    try {
      if (!billingInfo.email) {
        toast.error('يرجى إدخال البريد الإلكتروني');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/subscriptions/free`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: 'free',
          billingCycle: 'monthly',
          billingInfo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تفعيل الحساب');
      }

      const data = await response.json();

      // حفظ بيانات الاشتراك محلياً
      localStorage.setItem('subscription', JSON.stringify(data.subscription));

      toast.success('🎉 تم تفعيل حسابك المجاني بنجاح!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Free subscription error:', error);
      toast.error(error.message || 'حدث خطأ أثناء تفعيل الحساب');
    } finally {
      setLoading(false);
    }
  };

  // تهيئة Moyasar
  const handleContinueToPayment = async () => {
    const isFree = selectedPlan === 'free';
    
    if (isFree) {
      handleFreeSubscription();
      return;
    }

    // التحقق من البيانات المطلوبة
    const requiredFields = ['fullName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !billingInfo[field]);
    
    if (missingFields.length > 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!moyasarLoaded) {
      toast.error('نظام الدفع غير محمل بعد، يرجى الانتظار');
      return;
    }

    await initializeMoyasarPayment();
  };

  // تهيئة دفع Moyasar
  const initializeMoyasarPayment = async () => {
    setLoading(true);
    
    try {
      const total = calculateTotal();
      const totalWithVat = Math.round(total * 1.15);
      const amountInHalala = totalWithVat * 100;
      const plan = planDetails[selectedPlan];

      // إنشاء طلب دفع في الخادم
      const response = await fetch(`${API_BASE_URL}/api/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: selectedPlan,
          billingCycle,
          amount: totalWithVat,
          billingInfo,
          promoCode: appliedPromo?.code
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إنشاء طلب الدفع');
      }

      const paymentData = await response.json();
      
      // حفظ معرف الطلب
      localStorage.setItem('pending_payment_id', paymentData.paymentId);
      
      setMoyasarInitialized(true);
      
      toast.loading('جاري تحضير نموذج الدفع...', { id: 'moyasar-init' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const formElement = document.querySelector('.mysr-form');
      if (!formElement) {
        throw new Error('Payment form element not found in DOM');
      }

      formElement.innerHTML = '';

      // تهيئة Moyasar
      const moyasarInstance = window.Moyasar.init({
        element: '.mysr-form',
        amount: amountInHalala,
        currency: 'SAR',
        description: `اشتراك ${plan.name} - ${billingCycle === 'yearly' ? 'سنوي' : 'شهري'}`,
        publishable_api_key: MOYASAR_CONFIG.publishableKey,
        callback_url: `${window.location.origin}/payment/result`,
        methods: ['creditcard'],
        language: 'ar',
        
        metadata: {
          payment_id: paymentData.paymentId,
          user_id: user?.id,
          plan: selectedPlan,
          billing_cycle: billingCycle
        },

        on_completed: function(payment) {
          console.log('✅ Payment completed:', payment);
          
          // إشعار الخادم بنجاح الدفع
          fetch(`${API_BASE_URL}/api/payments/${paymentData.paymentId}/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              moyasarPaymentId: payment.id,
              status: 'completed'
            })
          });

          toast.success('🎉 تم الدفع بنجاح!', { id: 'moyasar-init' });
          
          setTimeout(() => {
            window.location.href = `/payment/result?status=success&id=${payment.id}`;
          }, 1000);
          
          return true;
        },

        on_error: function(error) {
          console.error('❌ Payment failed:', error);
          
          // إشعار الخادم بفشل الدفع
          if (paymentData.paymentId) {
            fetch(`${API_BASE_URL}/api/payments/${paymentData.paymentId}/confirm`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                status: 'failed',
                error: error.message
              })
            });
          }
          
          toast.error('فشل في الدفع: ' + (error.message || 'خطأ غير معروف'), { id: 'moyasar-init' });
          
          setTimeout(() => {
            window.location.href = `/payment/result?status=failed&message=${encodeURIComponent(error.message || 'فشل في الدفع')}`;
          }, 2000);
          
          return false;
        },

        on_initiating: function() {
          console.log('🔄 Payment initiating...');
          toast.loading('جاري معالجة الدفع...', { id: 'payment-process' });
          return true;
        }
      });

      console.log('✅ Moyasar initialized:', moyasarInstance);
      toast.success('تم تحضير نموذج الدفع! املأ بيانات البطاقة للمتابعة', { id: 'moyasar-init' });

    } catch (error) {
      console.error('❌ Moyasar initialization error:', error);
      toast.error('حدث خطأ أثناء تحضير نموذج الدفع: ' + error.message, { id: 'moyasar-init' });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4BB8A9] mx-auto mb-4"></div>
          <p>جاري تحميل بيانات الخطط...</p>
        </div>
      </div>
    );
  }

  // التحقق من وجود الخطة
  if (!selectedPlan || !planDetails[selectedPlan]) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-red-400 mb-4">❌</div>
          <p>خطة غير موجودة</p>
          <Link to="/pricing" className="text-[#4BB8A9] underline mt-2 block">
            العودة للأسعار
          </Link>
        </div>
      </div>
    );
  }

  const plan = planDetails[selectedPlan];
  const total = calculateTotal();
  const discountAmount = calculateDiscount();
  const savings = billingCycle === 'yearly' ? plan.price * 12 * 0.2 : 0;
  const isFree = selectedPlan === 'free';

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <div className="text-2xl font-bold text-[#4BB8A9]">SEO Rayca</div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isFree ? 'تفعيل الحساب المجاني' : 'إتمام عملية الشراء'}
          </h1>
          <p className="text-gray-400">
            {isFree 
              ? 'خطوة واحدة للوصول لمميزات SEO مجاناً'
              : 'دفع آمن ومحمي بواسطة Moyasar'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* نموذج البيانات */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* معلومات الفوترة */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#4BB8A9]" />
                {isFree ? 'معلومات الحساب' : 'معلومات الفوترة'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder={isFree ? "الاسم (اختياري)" : "الاسم الكامل *"}
                  value={billingInfo.fullName}
                  onChange={(e) => setBillingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4BB8A9] transition"
                  required={!isFree}
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني *"
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4BB8A9] transition"
                  required
                />
                {!isFree && (
                  <>
                    <input
                      type="tel"
                      placeholder="رقم الجوال *"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4BB8A9] transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="اسم الشركة (اختياري)"
                      value={billingInfo.company}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4BB8A9] transition"
                    />
                  </>
                )}
              </div>

              {/* حالة Moyasar */}
              {!isFree && (
                <div className="mb-6 p-3 rounded-lg border">
                  {MOYASAR_CONFIG.publishableKey ? (
                    <div className={`flex items-center gap-2 text-sm ${
                      moyasarLoaded 
                        ? 'text-green-400 border-green-500/30 bg-green-900/20' 
                        : 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20'
                    }`}>
                      <Shield className="w-4 h-4" />
                      <span>
                        {moyasarLoaded 
                          ? '✅ نظام الدفع جاهز' 
                          : '⏳ جاري تحميل نظام الدفع...'
                        }
                      </span>
                    </div>
                  ) : (
                    <div className="text-red-400 border-red-500/30 bg-red-900/20 flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>❌ مفتاح Moyasar غير موجود في .env</span>
                    </div>
                  )}
                </div>
              )}

              {/* زر المتابعة */}
              {!moyasarInitialized && (
                <button
                  onClick={handleContinueToPayment}
                  disabled={loading || (!isFree && !moyasarLoaded) || (!isFree && !MOYASAR_CONFIG.publishableKey)}
                  className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-lg ${
                    loading || (!isFree && !moyasarLoaded) || (!isFree && !MOYASAR_CONFIG.publishableKey)
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-[#4BB8A9] hover:bg-[#6cc9b9] text-gray-900'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      {isFree ? 'جاري التفعيل...' : 'جاري تحضير نموذج الدفع...'}
                    </>
                  ) : (
                    <>
                      {isFree ? (
                        <>
                          <Check className="w-6 h-6" />
                          تفعيل الحساب المجاني
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6" />
                          متابعة للدفع ({Math.round(total * 1.15)} ريال)
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* نموذج الدفع */}
            {moyasarInitialized && !isFree && (
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#4BB8A9]" />
                  بيانات البطاقة الائتمانية
                </h2>
                
                <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>نموذج دفع آمن ومحمي - املأ بيانات البطاقة للمتابعة</span>
                  </div>
                </div>

                <div className="mysr-form bg-white rounded-lg p-4 min-h-[350px]">
                  {/* ستظهر حقول البطاقة هنا */}
                </div>
              </div>
            )}

            {/* بيانات الاختبار */}
            {moyasarInitialized && !isFree && process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 font-medium mb-2">🧪 بيانات الاختبار:</p>
                <div className="text-yellow-200 text-sm space-y-1">
                  <div>• رقم البطاقة: <strong>4242424242424242</strong></div>
                  <div>• تاريخ الانتهاء: <strong>12/28</strong></div>
                  <div>• CVV: <strong>123</strong></div>
                  <div>• الاسم: أي اسم</div>
                </div>
              </div>
            )}
          </div>

          {/* ملخص الطلب */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 sticky top-4">
              <div className={`bg-gradient-to-r ${plan.color} rounded-lg p-4 mb-6`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{plan.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">الخطة {plan.name}</h3>
                    <p className="text-white/80 text-sm">
                      {isFree ? 'مجانية للأبد' : 'دفع آمن بواسطة Moyasar'}
                    </p>
                  </div>
                </div>
              </div>

              {/* دورة الفوترة */}
              {!isFree && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">دورة الفوترة</label>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${
                      billingCycle === 'monthly' ? 'border-[#4BB8A9] bg-[#4BB8A9]/10' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="billing"
                          value="monthly"
                          checked={billingCycle === 'monthly'}
                          onChange={(e) => setBillingCycle(e.target.value)}
                          disabled={moyasarInitialized}
                          className="sr-only"
                        />
                        <span>شهرياً</span>
                      </div>
                      <span className="font-bold">{plan.price} ريال</span>
                    </label>
                    
                    <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${
                      billingCycle === 'yearly' ? 'border-[#4BB8A9] bg-[#4BB8A9]/10' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="billing"
                          value="yearly"
                          checked={billingCycle === 'yearly'}
                          onChange={(e) => setBillingCycle(e.target.value)}
                          disabled={moyasarInitialized}
                          className="sr-only"
                        />
                        <div>
                          <span>سنوياً</span>
                          <span className="block text-xs text-green-400">وفر 20%</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="font-bold">{Math.round(plan.price * 12 * 0.8)} ريال</span>
                        <span className="block text-xs text-gray-400 line-through">{plan.price * 12} ريال</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* كود الخصم */}
              {!isFree && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    كود الخصم
                  </label>
                  
                  {!appliedPromo ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="أدخل كود الخصم"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          disabled={moyasarInitialized || loading}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4BB8A9] transition disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => applyPromoCode()}
                          disabled={!promoCode.trim() || moyasarInitialized || loading}
                          className="bg-[#4BB8A9] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#6cc9b9] transition text-sm disabled:opacity-50 flex items-center"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          ) : (
                            'تطبيق'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">{appliedPromo.code}</span>
                        </div>
                        {!moyasarInitialized && (
                          <button
                            onClick={() => setAppliedPromo(null)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            إزالة
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-green-300 mt-1">{appliedPromo.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ملخص السعر */}
              <div className="border-t border-gray-800 pt-4 space-y-2">
                {isFree ? (
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-green-400 mb-2">مجاني</div>
                    <p className="text-sm text-gray-400">لا توجد رسوم - إلى الأبد</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>السعر الأساسي</span>
                      <span>{total} ريال</span>
                    </div>
                    
                    {appliedPromo && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>خصم الكوبون ({appliedPromo.code})</span>
                        <span>-{discountAmount} ريال</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>ضريبة القيمة المضافة (15%)</span>
                      <span>{Math.round(total * 0.15)} ريال</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-lg">
                      <span>المجموع</span>
                      <span className="text-[#4BB8A9]">{Math.round(total * 1.15)} ريال</span>
                    </div>
                  </>
                )}
              </div>

              {/* ضمانات الأمان */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="space-y-2 text-xs text-gray-400">
                  {!isFree && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>دفع آمن بواسطة Moyasar</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span>إلغاء في أي وقت</span>
                  </div>
                  {!isFree && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>ضمان استرداد 30 يوم</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}