import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SiteSelector() {
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("tokenData"));
    console.log("📤 إرسال tokenData إلى السيرفر:", tokenData);

    fetch("http://localhost:8000/google-auth/sites", {
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
    localStorage.setItem("selectedSite", siteUrl);
    localStorage.setItem("permissionLevel", permissionLevel);
    navigate("/analytics");
  };

  return (
    <div className="relative min-h-screen bg-[#0f111a] text-white font-arabic py-16 px-4 overflow-hidden">
      {/* خلفية SVG خفيفة في الأسفل */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-no-repeat bg-bottom opacity-5"
        style={{ backgroundImage: "url('https://www.svgrepo.com/show/382106/global-earth.svg')", backgroundSize: "300px", backgroundPosition: "center" }}>
      </div>

      {/* محتوى مركزي */}
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold mb-10 flex items-center justify-center gap-2">
          <span role="img" aria-label="globe">🌍</span> اختر موقعك من Google Search Console
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-5 rounded-2xl shadow-xl hover:shadow-2xl transition border border-gray-700"
            >
              <p className="text-md font-semibold text-white truncate mb-1">
                {site.siteUrl}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                صلاحية: {site.permissionLevel}
              </p>
              <button
                onClick={() => handleSelect(site.siteUrl, site.permissionLevel)}
                className="bg-[#83dcc9] text-black font-bold w-full py-2 rounded-xl hover:bg-[#6ac6b3] transition"
              >
                اختر هذا الموقع
              </button>
            </div>
          ))}
        </div>

        {/* توقيع خفيف في الأسفل */}
        <p className="text-center text-xs text-gray-600 mt-16">🚀 منصتك الذكية للبيانات تبدأ من هنا</p>
      </div>
    </div>
  );
}