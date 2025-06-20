import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ManualLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("محاولة تسجيل الدخول للمستخدم:", email);
      
      const res = await fetch("https://breevo-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("حالة الاستجابة:", res.status);

      if (!res.ok) {
        const errData = await res.json();
        console.error("خطأ في تسجيل الدخول:", errData);
        toast.error(errData.detail || "فشل تسجيل الدخول");
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
      const clientName = data.client_name || email;

      localStorage.setItem("token", token);
      localStorage.setItem("clientName", clientName);
      localStorage.setItem("user", JSON.stringify({ 
        name: clientName,
        email: email 
      }));

      console.log("تم حفظ البيانات بنجاح:");
      console.log("- Token:", token ? "موجود" : "غير موجود");
      console.log("- Client Name:", clientName);

      toast.success("تم تسجيل الدخول بنجاح");
      
      // تأخير قصير للتأكد من حفظ البيانات
      setTimeout(() => {
        console.log("الانتقال إلى صفحة المنتجات");
        navigate("/products");
      }, 100);

    } catch (err) {
      console.error("خطأ في الاتصال:", err);
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-md w-full space-y-4"
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <img src="/logo2.png" alt="Logo" className="max-h-20 object-contain" />
          <h2 className="text-xl font-semibold text-gray-700">أهلاً بك من جديد 👋</h2>
        </div>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#162b41] text-white py-2 rounded hover:bg-[#1e3b5f] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-blue-600 underline hover:text-blue-800">
            أنشئ حسابك الآن
          </a>
        </div>
      </form>
    </div>
  );
}