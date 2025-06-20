import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function ManualLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // تحميل البيانات المحفوظة عند تحميل الصفحة
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }
    
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // إزالة رسالة الخطأ عند بدء الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      console.log("محاولة تسجيل الدخول للمستخدم:", formData.email);
      
      const res = await fetch("https://breevo-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("حالة الاستجابة:", res.status);

      if (!res.ok) {
        const errData = await res.json();
        console.error("خطأ في تسجيل الدخول:", errData);
        
        if (res.status === 400) {
          toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          toast.error(errData.detail || "فشل تسجيل الدخول");
        }
        return;
      }

      const data = await res.json();
      console.log("بيانات الاستجابة:", data);

      // التحقق من وجود البيانات المطلوبة
      if (!data.access_token && !data.token) {
        console.error("لا يوجد رمز وصول في الاستجابة");
        toast.error("خطأ في البيانات المستلمة من الخادم");
        return;
      }

      // حفظ البيانات في localStorage
      const token = data.access_token || data.token;
      const clientName = data.client_name || formData.email;

      localStorage.setItem("token", token);
      localStorage.setItem("clientName", clientName);
      localStorage.setItem("user", JSON.stringify({ 
        name: clientName,
        email: formData.email 
      }));

      // حفظ البريد الإلكتروني إذا كان المستخدم قد اختار "تذكرني"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      console.log("تم حفظ البيانات بنجاح");
      toast.success(`مرحباً ${clientName}، تم تسجيل الدخول بنجاح`);
      
      // تأخير قصير للتأكد من حفظ البيانات
      setTimeout(() => {
        console.log("الانتقال إلى صفحة المنتجات");
        navigate("/products");
      }, 500);

    } catch (err) {
      console.error("خطأ في الاتصال:", err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }
    
    // يمكنك تنفيذ هذه الوظيفة لاحقاً
    toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/logo2.png" alt="Logo" className="max-h-20 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">أهلاً بك من جديد</h1>
          <p className="text-gray-600">سجل دخولك للوصول إلى حسابك</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pr-12 pl-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#162b41] text-white py-3 rounded-lg hover:bg-[#1e3b5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="mr-2">جاري الدخول...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5 ml-2" />
                <span>دخول</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => toast.info("ميزة تسجيل الدخول بجوجل قريباً")}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 ml-2" />
              <span>تسجيل الدخول بجوجل</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                أنشئ حسابك الآن
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-8 space-x-4">
          <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
            سياسة الخصوصية
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700">
            الشروط والأحكام
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/support" className="text-sm text-gray-500 hover:text-gray-700">
            الدعم الفني
          </Link>
        </div>
      </div>
    </div>
  );
}