import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    setForm({ ...form, [e.target.name]: e.target.value });
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

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.detail || "فشل التسجيل");
        return;
      }

      const data = await res.json();
      toast.success("تم إنشاء الحساب بنجاح");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify({ name: data.client_name }));
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
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-md w-full space-y-4"
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-12 mb-2" />
          <h2 className="text-xl font-semibold text-gray-700">أنشئ حسابك 👋</h2>
        </div>

        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="الاسم الكامل"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="البريد الإلكتروني"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="كلمة المرور"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="رقم الجوال"
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="storeUrl"
          value={form.storeUrl}
          onChange={handleChange}
          placeholder="رابط المتجر (اختياري)"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#162b41] text-white py-2 rounded hover:bg-[#1e3b5f] transition"
        >
          {loading ? "جاري التسجيل..." : "إنشاء حساب"}
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          لديك حساب؟ {" "}
          <a href="/login" className="text-blue-600 underline">
            سجّل دخولك
          </a>
        </div>
      </form>
    </div>
  );
}