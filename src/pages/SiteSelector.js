import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SiteSelector() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/manual-login");
      return;
    }

    async function fetchSites() {
      try {
        const res = await fetch("https://breevo-backend.onrender.com/sites", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("فشل في جلب المواقع");
        }

        const data = await res.json();
        setSites(data);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل المواقع.");
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, [navigate]);

  const handleSelectSite = (site) => {
    localStorage.setItem("selected_site", site.name);
    navigate("/analytics");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">🔄 جاري تحميل المواقع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">اختر الموقع للعمل عليه</h2>
        <ul className="space-y-2">
          {sites.map((site) => (
            <li key={site.id}>
              <button
                onClick={() => handleSelectSite(site)}
                className="w-full text-right px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {site.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
