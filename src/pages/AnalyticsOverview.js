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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let selectedSite = localStorage.getItem("selected_site");

    if (!token) {
      alert("يرجى تسجيل الدخول أولاً.");
      navigate("/login");
      return;
    }

    // 👇 تجاوز الحاجة لاختيار الموقع يدويًا
    if (!selectedSite) {
      selectedSite = "example.com";
      localStorage.setItem("selected_site", selectedSite);
    }

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

    loadData();
  }, [navigate]);

  if (loading) return <div className="p-6">⏳ جاري تحميل البيانات...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-[#0f111a] text-white">
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">📊 تحليلات الموقع</h1>
            {/* محتوى التحليلات */}
          </div>
        </main>
      </div>
    </>
  );
}
