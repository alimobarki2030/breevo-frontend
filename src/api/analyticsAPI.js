export const BASE_URL = "https://breevo-backend.onrender.com";


// 🔍 نظرة عامة: النقرات + الظهور
export async function fetchOverview(token, days = 30) {
  const res = await fetch(`${BASE_URL}/analytics/overview`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ days }),
  });
  return await res.json();
}

// 🔑 الكلمات المفتاحية
export async function fetchTopQueries(token, days = 30) {
  const res = await fetch(`${BASE_URL}/analytics/top-queries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ days }),
  });
  return await res.json();
}

// 🌐 الصفحات الأعلى ظهورًا
export async function fetchTopPages(token, days = 30) {
  const res = await fetch(`${BASE_URL}/analytics/top-pages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ days }),
  });
  return await res.json();
}

// 🔗 روابط الباك لينك
export async function fetchBacklinks(token) {
  const res = await fetch(`${BASE_URL}/analytics/backlinks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

// 📈 بيانات UTM من GA4
export async function fetchUtmSummary(token, property_id, days = 30) {
  const res = await fetch(`${BASE_URL}/analytics/ga4/utm-summary`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ property_id, days }),
  });
  return await res.json();
}
