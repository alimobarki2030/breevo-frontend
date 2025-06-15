import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // ✅ جلب بيانات المستخدم من localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const clientName = storedUser?.name || "العميل";

  const links = [
    { to: "/products", label: "منتجاتي" },
    { to: "/videos", label: "شروحات الفيديو" },
    { to: "/settings", label: "الإعدادات" },
  ];

  return (
    <aside className="w-64 bg-[#f4f8fb] text-slate-800 min-h-screen p-5 shadow-md hidden md:block">
      {/* ترحيب بالعميل */}
      <div className="text-sm mb-6 font-medium">
        👋 مرحباً، {clientName.split(" ")[0]}
      </div>

      {/* روابط التنقل */}
      <nav className="space-y-3">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`block px-4 py-2 rounded transition font-medium ${
              isActive(to) ? "bg-[#d1e7f5] text-sky-900" : "hover:bg-[#e8f3fa]"}`
            }
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
