import React, { useEffect, useState } from "react";

export default function AnalyticsUTM() {
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_token");
    if (stored) {
      setTokenData(JSON.parse(stored));
      console.log("✅ بيانات UTM:", JSON.parse(stored));
    } else {
      console.error("❌ لا توجد بيانات UTM");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl mb-6">تحليلات UTM</h1>
      {tokenData ? (
        <pre className="bg-gray-800 p-4 rounded-lg">
          {JSON.stringify(tokenData, null, 2)}
        </pre>
      ) : (
        <p>لا توجد بيانات لعرضها</p>
      )}
    </div>
  );
}
