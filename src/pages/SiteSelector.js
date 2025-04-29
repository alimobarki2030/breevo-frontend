import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SiteSelector() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("user_token"));
    if (!tokenData) {
      console.error("❌ لم يتم العثور على بيانات المستخدم");
      navigate("/complete-auth");
      return;
    }

    console.log("✅ بيانات التوكن:", tokenData);

    // هنا تستدعي API لجلب المواقع بناءً على التوكن
    // مؤقتًا حطينا بيانات وهمية
    setSites([
      { id: 1, url: "https://example1.com" },
      { id: 2, url: "https://example2.com" }
    ]);
  }, [navigate]);

  const handleSelect = () => {
    if (!selectedSite) return;
    localStorage.setItem("selected_site", selectedSite);
    navigate("/analytics");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl mb-4">اختر الموقع الذي ترغب بتحليله:</h1>
      <select
        className="w-full p-3 text-black rounded-lg mb-4"
        value={selectedSite}
        onChange={(e) => setSelectedSite(e.target.value)}
      >
        <option value="">-- اختر موقعك --</option>
        {sites.map((site) => (
          <option key={site.id} value={site.url}>
            {site.url}
          </option>
        ))}
      </select>
      <button
        onClick={handleSelect}
        className="bg-green-600 hover:bg-green-700 p-3 rounded-lg w-full"
      >
        التالي
      </button>
    </div>
  );
}
