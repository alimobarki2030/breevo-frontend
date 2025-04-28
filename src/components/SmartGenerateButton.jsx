import React from "react";

export default function SmartGenerateButton({ onClick, generating }) {
  return (
    <button
      onClick={onClick}
      disabled={generating}
      className={`text-sm px-4 py-2 rounded-xl transition font-medium shadow-sm whitespace-nowrap
        ${generating ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}
    >
      {generating ? "⏳ جارٍ التوليد..." : "✨ توليد ذكي"}
    </button>
  );
}
