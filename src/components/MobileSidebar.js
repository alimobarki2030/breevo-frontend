import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function MobileSidebar({ isOpen, onClose }) {
  const location = useLocation();

  if (!isOpen) return null;

  const links = [
    { to: "/products", label: "منتجاتي" },
    { to: "/", label: "لوحة التحليلات" },
    { to: "/videos", label: "شروحات الفيديو" },
    { to: "/settings", label: "الإعدادات" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden">
      <div className="w-64 bg-white h-full shadow-lg p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">القائمة</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
            aria-label="إغلاق القائمة"
          >
            ×
          </button>
        </div>

        <nav className="space-y-3">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`block text-sm px-4 py-2 rounded transition ${
                location.pathname === to ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}