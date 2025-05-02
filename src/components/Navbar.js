import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const storedName = localStorage.getItem("clientName");
  const clientName = storedName ? `مرحبًا، ${storedName}` : "مرحبًا، ضيف";
  const selectedSite = localStorage.getItem("selected_site");

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="bg-gray-950 text-white py-4 px-6 shadow-sm border-b border-gray-800">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo2.png" alt="Logo" className="h-9" />
          {selectedSite && (
            <span className="ml-4 text-sm bg-green-600 px-3 py-1 rounded-full">
              {selectedSite}
            </span>
          )}
        </div>

        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li>
            <Link to="/analytics" className="hover:text-[#83dcc9] transition">التحليلات</Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-[#83dcc9] transition">منتجاتي</Link>
          </li>
          <li>
            <Link to="/videos" className="hover:text-[#83dcc9] transition">شروحات الفيديو</Link>
          </li>
        </ul>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-[#83dcc9] text-gray-900 flex items-center justify-center font-bold hover:opacity-90"
          >
            {clientName.charAt(0)}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold">{clientName}</p>
                {selectedSite && <p className="text-xs text-gray-600">{selectedSite}</p>}
              </div>
              <Link
                to="/account"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                حسابي
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
