import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const encoded = query.get("token_data");

    try {
      const decoded = decodeURIComponent(encoded);
      const tokenData = JSON.parse(decoded);
      console.log("✅ token_data المستلمة:", tokenData);

      // حفظ التوكن في localStorage
      localStorage.setItem("tokenData", JSON.stringify(tokenData));

      // ✅ التوجيه إلى صفحة اختيار الموقع
      setTimeout(() => {
        navigate("/site-selector");
      }, 200);
    } catch (e) {
      console.error("❌ فشل في قراءة token_data:", e);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex items-center justify-center">
      <p className="text-lg">🚀 جاري تجهيز حسابك وتحميل مواقعك من Google...</p>
    </div>
  );
}
