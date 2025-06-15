import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManualLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://breevo-backend.onrender.com/auth/manual-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail || "فشل تسجيل الدخول");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token); // ✅ تخزين التوكن
      localStorage.setItem("clientName", email); // ✅ حفظ اسم العميل
      localStorage.setItem("selected_site", "example.com"); // ✅ موقع افتراضي للتجاوز

      navigate("/analytics"); // ✅ التوجيه مباشرة إلى التحليلات
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تسجيل الدخول.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">تسجيل الدخول اليدوي</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          دخول
        </button>
      </form>
    </div>
  );
}