// src/pages/AnalyticsOverview.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchWithAuth } from "../api/analyticsAPI";

export default function AnalyticsOverview() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [queries, setQueries] = useState([]);
  const [pages, setPages] = useState([]);
  const [backlinks, setBacklinks] = useState(null);
  const [days, setDays] = useState(30);
  const [isLinkedToGoogle, setIsLinkedToGoogle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const selectedSite = localStorage.getItem("selected_site");

  useEffect(() => {
    if (!token) {
      alert("يرجى تسجيل الدخول أولاً.");
      navigate("/login");
      return;
    }
    if (!selectedSite) {
      alert("يرجى اختيار الموقع أولاً.");
      navigate("/site-selector");
      return;
    }

    const linked = localStorage.getItem("google_linked") === "true";
    setIsLinkedToGoogle(linked);

    const loadData = async () => {
      try {
        setLoading(true);
        const overviewData = await fetchWithAuth(`/analytics/overview?site=${encodeURIComponent(selectedSite)}`);
        const queriesData = await fetchWithAuth(`/analytics/top-queries?site=${encodeURIComponent(selectedSite)}`);
        const pagesData = await fetchWithAuth(`/analytics/top-pages?site=${encodeURIComponent(selectedSite)}`);
        const backlinksData = await fetchWithAuth(`/analytics/backlinks?site=${encodeURIComponent(selectedSite)}`);

        setOverview(overviewData);
        setQueries(queriesData);
        setPages(pagesData);
        setBacklinks(backlinksData.count || 0);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    if (linked) {
      loadData();
    }
  }, [token, days, navigate, selectedSite]);

  if (loading) return <div className="p-6">⏳ جاري تحميل البيانات...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-[#0f111a] text-white">
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">📊 تحليلات {selectedSite}</h1>
              <div className="space-x-2">
                <button onClick={() => setDays(7)} className={`px-3 py-1 rounded ${days === 7 ? 'bg-black text-white' : 'bg-white border'}`}>7 أيام</button>
                <button onClick={() => setDays(30)} className={`px-3 py-1 rounded ${days === 30 ? 'bg-black text-white' : 'bg-white border'}`}>30 يوم</button>
              </div>
            </div>

            {!isLinkedToGoogle ? (
              <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg shadow mb-10">
                <p className="mb-3 text-lg">🚫 لم تقم بربط حسابك مع Google بعد.</p>
                <button onClick={() => window.location.href = "https://breevo-backend.onrender.com/google-auth/login"} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">ربط Google الآن</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="font-semibold mb-2">النقرات:</h2>
                  <p>{overview?.clicks ?? "لا توجد بيانات"}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="font-semibold mb-2">الظهور:</h2>
                  <p>{overview?.impressions ?? "لا توجد بيانات"}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="font-semibold mb-2">عدد الروابط الخلفية (باك لينك):</h2>
                  <p>{backlinks ?? "لا توجد بيانات"}</p>
                </div>
                <div className="bg-white p-4 rounded shadow col-span-full">
                  <h2 className="font-semibold mb-3">أعلى الكلمات المفتاحية:</h2>
                  {queries.length > 0 ? (
                    <table className="w-full text-right border">
                      <thead className="bg-gray-100 text-sm font-bold">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">الكلمة</th>
                          <th className="p-2">النقرات</th>
                          <th className="p-2">الظهور</th>
                          <th className="p-2">CTR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queries.map((q, i) => (
                          <tr key={i} className="border-t text-sm">
                            <td className="p-2">{i + 1}</td>
                            <td className="p-2">{q.keys[0]}</td>
                            <td className="p-2">{q.clicks}</td>
                            <td className="p-2">{q.impressions}</td>
                            <td className="p-2">{(q.ctr * 100).toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>جاري تحميل الكلمات...</p>
                  )}
                </div>
                <div className="bg-white p-4 rounded shadow col-span-full">
                  <h2 className="font-semibold mb-3">أهم الصفحات:</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {pages.length > 0 ? pages.map((p, i) => (
                      <li key={i}>{p.page} ({p.clicks} نقرات)</li>
                    )) : <li>جاري تحميل الصفحات...</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
