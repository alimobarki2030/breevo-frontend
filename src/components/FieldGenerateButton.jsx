import React from "react";

export default function FieldGenerateButton({
  onClick,
  loading,
  title = "توليد ذكي لهذا الحقل",
  position = "absolute top-2 left-2",
}) {
  const handleClick = () => {
    console.log("📤 تم الضغط على زر التوليد الجزئي");
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title={title}
      className={`
        ${position} w-8 h-8 text-xs rounded-full 
        flex items-center justify-center shadow 
        transition duration-200 z-10
        ${loading 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-blue-500 hover:bg-blue-600 text-white"}
      `}
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        "⚙️"
      )}
    </button>
  );
}
