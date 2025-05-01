import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../api/analyticsAPI';

const Dashboard = () => {
  const [topQueries, setTopQueries] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const payload = {
    token_data: {
      refresh_token: 'your_refresh_token',
      client_id: 'your_client_id',
      client_secret: 'your_client_secret',
      token_uri: 'https://oauth2.googleapis.com/token'
    },
    site_url: 'https://example.com',
    days: 30
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queriesRes = await fetch(`${BASE_URL}/analytics/top-queries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const queriesData = await queriesRes.json();
        setTopQueries(queriesData);

        const pagesRes = await fetch(`${BASE_URL}/analytics/top-pages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const pagesData = await pagesRes.json();
        setTopPages(pagesData);

        const overviewRes = await fetch(`${BASE_URL}/analytics/overview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const overviewData = await overviewRes.json();
        setOverview(overviewData);

        setLoading(false);
      } catch (error) {
        console.error('خطأ أثناء جلب البيانات:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>جارٍ تحميل البيانات...</div>;
  }

  return (
    <div>
      <h1>لوحة التحكم</h1>

      <section>
        <h2>أفضل الكلمات المفتاحية</h2>
        <ul>
          {topQueries.map((query, index) => (
            <li key={index}>{query.keyword} - {query.clicks} نقرة</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>أفضل الصفحات</h2>
        <ul>
          {topPages.map((page, index) => (
            <li key={index}>{page.url} - {page.impressions} ظهور</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>نظرة عامة</h2>
        <p>النقرات الإجمالية: {overview.totalClicks}</p>
        <p>الظهور الإجمالي: {overview.totalImpressions}</p>
      </section>
    </div>
  );
};

export default Dashboard;
