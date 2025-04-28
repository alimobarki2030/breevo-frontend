import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";

export default function RegisterLanding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    storeUrl: "",
    heardFrom: "",
    plan: "free",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    toast.success("تم إنشاء الحساب بنجاح 🎉");
    setTimeout(() => {
      navigate("/dashboard");
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between font-arabic">
      {/* المحتوى الرئيسي */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* الجانب النصي */}
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

          {/* الكارد الجديد */}
          <div className="bg-white text-gray-800 rounded-3xl p-10 md:p-12 w-full border border-gray-100 shadow-[0_20px_60px_rgba(131,220,201,0.25)]">
            <h2 className="text-xl font-bold mb-6 text-center text-green-700">سجّل الآن وابدأ مجاناً</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="fullName"
                type="text"
                required
                placeholder="الاسم الكامل"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
                onChange={handleChange}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="البريد الإلكتروني"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
                onChange={handleChange}
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
                  placeholder="512345678"
                  className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 pl-4 pr-24 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
                  onChange={handleChange}
                />
              </div>
              <input
                name="storeUrl"
                type="url"
                required
                placeholder="رابط متجرك https://"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
                onChange={handleChange}
              />
              <input
                name="heardFrom"
                type="text"
                placeholder="كيف عرفت عنّا؟ (تويتر، قوقل، صديق...)"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
                onChange={handleChange}
              />
              <select
                name="plan"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={handleChange}
                value={form.plan}
              >
                <option value="free">الخطة المجانية</option>
                <option value="pro">الخطة المدفوعة - Pro</option>
                <option value="enterprise">الخطة المتقدمة - Enterprise</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
                  loading
                    ? "bg-green-600 animate-pulse cursor-default"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading
                  ? "🎉 جاري التسجيل..."
                  : "🚀 ابدأ الآن مجاناً"}
              </button>

              {/* زرّ تسجيل عبر Google */}
              <button
                type="button"
                onClick={() => window.location.assign("http://localhost:8000/google-auth/login")}
                className="w-full mt-3 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition duration-300"
              >
                سجّل عبر Google
              </button>
            </form>

            {/* رابط تسجيل الدخول */}
            <div className="text-center mt-6 text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* الفوتر */}
      <Footer />
    </div>
  );
}
