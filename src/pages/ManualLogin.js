import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";

// إعداد Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

// تعريف الخطط
const PLAN_INFO = {
  free: { name: "المجانية", price: "مجانًا", icon: "🆓" },
  pro: { name: "الاحترافية", price: "49 ريال/شهر", icon: "💎" },
  enterprise: { name: "الأعمال", price: "129 ريال/شهر", icon: "👑" }
};

export default function ManualLogin() {
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
    plan: selectedPlan || "free" // استخدام الخطة المختارة أو المجانية افتراضياً
  });

  // تحميل Google Identity Services
  useEffect(() => {
    // قراءة معامل الخطة من URL
    const urlParams = new URLSearchParams(location.search);
    const planParam = urlParams.get('plan');
    
    if (planParam && PLAN_INFO[planParam]) {
      setSelectedPlan(planParam);
      // إذا كانت خطة مدفوعة، اعرض نموذج التسجيل
      if (planParam !== 'free') {
        setIsLogin(false);
      }
      console.log(`تم اختيار الخطة: ${PLAN_INFO[planParam].name}`);
    }

    // تحميل البيانات المحفوظة للدخول
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setLoginForm(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }

    // تحميل Google Script
    const loadGoogleScript = () => {
      if (document.getElementById('google-identity-script')) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com") {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });
        } catch (error) {
          console.error('خطأ في تهيئة Google Sign-In:', error);
        }
      }
    };

    loadGoogleScript();
  }, [location.search]); // إعادة التشغيل عند تغيير URL

  // تحديث خطة التسجيل عند تغيير الخطة المختارة
  useEffect(() => {
    if (selectedPlan) {
      setRegisterForm(prev => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  // معالجة Google Login
  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const res = await fetch("https://breevo-backend.onrender.com/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.credential }),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.detail || "فشل تسجيل الدخول بـ Google");
        return;
      }

      const data = await res.json();
      const token = data.access_token || data.token;
      const clientName = data.client_name || payload.name;

      localStorage.setItem("token", token);
      localStorage.setItem("clientName", clientName);
      localStorage.setItem("user", JSON.stringify({ 
        name: clientName,
        email: data.email || payload.email,
        provider: 'google'
      }));

      toast.success(`مرحباً ${clientName}، تم تسجيل الدخول بنجاح`);
      
      // التحقق من الخطة المختارة للتوجيه المناسب
      if (selectedPlan && selectedPlan !== 'free') {
        setTimeout(() => {
          navigate(`/checkout?plan=${selectedPlan}`);
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/products");
        }, 500);
      }

    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الدخول بـ Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.google) {
      toast.error("خدمة Google غير متاحة حالياً");
      return;
    }

    if (GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com") {
      toast.error("يرجى إعداد Google Client ID أولاً");
      return;
    }

    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      toast.error("حدث خطأ في خدمة Google");
    }
  };

  // معالجة تغيير النماذج
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));

    // التحقق من رقم الهاتف
    if (name === "phone" && value) {
      if (!/^\d*$/.test(value)) {
        toast.error("يجب أن يحتوي رقم الجوال على أرقام فقط");
        return;
      }
      
      if (value.length === 9 && !value.startsWith('5')) {
        toast.error("رقم الجوال يجب أن يبدأ بـ 5");
      } else if (value.length > 9) {
        toast.error("رقم الجوال يجب أن يكون 9 أرقام فقط");
      }
    }
  };

  // تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("https://breevo-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      const data = await res.json();
      const token = data.access_token || data.token;
      const clientName = data.client_name || loginForm.email;

      localStorage.setItem("token", token);
      localStorage.setItem("clientName", clientName);
      localStorage.setItem("user", JSON.stringify({ 
        name: clientName,
        email: loginForm.email,
        provider: 'manual'
      }));

      if (loginForm.rememberMe) {
        localStorage.setItem("rememberedEmail", loginForm.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success(`مرحباً ${clientName}، تم تسجيل الدخول بنجاح`);
      navigate("/products");

    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  // التسجيل
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("https://breevo-backend.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: registerForm.fullName,
          email: registerForm.email,
          password: registerForm.password,
          phone: registerForm.phone,
          store_url: registerForm.storeUrl,
          plan: registerForm.plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail && (data.detail.includes("already exists") || data.detail.includes("مستخدم مسبقًا"))) {
          toast.error("🚫 هذا البريد الإلكتروني مسجّل مسبقًا. يرجى تسجيل الدخول أو استخدام بريد آخر.");
        } else {
          toast.error(data.detail || "حدث خطأ أثناء إنشاء الحساب");
        }
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("clientName", registerForm.fullName);
        localStorage.setItem("user", JSON.stringify({ name: registerForm.fullName }));
        
        // رسالة نجاح مخصصة حسب الخطة
        if (selectedPlan && selectedPlan !== 'free') {
          toast.success(`🎉 تم إنشاء الحساب بنجاح! سيتم توجيهك لإتمام الدفع للخطة ${PLAN_INFO[selectedPlan].name}`);
          // توجيه إلى صفحة الدفع للخطط المدفوعة
          setTimeout(() => {
            navigate(`/checkout?plan=${selectedPlan}`);
          }, 1500);
        } else {
          toast.success("تم إنشاء الحساب بنجاح 🎉");
          navigate("/products");
        }
      }
      
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!loginForm.email) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }
    toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between font-arabic">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* الجانب الأيسر - المعلومات */}
          <div className="space-y-6 px-4">
            <img src="/logo2.png" alt="Logo" className="max-h-20 object-contain" />
            <h1 className="text-4xl font-bold leading-tight text-white">
              {isLogin ? 
                "مرحباً بك مرة أخرى!" : 
                selectedPlan ? `اختيار ممتاز! الخطة ${PLAN_INFO[selectedPlan].name}` : "أطلق نمو متجرك باستخدام تحليل السيو الذكي."
              }
            </h1>
            <p className="text-gray-300 text-lg">
              {isLogin ? 
                "سجل دخولك للوصول إلى لوحة التحكم وتحليلات السيو المتقدمة." :
                selectedPlan ? `ستحصل على جميع مميزات الخطة ${PLAN_INFO[selectedPlan].name} فور إتمام التسجيل` : "أدخل عالم السيو باحتراف. نسخة مجانية، بدون بطاقة ائتمانية."
              }
            </p>
            
            {/* عرض معلومات الخطة المختارة */}
            {selectedPlan && (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-[#83dcc9]/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{PLAN_INFO[selectedPlan].icon}</span>
                  <div>
                    <h3 className="font-bold text-[#83dcc9]">الخطة {PLAN_INFO[selectedPlan].name}</h3>
                    <p className="text-sm text-gray-300">{PLAN_INFO[selectedPlan].price}</p>
                  </div>
                </div>
                {selectedPlan === 'free' && (
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✅ 3 منتجات شهرياً</li>
                    <li>✅ معاينة Google</li>
                    <li>✅ مؤشرات سيو أساسية</li>
                  </ul>
                )}
                {selectedPlan === 'pro' && (
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✅ 30 منتج شهرياً</li>
                    <li>✅ مؤشرات سيو متقدمة</li>
                    <li>✅ توليد تلقائي بالذكاء الاصطناعي</li>
                    <li>✅ دعم فني مخصص</li>
                  </ul>
                )}
                {selectedPlan === 'enterprise' && (
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✅ منتجات غير محدودة</li>
                    <li>✅ تحليل شامل متقدم</li>
                    <li>✅ دعم خاص ومتابعة مخصصة</li>
                    <li>✅ تقارير مفصلة</li>
                  </ul>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <img src="/salla.png" alt="Salla" className="h-6 object-contain" />
              <img src="/shopify.png" alt="Shopify" className="h-6 object-contain" />
              <img src="/zid.png" alt="Zid" className="h-6 object-contain" />
            </div>
          </div>

          {/* الجانب الأيمن - النموذج */}
          <div className="bg-white text-gray-800 rounded-3xl p-10 md:p-12 w-full border border-gray-100 shadow-[0_20px_60px_rgba(131,220,201,0.25)]">
            
            {/* أزرار التبديل */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  isLogin 
                    ? 'bg-green-600 text-white shadow-md' 
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
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            <h2 className="text-xl font-bold mb-6 text-center text-green-700">
              {isLogin ? "أهلاً بك من جديد" : selectedPlan ? `التسجيل في الخطة ${PLAN_INFO[selectedPlan].name}` : "سجّل الآن وابدأ مجاناً"}
            </h2>

            {/* زر Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center px-4 py-3 mb-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50"
            >
              {googleLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 ml-3"></div>
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

            {/* خط الفصل */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            {/* نماذج الدخول/التسجيل */}
            {isLogin ? (
              /* نموذج تسجيل الدخول */
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="البريد الإلكتروني" 
                  value={loginForm.email}
                  onChange={handleLoginChange} 
                  className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                />
                
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="كلمة المرور" 
                    value={loginForm.password}
                    onChange={handleLoginChange} 
                    className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 pr-4 pl-12 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    <span className="mr-2 text-sm text-gray-600">تذكرني</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
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
              /* نموذج التسجيل */
              <form onSubmit={handleRegister} className="space-y-4">
                <input 
                  name="fullName" 
                  type="text" 
                  required 
                  placeholder="الاسم الكامل" 
                  value={registerForm.fullName}
                  onChange={handleRegisterChange} 
                  className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="البريد الإلكتروني" 
                  value={registerForm.email}
                  onChange={handleRegisterChange} 
                  className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                />
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="كلمة المرور" 
                    value={registerForm.password}
                    onChange={handleRegisterChange} 
                    className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 pr-4 pl-12 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-gray-500 flex items-center gap-1">
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
                    className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 pr-24 pl-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                  />
                </div>
                <input 
                  name="storeUrl" 
                  type="url" 
                  required 
                  placeholder="رابط متجرك https://" 
                  value={registerForm.storeUrl}
                  onChange={handleRegisterChange} 
                  className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                />
                <select 
                  name="plan" 
                  value={registerForm.plan} 
                  onChange={handleRegisterChange} 
                  className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600"
                  disabled={selectedPlan} // تعطيل التغيير إذا تم اختيار خطة من الرابط
                >
                  <option value="free">الخطة المجانية</option>
                  <option value="pro">الخطة المدفوعة - Pro</option>
                  <option value="enterprise">الخطة المتقدمة - Enterprise</option>
                </select>
                
                {selectedPlan && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ تم اختيار الخطة {PLAN_INFO[selectedPlan].name} مسبقاً
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
                    loading ? "bg-green-600 animate-pulse cursor-default" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "🎉 جاري التسجيل..." : 
                   selectedPlan && selectedPlan !== 'free' ? `💳 التسجيل في ${PLAN_INFO[selectedPlan].name}` : 
                   "🚀 ابدأ الآن مجاناً"}
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