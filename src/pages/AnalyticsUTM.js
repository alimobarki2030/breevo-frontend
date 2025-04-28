import React, { useEffect, useState } from "react";
import { fetchUtmSummary } from "../api/analyticsAPI";

export default function AnalyticsUTM() {
  const [utmData, setUtmData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("tokenData"));
    if (!tokenData) {
      setError("⚠️ يرجى تسجيل الدخول أولاً.");
      return;
    }

    fetch("https://breevo-backend.onrender.com/google-auth/analytics-properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_data: tokenData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.properties) {
          setProperties(data.properties);
        } else {
          setError("⚠️ لم يتم العثور على حسابات Google Analytics.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("❌ خطأ أثناء جلب الحسابات.");
      });
  }, []);

  const fetchUTMData = (propertyId) => {
    const tokenData = JSON.parse(localStorage.getItem("tokenData"));
    const accessToken = tokenData?.access_token;
    setLoading(true);
    setError(null);

    fetchUtmSummary(accessToken, propertyId, 30)
      .then((data) => {
        if (data.utm_performance) {
          setUtmData(data.utm_performance);
        } else {
          setError("⚠️ لا توجد بيانات لحملات UTM.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("❌ خطأ أثناء جلب بيانات الحملة.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-10 font-arabic">
      <h1 className="text-2xl font-bold mb-6">📈 أداء حملات UTM</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {properties.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm mb-2">اختر حساب Google Analytics:</label>
          <select
            onChange={(e) => {
              setSelectedProperty(e.target.value);
              fetchUTMData(e.target.value);
            }}
            className="bg-gray-800 text-white p-2 rounded w-full border border-gray-700"
            value={selectedProperty}
          >
            <option value="">-- اختر الحساب --</option>
            {properties.map((p, index) => (
              <option key={index} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading && <p className="text-gray-400">جاري تحميل البيانات...</p>}

      {!loading && utmData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700 rounded-xl">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="p-3">المصدر</th>
                <th className="p-3">الحملة</th>
                <th className="p-3">صفحة الوصول</th>
                <th className="p-3">عدد الزيارات</th>
                <th className="p-3">التحويلات</th>
              </tr>
            </thead>
            <tbody>
              {utmData.map((item, index) => (
                <tr key={index} className="border-t border-gray-700 hover:bg-gray-900">
                  <td className="p-3">{item.source || "-"}</td>
                  <td className="p-3">{item.campaign || "-"}</td>
                  <td className="p-3">{item.landing_page || "-"}</td>
                  <td className="p-3">{item.sessions}</td>
                  <td className="p-3">{item.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
