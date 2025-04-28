import React, { useEffect, useState } from "react";

export default function AnalyticsOverview() {
  const [overviewData, setOverviewData] = useState(null);
  const [topQueries, setTopQueries] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [backlinks, setBacklinks] = useState([]);
  const [utmCampaigns, setUtmCampaigns] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        const [overviewRes, queriesRes, pagesRes, backlinksRes, ga4Res] = await Promise.all([
          fetch("http://localhost:8000/analytics/overview", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/analytics/top-queries", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/analytics/top-pages", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/analytics/backlinks", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/analytics/ga4/utm-summary", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const [overviewData, queriesData, pagesData, backlinksData, ga4Data] = await Promise.all([
          overviewRes.json(),
          queriesRes.json(),
          pagesRes.json(),
          backlinksRes.json(),
          ga4Res.json()
        ]);

        setOverviewData(overviewData);
        setTopQueries(queriesData.top_queries || []);
        setTopPages(pagesData.top_pages || []);
        setBacklinks(backlinksData.backlinks || []);
        setUtmCampaigns(ga4Data.utm_campaigns || []);
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 text-white bg-[#0f111a] min-h-screen">
      <h1 className="text-2xl font-bold">📊 تحليلات Google لموقعك</h1>

      {/* نظرة عامة */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">النقرات</h2>
          <p className="text-3xl">{overviewData?.clicks ?? "—"}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">الظهور</h2>
          <p className="text-3xl">{overviewData?.impressions ?? "—"}</p>
        </div>
      </div>

      {/* الكلمات المفتاحية */}
      <div className="bg-gray-800 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🔥 أفضل الكلمات المفتاحية</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          {topQueries.map((q, idx) => (
            <li key={idx} className="border-b border-gray-700 pb-1">
              <strong>{q.keys.join(" ")}</strong> – نقرات: {q.clicks} – ظهور: {q.impressions}
            </li>
          ))}
        </ul>
      </div>

      {/* الصفحات الأعلى ظهورًا */}
      <div className="bg-gray-800 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🌐 الصفحات الأعلى ظهورًا</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          {topPages.map((page, idx) => (
            <li key={idx} className="border-b border-gray-700 pb-1">
              <span>{page.page}</span> – نقرات: {page.clicks} – ظهور: {page.impressions}
            </li>
          ))}
        </ul>
      </div>

      {/* الباك لينكات */}
      <div className="bg-gray-800 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">🔗 روابط الباك لينك</h2>
        <ul className="space-y-1 text-sm text-gray-300">
          {backlinks.map((link, idx) => (
            <li key={idx}>{link}</li>
          ))}
        </ul>
      </div>

      {/* حملات UTM من GA4 */}
      <div className="bg-gray-800 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">📈 حملات UTM من Google Analytics</h2>
        {utmCampaigns.length === 0 ? (
          <p className="text-gray-400 text-sm">لا توجد بيانات حملات حتى الآن.</p>
        ) : (
          <ul className="text-sm text-gray-300 space-y-1">
            {utmCampaigns.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b border-gray-700 pb-1">
                <span>🎯 {item.campaign || "—"} ({item.source})</span>
                <span className="text-[#83dcc9]">الجلسات: {item.sessions}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
