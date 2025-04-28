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

// Tabs helper
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-t-lg font-medium transition-all duration-200 ${
      isActive ? "bg-white border-t border-l border-r" : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

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
      fetch(`http://localhost:8000/product/${id}`)
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

  const handleGenerateSEO = async () => {
    setGenerating(true);
    try {
      const generatedFields = await generateAllFields(product);
      setProduct((prev) => ({ ...prev, ...generatedFields }));
      toast.success("✅ تم التوليد الذكي بنجاح");
    } catch (e) {
      console.error("❌ فشل التوليد الشامل:", e);
      toast.error("❌ فشل التوليد الشامل");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateField = async (field) => {
    setFieldLoading(field);
    try {
      const value = await generateSingleField(field, product);
      setProduct((prev) => ({ ...prev, [field]: value }));
      toast.success(`✅ تم توليد ${field} بنجاح`);
    } catch (e) {
      console.error(`❌ فشل توليد ${field}:`, e);
      toast.error(`❌ فشل توليد ${field}`);
    } finally {
      setFieldLoading("");
    }
  };

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
          ? "http://localhost:8000/product/"
          : `http://localhost:8000/product/${product.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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
      toast.success("✅ تم حفظ المنتج بنجاحك!");
    } catch (err) {
      console.error("❌ خطأ في الحفظ:", err);
      toast.error("❌ حدث خطأ أثناء الحفظ");
    }
  };

  const renderField = (label, key, multiline = false) => (
    <div className="relative bg-white p-4 rounded-2xl shadow border space-y-2">
      <label className="text-sm text-gray-600 font-semibold">{label}</label>
      {multiline ? (
        <textarea
          placeholder={`أدخل ${label.toLowerCase()}`}
          value={product[key] || ""}
          onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
          className="p-3 border rounded w-full resize-y min-h-[100px]"
        />
      ) : (
        <input
          type="text"
          placeholder={`أدخل ${label.toLowerCase()}`}
          value={product[key] || ""}
          onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
          className="p-2 border rounded w-full pr-10"
        />
      )}
      <button
        onClick={() => handleGenerateField(key)}
        className="absolute top-2 left-2 w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shadow-md"
        disabled={fieldLoading === key}
        title="توليد ذكي لهذا الحقل"
      >
        {fieldLoading === key ? "⏳" : "⚙️"}
      </button>
    </div>
  );

  const renderGoogleSnippet = () => (
    <div className="bg-white p-6 rounded-2xl shadow border space-y-2">
      <h3 className="text-md font-semibold text-gray-700">🔎 معاينة Google Snippet</h3>
      <div className="space-y-1 text-sm">
        <p className="text-blue-700 underline">www.domain.com/{product.url_path || "product-url"}</p>
        <p className="text-green-800 font-bold">{product.meta_title || "عنوان السيو للمنتج"}</p>
        <p className="text-gray-700">{product.meta_description || "وصف الميتا سيظهر هنا بمجرد توليده أو كتابته يدوياً"}</p>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <main className="flex-1 p-6">
          <div className="max-w-screen-xl mx-auto">
          <div className="flex gap-2 mb-4 border-b">
            <TabButton label="✍️ التعديل" isActive={activeTab === "editor"} onClick={() => setActiveTab("editor")} />
            <TabButton label="🔍 معاينة Google" isActive={activeTab === "snippet"} onClick={() => setActiveTab("snippet")} />
          </div>

          {activeTab === "editor" ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <section className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-green-700">بيانات المنتج</h2>
                  <div className="flex gap-2 flex-wrap items-center">
                    {lastSaved && (
                      <span className="text-xs text-gray-500 italic">🕒 آخر حفظ: {lastSaved}</span>
                    )}
                    <SmartGenerateButton onClick={handleGenerateSEO} generating={generating} />
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    >
                      💾 حفظ
                    </button>
                  </div>
                </div>

                {renderField("📌 عنوان المنتج", "name")}

                <div className="relative bg-white p-4 rounded-2xl shadow border space-y-2">
                  <label className="text-sm text-gray-600 font-semibold">📝 وصف المنتج</label>
                  <TiptapEditor
                    value={product.description}
                    onChange={(val) => setProduct({ ...product, description: val })}
                  />
                  <button
                    onClick={() => handleGenerateField("description")}
                    className="absolute top-2 left-2 w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shadow-md"
                    disabled={fieldLoading === "description"}
                    title="توليد ذكي لهذا الحقل"
                  >
                    {fieldLoading === "description" ? "⏳" : "⚙️"}
                  </button>
                </div>

                {renderField("🔑 الكلمة المفتاحية", "keyword")}
                {renderField("🌐 عنوان السيو", "meta_title")}
                {renderField("🧠 وصف الميتا", "meta_description", true)}
                {renderField("🖼️ النص البديل للصورة", "imageAlt")}
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-green-700">مؤشرات السيو</h2>
                  <div className="text-sm text-gray-600">نسبة التقدم: {progress}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <ul className="space-y-2">
                  {Array.isArray(score) && score.length > 0 ? (
                    score.map((item, i) => (
                      <li
                        key={i}
                        className={`p-3 rounded-lg border text-sm ${
                          item.status === "pass"
                            ? "bg-green-50 border-green-300 text-green-800"
                            : "bg-red-50 border-red-300 text-red-800"
                        }`}
                      >
                        {item.status === "pass" ? "✅ " : "❌ "}
                        {item.text}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">لا توجد نتائج تحليل بعد</li>
                  )}
                </ul>

                <div className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded-xl">
                  <h3 className="text-md font-semibold text-yellow-700 mb-2">📌 توصيات مهمة لتنفيذها في متجرك</h3>
                  <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                    <li>تأكد من وجود <strong>رابط داخلي</strong> داخل وصف المنتج يشير إلى منتج أو تصنيف آخر.</li>
                    <li>قم بإضافة <strong>رابط خارجي</strong> لمصدر موثوق إن أمكن.</li>
                    <li>تضمين الكلمة المفتاحية في <strong>نص ALT للصورة</strong> يعزز من فاعلية السيو.</li>
                    <li>يمكن استبدال عبارة "فوائد المنتج" بـ <strong>"فوائد {product.keyword || product.name}"</strong> لجعل النص أكثر صلة بالكلمة المفتاحية.</li>
                  </ul>
                </div>
              </section>
            </div>
          ) : renderGoogleSnippet()}
                  </div>
        </main>
      </div>
    </>
  );
}