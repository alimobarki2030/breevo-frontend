import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SiteSelector() {
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("tokenData"));
    console.log("📤 إرسال tokenData إلى السيرفر:", tokenData);

    fetch("https://breevo-backend.onrender.com/google-auth/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_data: tokenData }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 الرد من السيرفر:", data);
        if (data.siteEntry) {
          setSites(data.siteEntry);
        } else {
          setError("⚠️ لا توجد مواقع متاحة أو حدث خطأ في تحميل المواقع.");
        }
      })
      .catch((e) => {
        console.error("❌ خطأ أثناء طلب المواقع:", e);
        setError("⚠️ فشل في تحميل المواقع.");
      });
  }, []);

  const handleSelect = (siteUrl, permissionLevel) => {
    const tokenData = JSON.parse(localStorage.getItem("tokenData"));

    // ✅ حفظ التوكن وربط الحساب
    localStorage.setItem("token", tokenData.access_token);
    localStorage.setItem("google_linked", "true");
    localStorage.setItem("selectedSite", siteUrl);
    localStorage.setItem("permissionLevel", permissionLevel);

    navigate("/analytics");
  };

  return (
    <div className="relative min-h-screen bg-[#0f111a] text-white font-arabic py-16 px-4 overflow-hidden">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🔗 اختر الموقع الذي تريد تحليله</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <ul className="space-y-4 mt-8">
          {sites.map((site, index) => (
            <li
              key={index}
              onClick={() => handleSelect(site.siteUrl, site.permissionLevel)}
              className="bg-white text-black p-4 rounded shadow hover:bg-gray-100 cursor-pointer transition-all"
            >
              <div className="font-semibold">{site.siteUrl}</div>
              <div className="text-sm text-gray-600">صلاحية: {site.permissionLevel}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
