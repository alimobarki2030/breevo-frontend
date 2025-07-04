import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, ShoppingBag, BarChart3 } from "lucide-react";

// ✅ إضافة النافبار الموحد و useTheme
import PublicNavbar from '../components/navbars/PublicNavbar';
import Footer from "../components/Footer";
import { useTheme } from '../contexts/ThemeContext';

// ✅ استيراد Supabase
import { auth, database } from "../config/supabase";

// إعداد Google Client ID (محفوظ من الكود الأصلي)
const GOOGLE_CLIENT_ID = "403864871499-59f26jiafopipeplaq09bplabe594q0o.apps.googleusercontent.com";

// تعريف الخطط (محفوظ من الكود الأصلي)
const PLAN_INFO = {
  free: { name: "المجانية", price: "مجانًا", icon: "🆓" },
  pro: { name: "الاحترافية", price: "49 ريال/شهر", icon: "💎" },
  enterprise: { name: "الأعمال", price: "129 ريال/شهر", icon: "👑" }
};

export default function ManualLogin() {
  // ✅ استخدام useTheme
  const { theme, isDark } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true); // التبديل بين الدخول والتسجيل
  const [selectedPlan, setSelectedPlan] = useState(null); // الخطة المختارة
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // ✅ إضافات جديدة لدعم سلة
  const [sallaMode, setSallaMode] = useState(false);
  const [sallaCredentials, setSallaCredentials] = useState(null);
  const [analyticsMode, setAnalyticsMode] = useState(false);
  
  // بيانات تسجيل الدخول
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  // بيانات التسجيل
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    storeUrl: "",
    plan: selectedPlan || "free"
  });

  // ✅ تحميل الخطة من URL والبيانات المحفوظة + دعم سلة
  useEffect(() => {
    // قراءة معامل الخطة من URL
    const urlParams = new URLSearchParams(location.search);
    const planParam = urlParams.get('plan');
    const analyticsParam = urlParams.get('analytics');
    
    // التحقق من وجود معاملات سلة في URL
    const sallaToken = urlParams.get('salla_token');
    const sallaEmail = urlParams.get('email');
    const sallaPassword = urlParams.get('temp_password');
    const storeId = urlParams.get('store_id');
    
    if (sallaToken || (sallaEmail && sallaPassword)) {
      setSallaMode(true);
      setSallaCredentials({
        email: sallaEmail,
        password: sallaPassword,
        token: sallaToken,
        storeId: storeId
      });
      
      // إذا كان لدينا توكن سلة، نسجل دخول مباشرة
      if (sallaToken) {
        handleSallaAutoLogin(sallaToken, storeId);
      } else if (sallaEmail && sallaPassword) {
        // ملء النموذج تلقائياً
        setLoginForm(prev => ({
          ...prev,
          email: sallaEmail,
          password: sallaPassword
        }));
        setIsLogin(true);
      }
    }
    
    // التحقق من وضع Analytics
    if (analyticsParam === 'true') {
      setAnalyticsMode(true);
    }
    
    if (planParam && PLAN_INFO[planParam]) {
      setSelectedPlan(planParam);
      if (planParam !== 'free') {
        setIsLogin(false);
      }
      console.log(`تم اختيار الخطة: ${PLAN_INFO[planParam].name}`);
    }

    // تحميل البيانات المحفوظة للدخول
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail && !sallaEmail) {
      setLoginForm(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }

    // ✅ فحص الجلسة الحالية
    checkCurrentSession();
  }, [location.search]);

  // تحديث خطة التسجيل عند تغيير الخطة المختارة
  useEffect(() => {
    if (selectedPlan) {
      setRegisterForm(prev => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  // ✅ دالة تسجيل الدخول التلقائي لتجار سلة
  const handleSallaAutoLogin = async (sallaToken, storeId) => {
    try {
      setLoading(true);
      
      // التحقق من صحة التوكن مع السيرفر
      const response = await fetch('/api/salla/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: sallaToken, store_id: storeId })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // حفظ بيانات المستخدم
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("clientName", data.user.full_name || data.user.email);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        toast.success(`🎉 مرحباً ${data.user.full_name || data.user.email}! تم تسجيل الدخول بنجاح`);
        
        // توجيه لصفحة الترحيب المخصصة لسلة
        navigate(`/salla/welcome?store_id=${data.store.id}&store_name=${encodeURIComponent(data.store.name)}&action=تسجيل_تلقائي`);
      } else {
        toast.error('انتهت صلاحية الرابط، يرجى المحاولة مرة أخرى');
        setSallaMode(false);
      }
    } catch (error) {
      console.error('Salla auto login error:', error);
      toast.error('حدث خطأ في تسجيل الدخول');
      setSallaMode(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ فحص الجلسة الحالية
  const checkCurrentSession = async () => {
    try {
      const { session, error } = await auth.getSession();
      
      if (session && session.user && !sallaMode) {
        // المستخدم مسجل دخول مسبقاً
        console.log('✅ User already logged in:', session.user.email);
        
        // تحديث localStorage للتوافق مع الكود القديم
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("user", JSON.stringify({
          name: session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email,
          provider: 'supabase'
        }));
        
        // توجيه للصفحة المناسبة
        if (analyticsMode) {
          navigate("/dashboard/analytics");
        } else if (selectedPlan && selectedPlan !== 'free') {
          navigate(`/checkout?plan=${selectedPlan}`);
        } else {
          navigate("/products");
        }
      }
    } catch (error) {
      console.log('No active session:', error.message);
    }
  };

  // ✅ تسجيل الدخول مع Supabase - مُصحح
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // ✅ استخدام signIn المتوفرة في ملف supabase.js
      const { data, error } = await auth.signIn(loginForm.email, loginForm.password);

      if (error) {
        console.error('Login error:', error);
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      if (data.user) {
        // ✅ تحديث localStorage للتوافق مع الكود القديم
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("clientName", data.user.user_metadata?.full_name || loginForm.email);
        localStorage.setItem("user", JSON.stringify({
          name: data.user.user_metadata?.full_name || loginForm.email,
          email: loginForm.email,
          provider: 'supabase'
        }));

        // حفظ البريد إذا كان المستخدم يريد التذكر
        if (loginForm.rememberMe) {
          localStorage.setItem("rememberedEmail", loginForm.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // رسالة نجاح مخصصة حسب الوضع
        if (sallaMode) {
          toast.success(`🏪 مرحباً ${data.user.user_metadata?.full_name || loginForm.email}، تم ربط متجر سلة بنجاح`);
        } else {
          toast.success(`مرحباً ${data.user.user_metadata?.full_name || loginForm.email}، تم تسجيل الدخول بنجاح`);
        }
        
        // توجيه مناسب
        setTimeout(() => {
          if (sallaMode && sallaCredentials?.storeId) {
            navigate(`/salla/welcome?store_id=${sallaCredentials.storeId}&action=ربط_متجر`);
          } else if (analyticsMode) {
            navigate("/dashboard/analytics");
          } else if (selectedPlan && selectedPlan !== 'free') {
            navigate(`/checkout?plan=${selectedPlan}`);
          } else {
            navigate("/products");
          }
        }, 1000);
      }

    } catch (err) {
      console.error('Login exception:', err);
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  // ✅ التسجيل مع Supabase + حفظ في profiles
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;
    
    // التحقق من صحة البيانات
    if (!registerForm.fullName?.trim()) {
      toast.error("يرجى إدخال الاسم الكامل");
      return;
    }

    if (!registerForm.email || !/\S+@\S+\.\S+/.test(registerForm.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    if (!registerForm.password || registerForm.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (!registerForm.phone || registerForm.phone.length !== 9 || !registerForm.phone.startsWith('5')) {
      toast.error("رقم الجوال يجب أن يكون 9 أرقام ويبدأ بـ 5");
      return;
    }

    if (!registerForm.storeUrl?.trim()) {
      toast.error("يرجى إدخال رابط متجر صحيح");
      return;
    }

    setLoading(true);

    try {
      // إعداد URL إذا لم يحتوي على بروتوكول
      let storeUrl = registerForm.storeUrl.trim();
      if (!storeUrl.startsWith('http://') && !storeUrl.startsWith('https://')) {
        storeUrl = 'https://' + storeUrl;
      }

      // ✅ التسجيل مع Supabase
      const { data, error } = await auth.signUp(
        registerForm.email.trim().toLowerCase(),
        registerForm.password,
        {
          full_name: registerForm.fullName.trim(),
          phone: registerForm.phone,
          store_url: storeUrl,
          plan: registerForm.plan,
          source: sallaMode ? 'salla' : 'manual'
        }
      );

      if (error) {
        if (error.message.includes("already exists") || error.message.includes("User already registered")) {
          toast.error("🚫 هذا البريد الإلكتروني مسجّل مسبقًا. يرجى تسجيل الدخول أو استخدام بريد آخر.");
        } else {
          toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
        }
        return;
      }

      if (data.user) {
        // ✅ حفظ البيانات الإضافية في profiles table
        const profileData = {
          full_name: registerForm.fullName.trim(),
          phone: registerForm.phone,
          company_name: storeUrl,
          plan: registerForm.plan,
          subscription_status: 'trial',
          source: sallaMode ? 'salla' : 'manual'
        };

        const { error: profileError } = await database.updateProfile(profileData);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // لا نوقف العملية - فقط نسجل الخطأ
        }

        // ✅ تحديث localStorage للتوافق
        if (data.session) {
          localStorage.setItem("token", data.session.access_token);
        }
        localStorage.setItem("clientName", registerForm.fullName);
        localStorage.setItem("user", JSON.stringify({
          name: registerForm.fullName,
          email: registerForm.email,
          provider: 'supabase'
        }));
        
        // رسالة نجاح مخصصة حسب الوضع
        if (sallaMode) {
          toast.success(`🎉 تم إنشاء حساب سلة بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب`, {
            duration: 6000
          });
        } else if (selectedPlan && selectedPlan !== 'free') {
          toast.success(`🎉 تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب، ثم سيتم توجيهك لإتمام الدفع للخطة ${PLAN_INFO[selectedPlan].name}`, {
            duration: 6000
          });
        } else {
          toast.success("🎉 تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني وتأكيد حسابك للمتابعة 📧", {
            duration: 6000
          });
        }
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login مع Supabase + دعم Analytics
  const handleGoogleLogin = async (forAnalytics = false) => {
    setGoogleLoading(true);
    
    try {
      let redirectTo = `${window.location.origin}/auth/callback`;
      
      // إضافة معاملات للتوجيه المناسب بعد النجاح
      const params = new URLSearchParams();
      
      if (forAnalytics) {
        params.append('analytics', 'true');
      }
      if (sallaMode && sallaCredentials?.storeId) {
        params.append('salla_store', sallaCredentials.storeId);
      }
      if (selectedPlan) {
        params.append('plan', selectedPlan);
      }
      
      if (params.toString()) {
        redirectTo += `?${params.toString()}`;
      }
      
      const { data, error } = await auth.signInWithGoogle(redirectTo);
      
      if (error) {
        console.error('Google login error:', error);
        toast.error("فشل تسجيل الدخول بـ Google");
        return;
      }
      
      // Supabase سيقوم بالتوجيه تلقائياً
      console.log('✅ Google Sign-In initiated');
      
    } catch (err) {
      console.error('Google login exception:', err);
      toast.error("حدث خطأ أثناء تسجيل الدخول بـ Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  // معالجة تغيير نماذج الدخول
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ✅ معالجة تغيير نماذج التسجيل - مُصحح للمسافات
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // معالجة خاصة للحقول
    switch (name) {
      case 'phone':
        // إزالة كل شيء عدا الأرقام
        processedValue = value.replace(/\D/g, '').slice(0, 9);
        break;
        
      case 'email':
        // تحويل لأحرف صغيرة وإزالة المسافات
        processedValue = value.toLowerCase().replace(/\s/g, '');
        break;
        
      case 'fullName':
        // ✅ السماح بالمسافات - فقط تنظيف بسيط
        processedValue = value
          .replace(/^\s+/, '') // إزالة المسافات من البداية
          .replace(/\s{2,}/g, ' '); // تحويل مسافات متعددة إلى مسافة واحدة
        break;
        
      case 'storeUrl':
        // إزالة المسافات تماماً من URL
        processedValue = value.replace(/\s/g, '');
        break;
        
      default:
        // للحقول الأخرى - لا نعالج شيء
        processedValue = value;
    }

    setRegisterForm(prev => ({ ...prev, [name]: processedValue }));

    // التحقق من رقم الهاتف
    if (name === "phone" && processedValue.length > 0) {
      if (processedValue.length === 9 && !processedValue.startsWith('5')) {
        toast.error("رقم الجوال يجب أن يبدأ بـ 5");
      }
    }
  };

  // نسيان كلمة المرور - ✅ مع Supabase
  const handleForgotPassword = async () => {
    if (!loginForm.email) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }
    
    try {
      // ✅ استخدام الدالة الجديدة (بعد إضافتها لملف supabase.js)
      const { error } = await auth.resetPasswordForEmail(loginForm.email);
      
      if (error) {
        toast.error("حدث خطأ في إرسال رابط إعادة التعيين");
      } else {
        toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error("حدث خطأ في إرسال رابط إعادة التعيين");
    }
  };

  // التحقق من صحة النموذج
  const isFormValid = () => {
    return (
      registerForm.fullName?.length >= 2 &&
      /\S+@\S+\.\S+/.test(registerForm.email) &&
      registerForm.password?.length >= 6 &&
      registerForm.phone?.length === 9 &&
      registerForm.phone?.startsWith('5') &&
      registerForm.storeUrl?.includes('.') &&
      registerForm.plan
    );
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-arabic transition-colors duration-500 ${
      isDark 
        ? 'bg-gray-950 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* ✅ إضافة النافبار الموحد */}
      <PublicNavbar />
      
      {/* ✅ إضافة مساحة للنافبار الثابت */}
      <div className="pt-20 flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* الجانب الأيسر - المعلومات */}
          <div className="space-y-6 px-4">
            <img 
              src={isDark ? "/logo3.png" : "/logo22.png"} 
              alt="Logo" 
              className="max-h-20 object-contain transition-opacity duration-300" 
            />
            
            {/* عنوان مخصص لوضع سلة */}
            <h1 className={`text-4xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {sallaMode ? (
                <>
                  🏪 مرحباً تاجر سلة!
                  <br />
                  <span className="text-[#83dcc9]">متجرك في انتظارك</span>
                </>
              ) : analyticsMode ? (
                <>
                  📊 ربط Google Analytics
                  <br />
                  <span className="text-[#83dcc9]">للتحليل المتقدم</span>
                </>
              ) : isLogin ? (
                "مرحباً بك مرة أخرى!"
              ) : selectedPlan ? (
                <>
                  اختيار ممتاز! الخطة
                  <br />
                  <span className="text-[#83dcc9]">{PLAN_INFO[selectedPlan].name}</span>
                </>
              ) : (
                <>
                  أطلق نمو متجرك باستخدام
                  <br />
                  <span className="text-[#83dcc9]">تحليل السيو الذكي</span>
                </>
              )}
            </h1>
            
            {/* وصف مخصص لوضع سلة */}
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {sallaMode ? (
                "تم ربط متجرك مع منصتنا بنجاح! سجل دخولك للوصول لأدوات SEO المتقدمة وتحليل منتجاتك."
              ) : analyticsMode ? (
                "سجل دخولك باستخدام حساب Google نفسه المرتبط بـ Google Analytics لنتمكن من جلب إحصائياتك."
              ) : isLogin ? (
                "سجل دخولك للوصول إلى لوحة التحكم وتحليلات السيو المتقدمة."
              ) : selectedPlan ? (
                `ستحصل على جميع مميزات الخطة ${PLAN_INFO[selectedPlan].name} فور إتمام التسجيل`
              ) : (
                "أدخل عالم السيو باحتراف. نسخة مجانية، بدون بطاقة ائتمانية."
              )}
            </p>
            
            {/* معلومات متجر سلة */}
            {sallaMode && sallaCredentials && (
              <div className={`rounded-xl p-4 border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-[#83dcc9]/30' 
                  : 'bg-blue-50 border-[#83dcc9]/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏪</span>
                  <div>
                    <h3 className="font-bold text-[#83dcc9]">متجر سلة مرتبط</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      جاهز للتحليل والتحسين
                    </p>
                  </div>
                </div>
                {sallaCredentials.email && (
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    البريد الإلكتروني: {sallaCredentials.email}
                  </p>
                )}
              </div>
            )}
            
            {/* عرض معلومات الخطة المختارة - محدث للثيم */}
            {selectedPlan && !sallaMode && (
              <div className={`rounded-xl p-4 border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-[#83dcc9]/30' 
                  : 'bg-blue-50 border-[#83dcc9]/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{PLAN_INFO[selectedPlan].icon}</span>
                  <div>
                    <h3 className="font-bold text-[#83dcc9]">الخطة {PLAN_INFO[selectedPlan].name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {PLAN_INFO[selectedPlan].price}
                    </p>
                  </div>
                </div>
                {selectedPlan === 'free' && (
                  <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>✅ 3 منتجات شهرياً</li>
                    <li>✅ معاينة Google</li>
                    <li>✅ مؤشرات سيو أساسية</li>
                  </ul>
                )}
                {selectedPlan === 'pro' && (
                  <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>✅ 30 منتج شهرياً</li>
                    <li>✅ مؤشرات سيو متقدمة</li>
                    <li>✅ توليد تلقائي بالذكاء الاصطناعي</li>
                    <li>✅ دعم فني مخصص</li>
                  </ul>
                )}
                {selectedPlan === 'enterprise' && (
                  <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>✅ منتجات غير محدودة</li>
                    <li>✅ تحليل شامل متقدم</li>
                    <li>✅ دعم خاص ومتابعة مخصصة</li>
                    <li>✅ تقارير مفصلة</li>
                  </ul>
                )}
              </div>
            )}
            
            {/* شعارات المنصات */}
            {!analyticsMode && (
              <div className="flex flex-wrap gap-4">
                <img src="/salla.png" alt="Salla" className="h-6 object-contain" />
                <img src="/shopify.png" alt="Shopify" className="h-6 object-contain" />
                <img src="/zid.png" alt="Zid" className="h-6 object-contain" />
              </div>
            )}
            
            {/* معلومات Google Analytics */}
            {analyticsMode && (
              <div className="flex flex-wrap gap-4 items-center">
                <img src="/google-analytics.png" alt="Google Analytics" className="h-8 object-contain" />
                <img src="/search-console.png" alt="Search Console" className="h-8 object-contain" />
              </div>
            )}
          </div>

          {/* الجانب الأيمن - النموذج - محدث للثيم */}
          <div className={`rounded-3xl p-10 md:p-12 w-full border shadow-lg transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 text-white border-gray-700 shadow-[0_20px_60px_rgba(0,0,0,0.3)]' 
              : 'bg-white text-gray-800 border-gray-100 shadow-[0_20px_60px_rgba(131,220,201,0.25)]'
          }`}>
            
            {/* أزرار التبديل - محدث للثيم */}
            {!sallaMode && !analyticsMode && (
              <div className={`flex rounded-xl p-1 mb-6 transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    isLogin 
                      ? 'bg-green-600 text-white shadow-md' 
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    !isLogin 
                      ? 'bg-green-600 text-white shadow-md' 
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  إنشاء حساب
                </button>
              </div>
            )}

            {/* عنوان النموذج */}
            <h2 className="text-xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
              {sallaMode ? (
                "تسجيل دخول تاجر سلة 🏪"
              ) : analyticsMode ? (
                "ربط Google Analytics 📊"
              ) : isLogin ? (
                "أهلاً بك من جديد"
              ) : selectedPlan ? (
                `التسجيل في الخطة ${PLAN_INFO[selectedPlan].name}`
              ) : (
                "سجّل الآن وابدأ مجاناً"
              )}
            </h2>

            {/* زر Google - محدث للثيم + دعم Analytics */}
            <button
              type="button"
              onClick={() => handleGoogleLogin(analyticsMode)}
              disabled={googleLoading}
              className={`w-full flex items-center justify-center px-4 py-3 mb-4 border-2 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                isDark 
                  ? 'border-gray-600 hover:bg-gray-700 hover:border-green-500 text-white' 
                  : 'border-gray-300 hover:bg-gray-50 hover:border-green-300 text-gray-900'
              }`}
            >
              {googleLoading ? (
                <>
                  <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ml-3 ${
                    isDark ? 'border-white' : 'border-gray-600'
                  }`}></div>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>
                    {analyticsMode ? (
                      "ربط Google Analytics"
                    ) : sallaMode ? (
                      "ربط متجر سلة مع Google"
                    ) : isLogin ? (
                      "تسجيل الدخول"
                    ) : (
                      "التسجيل"
                    )} بـ Google
                  </span>
                  {analyticsMode && <BarChart3 className="w-4 h-4 mr-2" />}
                  {sallaMode && <ShoppingBag className="w-4 h-4 mr-2" />}
                </>
              )}
            </button>

            {/* خط الفصل - محدث للثيم */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  isDark 
                    ? 'bg-gray-800 text-gray-400' 
                    : 'bg-white text-gray-500'
                }`}>أو</span>
              </div>
            </div>

            {/* نماذج الدخول/التسجيل */}
            {(isLogin || sallaMode || analyticsMode) ? (
              /* نموذج تسجيل الدخول - محدث للثيم */
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="البريد الإلكتروني" 
                  value={loginForm.email}
                  onChange={handleLoginChange} 
                  className={`w-full border text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400'
                  }`}
                />
                
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="كلمة المرور" 
                    value={loginForm.password}
                    onChange={handleLoginChange} 
                    className={`w-full border text-sm rounded-xl py-3 pr-4 pl-12 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                        : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={handleLoginChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className={`mr-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      تذكرني
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
                    loading ? "bg-green-600 animate-pulse cursor-default" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? (
                    "جاري تسجيل الدخول..."
                  ) : sallaMode ? (
                    "🏪 دخول تاجر سلة"
                  ) : analyticsMode ? (
                    "📊 ربط Analytics"
                  ) : (
                    "🔐 تسجيل الدخول"
                  )}
                </button>
              </form>
            ) : (
              /* نموذج التسجيل - محدث للثيم */
              <form onSubmit={handleRegister} className="space-y-4">
                <input 
                  name="fullName" 
                  type="text" 
                  required 
                  placeholder="الاسم الكامل" 
                  value={registerForm.fullName}
                  onChange={handleRegisterChange} 
                  minLength={2}
                  className={`w-full border text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400'
                  }`}
                />
                
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="البريد الإلكتروني" 
                  value={registerForm.email}
                  onChange={handleRegisterChange} 
                  className={`w-full border text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400'
                  }`}
                />
                
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="كلمة المرور (6 أحرف على الأقل)" 
                    value={registerForm.password}
                    onChange={handleRegisterChange} 
                    minLength={6}
                    className={`w-full border text-sm rounded-xl py-3 pr-4 pl-12 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                        : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="relative">
                  <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-sm flex items-center gap-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>🇸🇦</span>
                    <span>+966</span>
                  </div>
                  <input 
                    name="phone" 
                    type="tel" 
                    required 
                    placeholder="مثال: 512345678" 
                    value={registerForm.phone}
                    onChange={handleRegisterChange} 
                    pattern="5[0-9]{8}"
                    maxLength={9}
                    className={`w-full border text-sm rounded-xl py-3 pr-24 pl-4 text-right focus:outline-none focus:ring-2 transition-colors duration-300 ${
                      registerForm.phone && (registerForm.phone.length !== 9 || !registerForm.phone.startsWith('5'))
                        ? 'border-red-300 focus:ring-red-500' 
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-green-500'
                          : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:ring-green-500'
                    }`}
                  />
                  {registerForm.phone && registerForm.phone.length > 0 && (
                    <div className="text-xs mt-1">
                      {registerForm.phone.length !== 9 && (
                        <span className="text-red-500">يجب أن يكون 9 أرقام</span>
                      )}
                      {registerForm.phone.length === 9 && !registerForm.phone.startsWith('5') && (
                        <span className="text-red-500">يجب أن يبدأ بـ 5</span>
                      )}
                      {registerForm.phone.length === 9 && registerForm.phone.startsWith('5') && (
                        <span className="text-green-500">✓ رقم صحيح</span>
                      )}
                    </div>
                  )}
                </div>
                
                <input 
                  name="storeUrl" 
                  type="url" 
                  required 
                  placeholder="رابط متجرك (مثال: mystore.salla.sa)" 
                  value={registerForm.storeUrl}
                  onChange={handleRegisterChange} 
                  className={`w-full border text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-800 placeholder:text-gray-400'
                  }`}
                />
                
                <select 
                  name="plan" 
                  value={registerForm.plan} 
                  onChange={handleRegisterChange} 
                  className={`w-full border text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-800'
                  }`}
                  disabled={selectedPlan}
                >
                  <option value="free">الخطة المجانية</option>
                  <option value="pro">الخطة المدفوعة - Pro</option>
                  <option value="enterprise">الخطة المتقدمة - Enterprise</option>
                </select>
                
                {selectedPlan && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✅ تم اختيار الخطة {PLAN_INFO[selectedPlan].name} مسبقاً
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={loading || !isFormValid()} 
                  className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
                    loading || !isFormValid() 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "🎉 جاري التسجيل..." : 
                   selectedPlan && selectedPlan !== 'free' ? `💳 التسجيل في ${PLAN_INFO[selectedPlan].name}` : 
                   "🚀 ابدأ الآن مجاناً"}
                </button>
              </form>
            )}
            
            {/* رسالة خاصة لتجار سلة */}
            {sallaMode && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'
              }`}>
                💡 <strong>تلميح:</strong> استخدم نفس بيانات الدخول التي أرسلناها لك بالإيميل
              </div>
            )}
            
            {/* رسالة خاصة لـ Analytics */}
            {analyticsMode && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
              }`}>
                📊 <strong>مهم:</strong> تأكد من استخدام نفس حساب Google المرتبط بـ Analytics
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}