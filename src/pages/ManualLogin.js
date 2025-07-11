import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

// ✅ إضافة النافبار الموحد و useTheme
import PublicNavbar from '../components/navbars/PublicNavbar';
import Footer from "../components/Footer";
import { useTheme } from '../contexts/ThemeContext';

// ✅ استيراد Supabase
import { authAPI } from "../config/api";

// إعداد Google Client ID (محفوظ من الكود الأصلي)
const GOOGLE_CLIENT_ID = "403864871499-59f26jiafopipeplaq09bplabe594q0o.apps.googleusercontent.com";

// ✅ تحديث معلومات الخطط لتتوافق مع النظام الجديد
const PLAN_INFO = {
  starter: { 
    name: "البداية", 
    price: "99 ريال/شهر", 
    icon: "🚀",
    points: "1,000 نقطة",
    features: [
      "1,000 نقطة شهرياً",
      "7 أيام تجربة مع استرداد 100%",
      "توليد أوصاف بالذكاء الاصطناعي",
      "تحليل SEO أساسي"
    ]
  },
  advanced: { 
    name: "المتقدمة", 
    price: "199 ريال/شهر", 
    icon: "💎",
    points: "3,000 نقطة",
    features: [
      "3,000 نقطة شهرياً",
      "7 أيام تجربة مع استرداد 100%",
      "كل مميزات باقة البداية",
      "تحليل SEO متقدم",
      "تحليل المنافسين الأساسي"
    ]
  },
  professional: { 
    name: "الاحترافية", 
    price: "399 ريال/شهر", 
    icon: "👑",
    points: "10,000 نقطة",
    features: [
      "10,000 نقطة شهرياً",
      "7 أيام تجربة مع استرداد 100%",
      "كل مميزات الباقة المتقدمة",
      "API Access للتكامل",
      "مدير حساب مخصص"
    ]
  }
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
    plan: selectedPlan || "starter" // تغيير الافتراضي من free إلى starter
  });

  // ✅ تحميل الخطة من URL والبيانات المحفوظة
  useEffect(() => {
    // قراءة معامل الخطة من URL
    const urlParams = new URLSearchParams(location.search);
    const planParam = urlParams.get('plan');
    
    if (planParam && PLAN_INFO[planParam]) {
      setSelectedPlan(planParam);
      setIsLogin(false); // التبديل للتسجيل مباشرة عند اختيار خطة
      console.log(`تم اختيار الخطة: ${PLAN_INFO[planParam].name}`);
    }

    // تحميل البيانات المحفوظة للدخول
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
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

  // ✅ فحص الجلسة الحالية
  const checkCurrentSession = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // المستخدم مسجل دخول مسبقاً
        console.log('✅ User already logged in');
        
        // توجيه للصفحة المناسبة
        if (selectedPlan) {
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
      const data = await authAPI.login(loginForm.email, loginForm.password);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("backend_token", data.access_token);
        
        const userData = data.user || { email: loginForm.email };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("clientName", userData.full_name || userData.name || loginForm.email);

        if (loginForm.rememberMe) {
          localStorage.setItem("rememberedEmail", loginForm.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toast.success(`مرحباً ${userData.full_name || loginForm.email}، تم تسجيل الدخول بنجاح`);
        
        setTimeout(() => {
          if (selectedPlan) {
            navigate(`/checkout?plan=${selectedPlan}`);
          } else {
            navigate("/products");
          }
        }, 1000);
      } else {
        throw new Error("لم يتم استلام رمز الوصول");
      }

    } catch (err) {
      console.error('Login error:', err);
      
      if (err.message?.includes("401") || err.message?.includes("غير صحيحة")) {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (err.message?.includes("network")) {
        toast.error("خطأ في الاتصال. تحقق من اتصالك بالإنترنت");
      } else {
        toast.error(err.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ التسجيل مع Supabase + حفظ في profiles
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    
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
      let storeUrl = registerForm.storeUrl.trim();
      if (!storeUrl.startsWith('http://') && !storeUrl.startsWith('https://')) {
        storeUrl = 'https://' + storeUrl;
      }

      const data = await authAPI.register({
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
        full_name: registerForm.fullName.trim(),
        phone: registerForm.phone,
        store_url: storeUrl,
        plan: registerForm.plan || 'starter'
      });

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("backend_token", data.access_token);
        
        const userData = data.user || { 
          email: registerForm.email,
          full_name: registerForm.fullName 
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("clientName", userData.full_name || registerForm.fullName);
        
        if (selectedPlan) {
          toast.success(`🎉 تم إنشاء الحساب بنجاح! جاري توجيهك لإتمام الدفع للخطة ${PLAN_INFO[selectedPlan].name}`, {
            duration: 4000
          });
          
          setTimeout(() => {
            navigate(`/checkout?plan=${selectedPlan}`);
          }, 2000);
        } else {
          toast.success("🎉 تم إنشاء الحساب بنجاح! جاري توجيهك للوحة التحكم...", {
            duration: 3000
          });
          
          setTimeout(() => {
            navigate("/products");
          }, 1500);
        }
      } else {
        throw new Error("لم يتم استلام رمز الوصول");
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.message?.includes("already exists") || err.message?.includes("مسجل مسبقاً")) {
        toast.error("🚫 هذا البريد الإلكتروني مسجّل مسبقاً. يرجى تسجيل الدخول أو استخدام بريد آخر.");
      } else if (err.message?.includes("network")) {
        toast.error("خطأ في الاتصال. تحقق من اتصالك بالإنترنت");
      } else {
        toast.error(err.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login مع Supabase
  const handleGoogleLogin = async () => {
    toast.info("تسجيل الدخول بـ Google قيد التطوير. استخدم البريد الإلكتروني حالياً.");
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
    
    toast.info("يرجى التواصل مع الدعم الفني لإعادة تعيين كلمة المرور");
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
            <h1 className={`text-4xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isLogin ? 
                "مرحباً بك مرة أخرى!" : 
                selectedPlan ? `اختيار ممتاز! الخطة ${PLAN_INFO[selectedPlan].name}` : "أطلق نمو متجرك باستخدام تحليل السيو الذكي."
              }
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isLogin ? 
                "سجل دخولك للوصول إلى لوحة التحكم وتحليلات السيو المتقدمة." :
                selectedPlan ? `ستحصل على جميع مميزات الخطة ${PLAN_INFO[selectedPlan].name} فور إتمام التسجيل` : "أدخل عالم السيو باحتراف. نظام نقاط مرن يتكيف مع احتياجاتك."
              }
            </p>
            
            {/* عرض معلومات الخطة المختارة - محدث للثيم */}
            {selectedPlan && PLAN_INFO[selectedPlan] && (
              <div className={`rounded-xl p-4 border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-[#4BB8A9]/30' 
                  : 'bg-blue-50 border-[#4BB8A9]/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{PLAN_INFO[selectedPlan].icon}</span>
                  <div>
                    <h3 className="font-bold text-[#4BB8A9]">الخطة {PLAN_INFO[selectedPlan].name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {PLAN_INFO[selectedPlan].price}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {PLAN_INFO[selectedPlan].points} شهرياً
                </p>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {PLAN_INFO[selectedPlan].features.slice(0, 4).map((feature, idx) => (
                    <li key={idx}>✅ {feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <img src="/salla.png" alt="Salla" className="h-6 object-contain" />
              <img src="/shopify.png" alt="Shopify" className="h-6 object-contain" />
              <img src="/zid.png" alt="Zid" className="h-6 object-contain" />
            </div>
          </div>

          {/* الجانب الأيمن - النموذج - محدث للثيم */}
          <div className={`rounded-3xl p-10 md:p-12 w-full border shadow-lg transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 text-white border-gray-700 shadow-[0_20px_60px_rgba(0,0,0,0.3)]' 
              : 'bg-white text-gray-800 border-gray-100 shadow-[0_20px_60px_rgba(131,220,201,0.25)]'
          }`}>
            
            {/* أزرار التبديل - محدث للثيم */}
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

            <h2 className="text-xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
              {isLogin ? "أهلاً بك من جديد" : selectedPlan ? `التسجيل في الخطة ${PLAN_INFO[selectedPlan].name}` : "سجّل الآن وابدأ تجربتك"}
            </h2>

            {/* زر Google - محدث للثيم */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
                  <span>{isLogin ? "تسجيل الدخول" : "التسجيل"} بـ Google</span>
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
            {isLogin ? (
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
                  {loading ? "جاري تسجيل الدخول..." : "🔐 تسجيل الدخول"}
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
                  <option value="starter">الخطة البداية - 99 ريال/شهر</option>
                  <option value="advanced">الخطة المتقدمة - 199 ريال/شهر</option>
                  <option value="professional">الخطة الاحترافية - 399 ريال/شهر</option>
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
                   selectedPlan ? `💳 التسجيل في ${PLAN_INFO[selectedPlan].name}` : 
                   "🚀 ابدأ تجربتك الآن"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}