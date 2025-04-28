import React from "react";
import { Circle } from "rc-progress";

const statusColor = {
  ممتاز: "bg-green-600",
  متوسط: "bg-yellow-500",
  ضعيف: "bg-red-500",
};

export default function SmartProductsGrid({ products = [], onAnalyze }) {
  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-500 font-semibold">
        لا توجد منتجات للعرض.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => {
        const seoScore = product.seoScore ?? 0;
        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-md transition-all p-4 flex flex-col justify-between border"
          >
            {/* العنوان */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-gray-500 text-xs mb-1">#{product.id}</div>
                <h2 className="font-bold text-sm text-gray-800 line-clamp-2">
                  {product.name || "اسم غير متوفر"}
                </h2>
              </div>

              <span
                className={`text-[11px] px-2 py-0.5 rounded-full text-white font-medium ${
                  statusColor[product.status] || "bg-gray-400"
                }`}
              >
                {product.status || "غير محدد"}
              </span>
            </div>

            {/* التقييم */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col text-xs text-gray-500">
                <span>تحديث: {product.lastUpdated || "-"}</span>
                <span>نسبة السيو:</span>
                <span className="text-gray-800 font-bold text-base">
                  {seoScore}%
                </span>
              </div>

              <div className="w-14 h-14">
                <Circle
                  percent={seoScore}
                  strokeWidth={6}
                  trailWidth={6}
                  strokeColor={
                    seoScore >= 80
                      ? "#22c55e"
                      : seoScore >= 50
                      ? "#facc15"
                      : "#ef4444"
                  }
                />
              </div>
            </div>

            <button
              onClick={() => onAnalyze(product)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl"
            >
              🔍 تحسين السيو
            </button>
          </div>
        );
      })}
    </div>
  );
}
