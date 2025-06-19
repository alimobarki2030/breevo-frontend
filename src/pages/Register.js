import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    storeUrl: "",
    plan: "free",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // تحديث الحالة أولاً
    setForm({ ...form, [name]: value });

    // التحقق من صحة رقم الهاتف (فقط إذا تم إدخال رقم)
    if (name === "phone" && value) {
      // التحقق من أن الرقم يحتوي على أرقام فقط
      if (!/^\d*$/.test(value)) {
        toast.error("يجب أن يحتوي رقم الجوال على أرقام فقط");
        return;
      }
      
      // التحقق من الطول والبداية (فقط عند اكتمال الرقم)
      if (value.length === 9 && !value.startsWith('5')) {
        toast.error("رقم الجوال يجب أن يبدأ بـ 5");
      } else if (value.length > 9) {
        toast.error("رقم الجوال يجب أن يكون 9 أرقام فقط");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      console.log("📦 البيانات المرسلة:", form);
      const res = await fetch("https://breevo-backend.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          store_url: form.storeUrl,
          plan: form.plan,
        }),
      });

      const data = await res.json();
      console.log("🔄 استجابة الخادم:", data);

      if (!res.ok) {
        console.error("🔥 الخطأ من الباكند:", data);

        // تحسين التحقق من رسائل الخطأ
        if (data.detail) {
          const errorMessage = data.detail.toLowerCase();
          
          // التحقق من رسائل الخطأ المختلفة للمستخدم المسجل مسبقاً
          if (errorMessage.includes("already exists") || 
              errorMessage.includes("already registered") || 
              errorMessage.includes("مستخدم مسبقًا") ||
              errorMessage.includes("email already") ||
              errorMessage.includes("user already") ||
              res.status === 409) { // Conflict status code
            
            toast.error("🚫 هذا البريد الإلكتروني مسجّل مسبقًا. يرجى تسجيل الدخول أو استخدام بريد آخر.");
          } else {
            toast.error(data.detail || "حدث خطأ أثناء إنشاء الحساب");
          }
        } else {
          // التحقق من رمز الحالة
          if (res.status === 409) {
            toast.error("🚫 هذا البريد الإلكتروني مسجّل مسبقًا. يرجى تسجيل الدخول أو استخدام بريد آخر.");
          } else {
            toast.error("حدث خطأ أثناء إنشاء الحساب");
          }
        }
        return;
      }

      // نجح التسجيل
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("clientName", form.fullName);
        localStorage.setItem("user", JSON.stringify({ name: form.fullName }));
        toast.success("تم إنشاء الحساب بنجاح 🎉");
        navigate("/products");
      } else {
        toast.error("خطأ في استلام بيانات الحساب");
      }
      
    } catch (err) {
      console.error("❌ خطأ في الاتصال:", err);
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between font-arabic">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 px-4">
            <img src="/logo2.png" alt="Logo" className="max-h-20 object-contain" />
            <h1 className="text-4xl font-bold leading-tight text-white">
              أطلق نمو متجرك باستخدام تحليل السيو الذكي.
            </h1>
            <p className="text-gray-300 text-lg">
              أدخل عالم السيو باحتراف. نسخة مجانية، بدون بطاقة ائتمانية.
            </p>
            <div className="flex flex-wrap gap-4">
              <img src="/salla.png" alt="Salla" className="h-6 object-contain" />
              <img src="/shopify.png" alt="Shopify" className="h-6 object-contain" />
              <img src="/zid.png" alt="Zid" className="h-6 object-contain" />
            </div>
          </div>

          <div className="bg-white text-gray-800 rounded-3xl p-10 md:p-12 w-full border border-gray-100 shadow-[0_20px_60px_rgba(131,220,201,0.25)]">
            <h2 className="text-xl font-bold mb-6 text-center text-green-700">سجّل الآن وابدأ مجاناً</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                name="fullName" 
                type="text" 
                required 
                placeholder="الاسم الكامل" 
                value={form.fullName}
                onChange={handleChange} 
                className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
              />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="البريد الإلكتروني" 
                value={form.email}
                onChange={handleChange} 
                className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
              />
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="كلمة المرور" 
                value={form.password}
                onChange={handleChange} 
                className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
              />
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
                  value={form.phone}
                  onChange={handleChange} 
                  className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 pr-24 pl-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
                />
              </div>
              <input 
                name="storeUrl" 
                type="url" 
                required 
                placeholder="رابط متجرك https://" 
                value={form.storeUrl}
                onChange={handleChange} 
                className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400" 
              />
              <select 
                name="plan" 
                value={form.plan} 
                onChange={handleChange} 
                className="w-full bg-gray-100 border border-gray-300 text-sm text-gray-800 rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="free">الخطة المجانية</option>
                <option value="pro">الخطة المدفوعة - Pro</option>
                <option value="enterprise">الخطة المتقدمة - Enterprise</option>
              </select>

              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
                  loading ? "bg-green-600 animate-pulse cursor-default" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "🎉 جاري التسجيل..." : "🚀 ابدأ الآن مجاناً"}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              لديك حساب بالفعل؟ <Link to="/manual-login" className="text-blue-600 hover:underline font-medium">تسجيل الدخول</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}