import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("token_data");
      const decoded = decodeURIComponent(raw);
      const tokenData = JSON.parse(decoded);

      localStorage.setItem("tokenData", JSON.stringify(tokenData));

      // ✅ الانتقال إلى صفحة اختيار الموقع أو مباشرة إلى التحليلات
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ فشل في تحليل بيانات OAuth:", error);
    }
  }, []);

  return (
    <div className="text-white h-screen flex items-center justify-center font-arabic text-lg">
      ⏳ جاري تجهيز حسابك من Google...
    </div>
  );
}


