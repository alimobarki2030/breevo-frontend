import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CompleteAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenData = searchParams.get("token");

    if (tokenData) {
      try {
        // تحقق أن التوكن يحمل البنية الصحيحة (3 أجزاء مفصولة بنقاط)
        if (tokenData.split(".").length !== 3) {
          throw new Error("الـ token غير صالح");
        }

        const decoded = jwtDecode(tokenData);
        localStorage.setItem("token", tokenData);
        localStorage.setItem("clientName", decoded.email);
        localStorage.setItem("google_linked", "true");
        

        console.log("✅ تم تسجيل الدخول عبر Google:", decoded);
        navigate("/site-selector");

      } catch (error) {
        console.error("❌ خطأ في فك تشفير التوكن:", error);
        navigate("/error-auth");
      }
    } else {
      console.error("❌ لم يتم العثور على توكن في رابط العودة");
      navigate("/error-auth");
    }
  }, [navigate]);

  return <div>جاري إكمال تسجيل الدخول...</div>;
};

export default CompleteAuth;
