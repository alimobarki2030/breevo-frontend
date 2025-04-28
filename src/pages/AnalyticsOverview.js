import { useEffect, useState } from "react";
import {
  fetchOverview,
  fetchTopQueries,
  fetchTopPages,
  fetchBacklinks,
} from "../api/analyticsAPI";

const AnalyticsOverview = () => {
  const [overview, setOverview] = useState(null);
  const [queries, setQueries] = useState([]);
  const [pages, setPages] = useState([]);
  const [backlinks, setBacklinks] = useState(null);
  const [days, setDays] = useState(30); // يمكن التبديل بين 7 أو 30

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetchOverview(token, days).then(setOverview).catch(console.error);
    fetchTopQueries(token, days).then(setQueries).catch(console.error);
    fetchTopPages(token, days).then(setPages).catch(console.error);
    fetchBacklinks(token).then(setBacklinks).catch(console.error);
  }, [token, days]);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setDays(7)}
          className={`px-3 py-1 rounded ${days === 7 ? "bg-black text-white" : "bg-gray-200"}`}
        >
          آخر 7 أيام
        </button>
        <button
          onClick={() => setDays(30)}
          className={`px-3 py-1 rounded ${days === 30 ? "bg-black text-white" : "bg-gray-200"}`}
        >
          آخر 30 يوم
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">نظرة عامة:</h2>
      {overview ? (
        <ul className="mb-4 space-y-1">
          <li>النقرات: {overview.clicks}</li>
          <li>الظهور: {overview.impressions}</li>
          <li>CTR: {overview.ctr.toFixed(2)}</li>
          <li>الترتيب: {overview.position.toFixed(2)}</li>
        </ul>
      ) : (
        <p>جاري تحميل نظرة عامة...</p>
      )}

      <h2 className="text-xl font-bold mb-2">أعلى الكلمات المفتاحية:</h2>
      {queries.map((q, idx) => (
        <div key={idx} className="border-b py-2">
          <div>🔑 {q.keys[0]}</div>
          <div className="text-sm text-gray-600">
            نقرات: {q.clicks} | ظهور: {q.impressions} | CTR: {Math.round(q.ctr * 100)}% | ترتيب: {q.position.toFixed(1)}
          </div>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-2">أهم الصفحات:</h2>
      {pages.map((p, idx) => (
        <div key={idx} className="border-b py-2">
          <div className="break-all">🔗 {p.page}</div>
          <div className="text-sm text-gray-600">
            نقرات: {p.clicks} | ظهور: {p.impressions}
          </div>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-2">عدد الروابط الخلفية (باك لينك):</h2>
      {backlinks !== null ? (
        <p className="text-lg">{backlinks.total_backlinks}</p>
      ) : (
        <p>جاري تحميل عدد الروابط...</p>
      )}
    </div>
  );
};

export default AnalyticsOverview;
