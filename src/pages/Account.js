import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Account() {
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    const storedName = localStorage.getItem("clientName") || "اسم المستخدم";
    const storedEmail = localStorage.getItem("clientEmail") || "email@example.com";
    setUserData({ name: storedName, email: storedEmail });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
      <div className="max-w-screen-md mx-auto flex flex-col items-center">
        <img src="/logo2.png" alt="Logo" className="h-12 mb-6" />

      <Link
  to="/products"
  className="mb-6 text-sm text-[#83dcc9] hover:underline self-start"
>
  ← العودة إلى منتجاتي
</Link>


        <div className="bg-gray-900 rounded-xl shadow-lg p-8 space-y-6 w-full">
          <h2 className="text-3xl font-bold border-b border-gray-700 pb-4">حسابي</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">الاسم:</span>
              <span className="font-bold text-lg">{userData.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">البريد الإلكتروني:</span>
              <span className="font-bold text-lg">{userData.email}</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-xl font-semibold mb-2">الخطة الحالية</h3>
            <div className="bg-gray-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">الخطة:</p>
                <p className="text-lg font-bold">مجانية</p>
              </div>
              <button className="bg-[#83dcc9] text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-[#6cc9b9] transition">
                ترقية الخطة
              </button>
              <button
  onClick={() => {
    localStorage.clear();
    window.location.href = "/";
  }}
  className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold transition"
>
  تسجيل الخروج
</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}