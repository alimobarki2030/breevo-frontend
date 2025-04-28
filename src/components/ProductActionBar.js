// ProductActionBar.jsx
import React from "react";

export default function ProductActionBar({ onGenerate, onSave }) {
  return (
    <div className="w-full flex justify-end items-center bg-white px-6 py-3 shadow rounded-2xl mb-6">
      <button
        onClick={onGenerate}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl mx-2"
      >
        🔍 توليد ذكي
      </button>
      <button
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
      >
        💾 حفظ
      </button>
    </div>
  );
}
