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
      const res = await fetch("https://breevo-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.detail || "فشل تسجيل الدخول");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("clientName", email);
      localStorage.setItem("user", JSON.stringify({ name: data.client_name }));
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/products");
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
      console.error(err);
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
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#162b41] text-white py-2 rounded hover:bg-[#1e3b5f] transition"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-blue-600 underline">
            أنشئ حسابك الآن
          </a>
        </div>
      </form>
    </div>
  );
}
