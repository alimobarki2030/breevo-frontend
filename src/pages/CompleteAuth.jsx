import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenData = urlParams.get("token_data");

    if (!tokenData) {
      console.error("❌ لا يوجد token_data في الرابط");
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(tokenData));
      localStorage.setItem("user_token", JSON.stringify(decoded));
      console.log("✅ تم حفظ بيانات المستخدم:", decoded);
      navigate("/site-selector");
    } catch (error) {
      console.error("❌ خطأ في فك تشفير التوكن:", error);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <p className="text-lg">🔄 جاري معالجة تسجيل الدخول...</p>
    </div>
  );
}
