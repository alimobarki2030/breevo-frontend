import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { generateProductSEO } from "../utils/generateProductSEO";
import analyzeSEO from "../analyzeSEO";
import TiptapEditor from "../components/TiptapEditor";

export default function ProductSEO() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [score, setScore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [fieldLoading, setFieldLoading] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState(null);

  const location = useLocation();
  const passedProduct = location.state?.product;

  useEffect(() => {
    if (passedProduct) {
      setProduct(passedProduct);
    } else {
      fetch(`http://localhost:8000/product/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
        });
    }
  }, [id]);

  useEffect(() => {
    const result = analyzeSEO(product);
    setScore(result.checks);
  }, [
    product.name,
    product.description,
    product.keyword,
    product.meta_title,
    product.meta_description,
    product.url_path,
    product.imageAlt,
  ]);

  const handleEditAnalysis = (key, value) => {
    setProductAnalysis((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalyzeProduct = async () => {
    setGenerating(true);
    try {
      const keywordPrompt = `أنت خبير SEO. استخرج الكلمة المفتاحية الأنسب بناءً على اسم المنتج:
  اسم المنتج: ${product.name}
  أعطني فقط الكلمة المفتاحية المناسبة دون أي شرح أو إضافات.`;
      const keyword = (await generateProductSEO(keywordPrompt)).trim();
  
      const analysisPrompt = `
  أنت خبير تسويق وتحليل منتجات.
  مطلوب منك تحليل المنتج التالي واستخراج هذه البيانات فقط بصيغة JSON:
  {
    "category": "",
    "target_audience": "",
    "tone": "",
    "best_story_arc": ""
  }
  🔹 اسم المنتج: ${product.name}
  🔹 الوصف الحالي: ${product.description}
  🎯 أعد فقط JSON النتيجة بدون شرح أو تعليقات.
      `;
  
      const analysisResponse = await generateProductSEO(analysisPrompt);
      const analysisJson = analysisResponse.match(/{[\s\S]*}/);
      if (!analysisJson) throw new Error("تحليل النوع فشل");
      const analysis = JSON.parse(analysisJson[0]);
  
      setProduct((prev) => ({
        ...prev,
        keyword,
        category: analysis.category,
        target_audience: analysis.target_audience,
        tone: analysis.tone,
        best_story_arc: analysis.best_story_arc,
      }));
    } catch (e) {
      console.error("❌ فشل تحليل المنتج:", e);
      alert("فشل تحليل المنتج");
      console.error("📛 تفاصيل الخطأ:", e?.response || e?.message || e);
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/product/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name || "",
          description: product.description || "",
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
          seo_title: product.seo_title || "",
          url_path: product.url_path || "",
        }),
      });
  
      const resultText = await res.text();
      console.log("📩 response:", resultText);
  
      if (!res.ok) throw new Error("فشل الحفظ");
  
      alert("✅ تم حفظ التعديلات بنجاح");
    } catch (err) {
      console.error("❌ خطأ في الحفظ:", err);
      alert("❌ حدث خطأ أثناء الحفظ");
    }
  };
  
  
 

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const keywordPrompt = `أنت خبير SEO. استخرج الكلمة المفتاحية الأنسب بناءً على اسم المنتج:
اسم المنتج: ${product.name}
أعطني فقط الكلمة المفتاحية المناسبة دون أي شرح أو إضافات.`;
      const keyword = (await generateProductSEO(keywordPrompt)).trim();

      const analysisPrompt = `
أنت خبير تسويق وتحليل منتجات.
مطلوب منك تحليل المنتج التالي واستخراج هذه البيانات فقط بصيغة JSON:
{
  "category": "",
  "target_audience": "",
  "tone": "",
  "best_story_arc": ""
}
❗ تعليمات مهمة:
- اختر حبكة ملائمة للمجال ولا تنوع الحبكات في المجال الواحد.
- لا تخصص الاستهداف بناءً على الجنس.
- إذا كان المنتج وظيفيًا، اجعل النغمة عملية.
🔹 اسم المنتج: ${product.name}
🔹 الوصف الحالي: ${product.description}
🎯 أعد فقط JSON النتيجة بدون شرح أو تعليقات.`;
      const analysisResponse = await generateProductSEO(analysisPrompt);
      const analysisJson = analysisResponse.match(/{[\s\S]*}/);
      if (!analysisJson) throw new Error("تحليل النوع فشل");
      const analysis = JSON.parse(analysisJson[0]);
      setProductAnalysis(analysis);

      const prompt = `
أنت مساعد تسويق محترف وخبير في SEO. مهمتك توليد محتوى متكامل لصفحة منتج، منسق باستخدام HTML، ويحقق أفضل نتائج في محركات البحث، ويراعي معايير السيو التالية:

🎯 المعايير الإلزامية:
- يبدأ الوصف بالكلمة المفتاحية خلال أول 25 كلمة.
- يتجاوز الوصف 130 كلمة (وليس فقط 120).
- يحتوي على أقسام واضحة بالشكل التالي:

1. <p> فقرة افتتاحية تسويقية جذابة تبدأ بالكلمة المفتاحية </p>
2. <p> عنوان فرعي: "فوائد المنتج" </p>
3. <ul><li>قائمة مكونة من 3 إلى 5 فوائد حقيقية للمنتج</li></ul>
4. <p> عنوان فرعي: "طريقة الاستخدام" </p>
5. <p> شرح مبسط لكيفية استخدام المنتج </p>
6. <p> فقرة ختامية تحفيزية مع دعوة لاتخاذ قرار الشراء (Call To Action) </p>

🧠 ملاحظات:
- استخدم فقط HTML (بدون Markdown أو رموز).
- لا تكرر الكلمة المفتاحية بشكل مصطنع.
- اجعل النغمة مناسبة للفئة المستهدفة حسب البيانات.

🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${keyword}
🔹 الفئة: ${product.category}
🔹 الجمهور المستهدف: ${product.target_audience}
🔹 النغمة: ${product.tone}
🔹 الحبكة: ${product.best_story_arc}


📦 أعد فقط JSON يحتوي على:
{
  "name": "عنوان المنتج يحتوي على الكلمة المفتاحية",
  "description": "الوصف المنسق حسب المعايير أعلاه",
  "keyword": "${keyword}",
  "meta_title": "عنوان تسويقي لا يتجاوز 60 حرفًا ويحتوي الكلمة المفتاحية",
  "meta_description": "وصف ميتا تسويقي يحتوي الكلمة المفتاحية ويتراوح بين 145-150 حرفًا",
  "url_path": "",
  "imageAlt": "نص ALT يحتوي على الكلمة المفتاحية"
}`;


      const generated = await generateProductSEO(prompt);
      const jsonMatch = generated.match(/{[\s\S]*}/);
      if (!jsonMatch) throw new Error("لم يتم العثور على JSON");
      const fields = JSON.parse(jsonMatch[0]);

      const truncate = (text, max = 60) =>
        typeof text === "string" && text.length > max ? text.slice(0, max - 1) + "…" : text;

      fields.name = truncate(fields.name, 60);
      fields.meta_title = truncate(fields.meta_title, 60);
      fields.meta_description = fields.meta_description?.slice(0, 150) || "";

      setProduct((prev) => ({
        ...prev,
        ...fields,
        keyword: keyword,
      }));
    } catch (e) {
      console.error("❌ فشل التوليد:", e);
      toast.error("⚠️ حدث خطأ أثناء توليد البيانات. الرجاء المحاولة مرة أخرى.");
    }
    setGenerating(false);
  };

  const handleGenerateField = async (fieldType) => {
    setFieldLoading(fieldType);
    try {
      let prompt = "";
      switch (fieldType) {
        case "keyword":
          prompt = `أنت خبير SEO محترف. اختر الكلمة المفتاحية الجوهرية بدون شرح:
🔹 اسم المنتج: ${product.name}
🔹 الوصف: ${product.description}
🔹 الفئة: ${productAnalysis?.category}
🔹 الجمهور المستهدف: ${productAnalysis?.target_audience}`;
          break;
        case "seo_title":
          prompt = `أنت مساعد تسويق محترف. اكتب وصفًا HTML منسقًا لمنتج يحتوي على 120 كلمة على الأقل ويبدأ بالكلمة المفتاحية.

قسّم الوصف إلى العناصر التالية باستخدام وسم HTML المناسب:
1. فقرة افتتاحية تسويقية داخل <p>
2. قائمة فوائد باستخدام <ul> و <li>
3. فقرة لطريقة الاستخدام داخل <p>
4. خاتمة تحفيزية داخل <p> تتضمن Call To Action

🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}

❗ ملاحظات:
- لا تستخدم Markdown.
- لا تضع النص كفقرات عشوائية، استخدم HTML واضح.
- أعد فقط النص داخل JSON كقيمة لحقل \"description\" بدون أي شرح.
`;

          break;
        case "description":
          prompt = `أنت مساعد تسويق. اكتب وصفًا تسويقيًا لا يقل عن 100 كلمة، منسق بدون رموز Markdown:
🔹 اسم المنتج: ${product.name}
🔹 وصف مختصر: ${product.description}
🔹 الكلمة المفتاحية: ${product.keyword}`;
          break;
        case "meta_title":
          prompt = `أنشئ عنوان SEO احترافي لا يتجاوز 60 حرفًا:
🔹 اسم المنتج: ${product.name}
🔹 الوصف: ${product.description}`;
          break;
        case "meta_description":
          prompt = `اكتب وصف ميتا تسويقي لا يقل عن 145 ولا يتجاوز 150 حرفًا:
🔹 اسم المنتج: ${product.name}
🔹 الوصف: ${product.description}`;
          break;
        case "imageAlt":
          prompt = `ما هو أفضل نص ALT لصورة هذا المنتج؟ اختر بين اسم المنتج أو الكلمة المفتاحية:
🔹 اسم المنتج: ${product.name}`;
          break;
        default:
          prompt = `لا يوجد برومبت لهذا الحقل.`;
      }

      const response = await generateProductSEO(prompt);
      const cleaned = response.trim();console.log("🎯 وصف مولّد:", cleaned);

      const value =
        fieldType === "meta_title" ? cleaned.slice(0, 60) :
        fieldType === "meta_description" ? cleaned.slice(0, 150) :
        cleaned;

      setProduct((prev) => ({
        ...prev,
        [fieldType]: value,
      }));
    } catch (e) {
      console.error("❌ فشل توليد الحقل:", e);
      toast.error("⚠️ تعذّر توليد هذا الحقل تلقائيًا. حاول مرة أخرى لاحقا.");
    }
    setFieldLoading("");
  };



  const renderInputField = (label, key, multiline = false) => {
    if (key === "description") {
      return (
        <div className="relative bg-white p-4 rounded-2xl shadow flex flex-col gap-2 border">
          <label className="text-sm text-gray-600 font-semibold">{label}</label>
          <TiptapEditor
  value={product.description}
  onChange={(val) => setProduct({ ...product, description: val })}
/>





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
    }

    return (
      <div className="relative bg-white p-4 rounded-2xl shadow flex flex-col gap-2 border">
        <label className="text-sm text-gray-600 font-semibold">{label}</label>
        {multiline ? (
          <textarea
            value={product[key] || ""}
            onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 resize-y min-h-[120px]"
          />
        ) : (
          <input
            type="text"
            value={product[key] || ""}
            onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
  };

  const progress = score.length ? Math.round(score.filter(s => s.status === "pass").length / score.length * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-700">بيانات المنتج</h2>
              <div className="flex gap-2 flex-wrap">
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className={`text-white px-4 py-2 rounded-xl transition ${
                      generating ? "opacity-50 cursor-not-allowed bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    ✨ توليد ذكي
                  </button>
                </div>
                <button
  onClick={handleSave}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
>
  💾 حفظ
</button>


              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="text-sm font-medium text-gray-600">📦 الفئة</label>
      <input
        type="text"
        value={product.category || ""}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        className="p-2 border rounded w-full"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-600">🎯 الجمهور المستهدف</label>
      <input
        type="text"
        value={product.target_audience || ""}
        onChange={(e) => setProduct({ ...product, target_audience: e.target.value })}
        className="p-2 border rounded w-full"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-600">📝 النغمة</label>
      <select
        value={product.tone || ""}
        onChange={(e) => setProduct({ ...product, tone: e.target.value })}
        className="p-2 border rounded w-full"
      >
        <option value="">اختر النغمة</option>
        <option value="رسمية">رسمية</option>
        <option value="حماسية">حماسية</option>
        <option value="دافئة">دافئة</option>
        <option value="محايدة">محايدة</option>
        <option value="ناعمة">ناعمة</option>
        <option value="لطيفة">لطيفة</option>
      </select>
    </div>
  </div>

  <div className="text-left">
    <button
      onClick={handleAnalyzeProduct}
      disabled={generating}
      className={`text-white px-4 py-2 rounded-xl transition ${
        generating
          ? "opacity-50 cursor-not-allowed bg-indigo-400"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      🔍 تحليل نوع المنتج
    </button>
  </div>
</div>



            {renderInputField("📌 عنوان المنتج", "name")}
            {renderInputField("📝 الوصف", "description")}
            {renderInputField("🔑 الكلمة المفتاحية", "keyword")}
            {renderInputField("🌐 عنوان السيو", "meta_title")}
            {renderInputField("🧠 وصف الميتا", "meta_description", true)}
            {renderInputField("🖼️ نص ALT للصورة", "imageAlt")}
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
          </section>
        </main>
      </div>
    </>
  );
} // نهاية الكومبوننت