import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    toast.success("🎉 تم تسجيل الدخول بنجاح");
    setTimeout(() => {
      navigate("/dashboard");
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between font-arabic">
      {/* المحتوى */}
      <div className="flex flex-col items-center justify-center px-4 py-12 flex-grow">
        {/* ✅ الشعار أعلى الصفحة */}
        <img src="/logo2.png" alt="Logo" className="h-14 object-contain mb-8" />

        {/* ✅ الكارد الرئيسي */}
        <div className="max-w-md w-full bg-white text-gray-800 rounded-3xl p-10 md:p-12 border border-gray-100 shadow-[0_20px_60px_rgba(131,220,201,0.25)]">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تسجيل الدخول</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-right">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-right">كلمة المرور</label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-100 border border-gray-300 text-sm rounded-xl py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                تذكرني
              </label>
              <a href="#" className="text-blue-500 hover:underline">نسيت كلمة المرور؟</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition duration-300 ${
                loading
                  ? "bg-green-600 animate-pulse cursor-default"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "🎉 جاري التحويل..." : "تسجيل الدخول"}
            </button>

            {/* زرّ تسجيل الدخول عبر Google */}
            <button
              type="button"
              onClick={() => window.location.href = "http://localhost:8000/google-auth/login"}
              className="w-full mt-3 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition duration-300"
            >
              تسجيل الدخول عبر Google
            </button>
          </form>

          

          {/* رابط التسجيل */}
          <div className="text-center mt-6 text-sm text-gray-600">
            لا تملك حساب؟{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              سجّل الآن
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ الفوتر */}
      <Footer />
    </div>
  );
}
