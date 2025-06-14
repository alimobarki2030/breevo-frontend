import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://breevo-backend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        toast.success("تم التسجيل بنجاح!");
        navigate("/site-selector");
      } else {
        toast.error(data.detail || "فشل في التسجيل");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white">
      <div className="bg-[#1c1e29] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#2a2d3c] border border-gray-700 text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#2a2d3c] border border-gray-700 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#2a2d3c] border border-gray-700 text-white"
          />
          <button
            type="submit"
            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold py-3 rounded transition"
          >
            تسجيل
          </button>
        </form>
      </div>
    </div>
  );
}