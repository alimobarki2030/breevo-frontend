import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function ProductAnalyze() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  

  if (!product) {
    return (
      <div className="text-center text-red-600 font-bold mt-10">
        لم يتم تمرير بيانات المنتج.
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          عودة للمنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-800">
        تحليل منتج: {product.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            نبذة عن المنتج
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {product.description || "لا يوجد وصف"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            مواصفات مهمة
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>عنوان المنتج: {product.name}</li>
            <li>الحالة: {product.status || "-"}</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          عودة إلى منتجاتي
        </button>
      </div>
    </div>
  );
}