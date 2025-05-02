// src/pages/CompleteAuth.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenData = urlParams.get("token");

    if (!tokenData) {
      console.error("❌ لا يوجد token_data في الرابط");
      navigate("/error-auth");
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(tokenData));
      localStorage.setItem("token", decoded.access_token);
      localStorage.setItem("clientName", decoded.email);
      localStorage.setItem("google_linked", "true");

      console.log("✅ تم تسجيل الدخول عبر Google:", decoded);
      navigate("/site-selector");

    } catch (error) {
      console.error("❌ خطأ في فك تشفير التوكن:", error);
      navigate("/error-auth");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <p className="text-lg">🔄 جاري معالجة تسجيل الدخول...</p>
    </div>
  );
}
