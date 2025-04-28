import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [queries, setQueries] = useState([]);
  const [pages, setPages] = useState([]);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const tokenDataRaw = localStorage.getItem('tokenData');
const tokenData = tokenDataRaw ? JSON.parse(tokenDataRaw) : null;

  const siteUrl = localStorage.getItem('selectedSite');

  useEffect(() => {
    if (!tokenData || !siteUrl) {
      setError("❌ بيانات الموقع أو التوكن مفقودة");
      return;
    }

    const payload = {
      token_data: tokenData,
      site_url: siteUrl,
      days: 30
    };

    // استدعاء top-queries
    fetch('http://localhost:8000/analytics/top-queries', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => setQueries(data.top_queries || []))
    .catch(err => setError("فشل تحميل الكلمات المفتاحية"));

    // استدعاء top-pages
    fetch('http://localhost:8000/analytics/top-pages', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => setPages(data.top_pages || []))
    .catch(err => setError("فشل تحميل الصفحات"));

    // استدعاء overview
    fetch('http://localhost:8000/analytics/overview', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => setOverview(data))
    .catch(err => setError("فشل تحميل الملخص"));

  }, []);

  return (
    <div className="p-10 text-white bg-[#10141e] min-h-screen font-arabic">
      <h1 className="text-3xl font-bold mb-6">📊 لوحة تحكم Google Search Console</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 p-5 rounded-xl shadow">نقرات: {overview.clicks}</div>
          <div className="bg-gray-800 p-5 rounded-xl shadow">الظهور: {overview.impressions}</div>
          <div className="bg-gray-800 p-5 rounded-xl shadow">CTR: {overview.ctr}%</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">🔍 أفضل الكلمات المفتاحية</h2>
          <ul className="space-y-2">
            {queries.map((q, i) => (
              <li key={i} className="bg-gray-800 p-4 rounded">{q.keys?.[0]} — {q.clicks} نقرات</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">📄 أفضل الصفحات</h2>
          <ul className="space-y-2">
            {pages.map((p, i) => (
              <li key={i} className="bg-gray-800 p-4 rounded">{p.keys?.[0]} — {p.clicks} نقرات</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
