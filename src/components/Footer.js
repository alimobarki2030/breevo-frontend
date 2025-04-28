// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-gray-200 pt-6 pb-4 text-center text-sm text-gray-500 font-arabic">
      <div className="mb-2 font-semibold text-gray-700">SEO Analyzer</div>
      <div className="flex justify-center gap-4 flex-wrap text-xs mb-2 text-gray-600">
        <a href="/about" className="hover:text-gray-800">من نحن</a>
        <a href="/privacy" className="hover:text-gray-800">سياسة الخصوصية</a>
        <a href="/terms" className="hover:text-gray-800">الشروط والأحكام</a>
        <a href="/contact" className="hover:text-gray-800">تواصل معنا</a>
      </div>
      <div className="text-xs text-gray-400">
        © {new Date().getFullYear()} جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
