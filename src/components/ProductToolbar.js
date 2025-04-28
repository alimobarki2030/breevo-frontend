import React from "react";

export default function ProductToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  itemsPerPage,
  setItemsPerPage,
  totalCount,
  averageScore,
  onAddProduct,
  statusCounts = { ممتاز: 0, متوسط: 0, ضعيف: 0 }, // ✅ استخدمنا فقط نسخة واحدة مع القيمة الافتراضية
}) {
  const scoreColor =
    averageScore >= 80 ? "bg-green-600" : averageScore >= 50 ? "bg-yellow-400" : "bg-red-500";
  const scoreIcon =
    averageScore >= 80 ? "🟢" : averageScore >= 50 ? "🟡" : "🔴";

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("الكل");
    setItemsPerPage(8);
  };

  const hasChanges = searchQuery !== "" || statusFilter !== "الكل" || itemsPerPage !== 8;

  const statuses = [
    { label: "الكل", color: "bg-gray-200 text-gray-700", count: totalCount },
    { label: "ممتاز", color: "bg-green-100 text-green-700", count: statusCounts.ممتاز },
    { label: "متوسط", color: "bg-yellow-100 text-yellow-700", count: statusCounts.متوسط },
    { label: "ضعيف", color: "bg-red-100 text-red-700", count: statusCounts.ضعيف },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-6 justify-between items-center border">
      {/* العنوان والفلاتر */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-green-700">
          منتجاتك <span className="text-gray-500">({totalCount})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {statuses.map(({ label, color, count }) => (
            <button
              key={label}
              onClick={() => setStatusFilter(label)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                statusFilter === label
                  ? `${color} border-blue-600 ring-2 ring-blue-200`
                  : `${color} border border-transparent hover:ring-1 hover:ring-blue-100`
              }`}
            >
              {label} ({count})
            </button>
          ))}
          {hasChanges && (
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 bg-blue-100 hover:bg-blue-200 transition px-3 py-1 rounded-full font-medium"
            >
              🔄 إعادة تعيين
            </button>
          )}
        </div>
      </div>

      {/* متوسط التقييم */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>التقييم</span>
          <div className={`px-3 py-1 rounded-full text-white text-xs ${scoreColor}`}>
            {Math.round(averageScore)}%
          </div>
          <span>{scoreIcon}</span>
        </div>
      </div>

      {/* البحث + زر الإضافة */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          <label className="text-sm text-gray-600">عدد/صفحة:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 rounded border text-sm"
          >
            <option value={8}>8</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 ابحث باسم المنتج..."
          className="p-2 border rounded w-60 text-sm"
        />

        {onAddProduct && (
          <button
            onClick={onAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition duration-200"
          >
            ➕ أضف منتج يدوي
          </button>
        )}
      </div>
    </div>
  );
}
