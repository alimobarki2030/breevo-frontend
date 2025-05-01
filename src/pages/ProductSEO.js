import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateProductSEO } from "../utils/generateProductSEO";
import analyzeSEO from "../analyzeSEO";
import TiptapEditor from "../components/TiptapEditor";
import SmartGenerateButton from "../components/SmartGenerateButton";
import { generateAllFields } from "../utils/generateFields";
import { generateSingleField } from "../utils/generateSingleField";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from '../api/analyticsAPI'; // ✅ أضفنا الاستيراد

export default function ProductSEO() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [score, setScore] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [fieldLoading, setFieldLoading] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");

  const location = useLocation();
  const passedProduct = location.state?.product;

  useEffect(() => {
    if (passedProduct) {
      setProduct(passedProduct);
    } else {
      fetch(`${BASE_URL}/product/${id}`) // ✅ عدّلنا الرابط هنا
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id]);

  useEffect(() => {
    const result = analyzeSEO(product);
    setScore(result.checks);
  }, [product]);

  const progress = score.length
    ? Math.round((score.filter((s) => s.status === "pass").length / score.length) * 100)
    : 0;

  const handleSave = async () => {
    const scoreResult = analyzeSEO(product);
    const passedCount = scoreResult.checks.filter((s) => s.status === "pass").length;
    const seoScore = Math.round((passedCount / scoreResult.checks.length) * 100);

    setProduct((prev) => ({ ...prev, seoScore }));

    const isNew = !product.id;

    const payload = {
      keyword: product.keyword || "",
      name: product.name || "",
      description: product.description || "",
      seo_title: product.meta_title || "",
      seo_url: product.url_path || "",
      meta_description: product.meta_description || "",
      imageAlt: product.imageAlt || "",
      status: product.status || "جديد",
      seoScore: seoScore || 0,
    };

    try {
      const res = await fetch(
        isNew
          ? `${BASE_URL}/product/` // ✅ عدّلنا الرابط هنا
          : `${BASE_URL}/product/${product.id}`, // ✅ وهنا
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("فشل الحفظ");

      const result = await res.json();

      if (isNew && result.product?.id) {
        setProduct((prev) => ({
          ...prev,
          id: result.product.id,
        }));
      }

      setLastSaved(new Date().toLocaleString());
      toast.success("✅ تم حفظ المنتج بنجاح!");
    } catch (err) {
      console.error("❌ خطأ في الحفظ:", err);
      toast.error("❌ حدث خطأ أثناء الحفظ");
    }
  };

  // ... باقي الكود بدون تعديل (سيظل كما هو)
}
