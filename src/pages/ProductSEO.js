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
      const keywordPrompt = `أنت خبير SEO للتجارة الإلكترونية. استخرج الكلمة المفتاحية الأنسب لمتجر إلكتروني بناءً على اسم المنتج:
  اسم المنتج: ${product.name}
  أعطني فقط الكلمة المفتاحية المناسبة للبحث في المتاجر الإلكترونية دون أي شرح أو إضافات.`;
      const keyword = (await generateProductSEO(keywordPrompt)).trim();
  
      const analysisPrompt = `
  أنت خبير تسويق منتجات التجارة الإلكترونية وتحليل سلوك المستهلكين.
  مطلوب منك تحليل المنتج التالي واستخراج هذه البيانات فقط بصيغة JSON:
  {
    "category": "",
    "target_audience": "",
    "tone": "",
    "best_story_arc": ""
  }
  🔹 اسم المنتج: ${product.name}
  🔹 الوصف الحالي: ${product.description}
  
  ملاحظات للتجارة الإلكترونية:
  - اختر الفئة حسب تصنيفات المتاجر الإلكترونية الشائعة
  - حدد الجمهور المستهدف بناءً على نية الشراء أونلاين
  - النغمة يجب أن تحفز على الشراء الفوري
  - الحبكة تناسب صفحات المنتجات في المتاجر
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
          keyword: product.keyword || "",
          category: product.category || "",
          target_audience: product.target_audience || "",
          tone: product.tone || "",
          imageAlt: product.imageAlt || "",
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
      const keywordPrompt = `أنت خبير SEO للتجارة الإلكترونية. استخرج الكلمة المفتاحية الأنسب لمتجر إلكتروني:
اسم المنتج: ${product.name}
أعطني فقط الكلمة المفتاحية المناسبة للبحث في المتاجر الإلكترونية دون أي شرح.`;
      const keyword = (await generateProductSEO(keywordPrompt)).trim();

      const analysisPrompt = `
أنت خبير تسويق منتجات التجارة الإلكترونية وتحليل سلوك المستهلكين.
مطلوب منك تحليل المنتج التالي واستخراج هذه البيانات فقط بصيغة JSON:
{
  "category": "",
  "target_audience": "",
  "tone": "",
  "best_story_arc": ""
}
❗ تعليمات للتجارة الإلكترونية:
- اختر الفئة حسب تصنيفات المتاجر الإلكترونية (مثل: إلكترونيات، أزياء، منزل وحديقة، صحة وجمال، رياضة)
- حدد الجمهور بناءً على نية الشراء أونلاين وسلوك المستهلكين الرقميين
- النغمة يجب أن تحفز على الشراء الفوري (مثل: "مقنعة"، "حماسية"، "موثوقة")
- الحبكة تناسب صفحات المنتجات (مثل: "المشكلة والحل"، "قبل وبعد"، "الفوائد الحصرية")
🔹 اسم المنتج: ${product.name}
🔹 الوصف الحالي: ${product.description}
🎯 أعد فقط JSON النتيجة بدون شرح أو تعليقات.`;
      
      const analysisResponse = await generateProductSEO(analysisPrompt);
      const analysisJson = analysisResponse.match(/{[\s\S]*}/);
      if (!analysisJson) throw new Error("تحليل النوع فشل");
      const analysis = JSON.parse(analysisJson[0]);
      setProductAnalysis(analysis);

      const prompt = `
أنت خبير SEO للتجارة الإلكترونية ومتخصص في تحسين صفحات المنتجات للمتاجر أونلاين. مهمتك توليد محتوى متكامل لصفحة منتج في متجر إلكتروني، منسق باستخدام HTML، ويحقق أفضل نتائج في محركات البحث للتجارة الإلكترونية.

🎯 المعايير الإلزامية للتجارة الإلكترونية:
- يبدأ الوصف بالكلمة المفتاحية خلال أول 20 كلمة
- يتجاوز الوصف 150 كلمة للمنتجات
- يحتوي على عناصر تحفز الشراء والثقة
- يتضمن معلومات مفيدة لقرار الشراء

هيكل الوصف المطلوب:
1. <p> فقرة افتتاحية تسويقية تبدأ بالكلمة المفتاحية وتحفز على الشراء </p>
2. <h3> فوائد ومميزات المنتج </h3>
3. <ul><li>قائمة من 4-6 فوائد ومميزات واضحة ومفيدة</li></ul>
4. <h3> طريقة الاستخدام أو المواصفات </h3>
5. <p> تفاصيل الاستخدام أو المواصفات التقنية </p>
6. <p> فقرة ختامية تحفيزية مع ضمانات ودعوة واضحة للشراء </p>

🧠 ملاحظات مهمة:
- استخدم فقط HTML (بدون Markdown)
- ركز على فوائد المنتج للمشتري
- أضف عناصر الثقة والضمان
- اجعل النغمة تحفز على الشراء الفوري

🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${keyword}
🔹 الفئة: ${product.category}
🔹 الجمهور المستهدف: ${product.target_audience}
🔹 النغمة: ${product.tone}
🔹 الحبكة: ${product.best_story_arc}

📦 أعد فقط JSON يحتوي على:
{
  "name": "عنوان المنتج يحتوي على الكلمة المفتاحية ويحفز الشراء",
  "description": "الوصف المنسق حسب المعايير أعلاه",
  "keyword": "${keyword}",
  "meta_title": "عنوان SEO يحتوي الكلمة المفتاحية + كلمات تجارية (شراء، سعر، أفضل) - أقل من 60 حرف",
  "meta_description": "وصف ميتا يحتوي الكلمة المفتاحية + محفزات الشراء + CTA واضح - 145-150 حرف",
  "url_path": "مسار URL يحتوي الكلمة المفتاحية",
  "imageAlt": "نص ALT يحتوي الكلمة المفتاحية + وصف المنتج"
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
      alert("فشل التوليد الذكي");
    }
    setGenerating(false);
  };

  const handleGenerateField = async (fieldType) => {
    setFieldLoading(fieldType);
    try {
      let prompt = "";
      switch (fieldType) {
        case "keyword":
          prompt = `أنت خبير SEO للتجارة الإلكترونية. اختر الكلمة المفتاحية الجوهرية المناسبة للبحث في المتاجر الإلكترونية بدون شرح:
🔹 اسم المنتج: ${product.name}
🔹 الوصف: ${product.description}
🔹 الفئة: ${productAnalysis?.category}
🔹 الجمهور المستهدف: ${productAnalysis?.target_audience}

أعطني كلمة مفتاحية واحدة فقط تناسب البحث عن هذا المنتج في المتاجر الإلكترونية.`;
          break;
          
        case "seo_title":
          prompt = `أنت مساعد تسويق محترف للتجارة الإلكترونية. اكتب وصفًا HTML منسقًا لمنتج في متجر إلكتروني يحتوي على 150 كلمة على الأقل ويبدأ بالكلمة المفتاحية.

قسّم الوصف إلى العناصر التالية باستخدام HTML:
1. فقرة افتتاحية تحفز الشراء تبدأ بالكلمة المفتاحية داخل <p>
2. قائمة فوائد ومميزات باستخدام <ul> و <li>
3. فقرة معلومات المنتج أو طريقة الاستخدام داخل <p>
4. خاتمة تحفيزية مع ضمانات ودعوة للشراء داخل <p>

🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}

❗ ملاحظات:
- يجب أن يبدأ الوصف بالكلمة المفتاحية
- ركز على فوائد الشراء والثقة
- استخدم HTML واضح بدون Markdown
- أعد فقط النص داخل JSON كقيمة لحقل \"description\"`;
          break;
          
        case "description":
          prompt = `أنت مساعد تسويق للتجارة الإلكترونية. اكتب وصفًا تسويقيًا يحفز الشراء لا يقل عن 120 كلمة، يبدأ بالكلمة المفتاحية:
🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}
🔹 وصف مختصر: ${product.description}

- يجب أن يبدأ بالكلمة المفتاحية
- ركز على الفوائد والمميزات
- أضف عناصر تحفز الشراء
- بدون رموز Markdown`;
          break;
          
        case "meta_title":
          prompt = `أنشئ عنوان SEO احترافي للتجارة الإلكترونية يحتوي على الكلمة المفتاحية ولا يتجاوز 60 حرفًا:
🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}
🔹 الوصف: ${product.description}

❗ مهم جداً: العنوان يجب أن يحتوي الكلمة المفتاحية "${product.keyword}" ويحفز الشراء
مثال: "شراء ${product.keyword} بأفضل سعر" أو "${product.keyword} أصلي مضمون"`;
          break;
          
        case "meta_description":
          prompt = `اكتب وصف ميتا تسويقي للتجارة الإلكترونية يحتوي الكلمة المفتاحية ويحفز الشراء، بين 145-150 حرفًا:
🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}
🔹 الوصف: ${product.description}

❗ مهم جداً: الوصف يجب أن يحتوي الكلمة المفتاحية "${product.keyword}" + دعوة واضحة للشراء
مثال: "اشتري ${product.keyword} بأفضل جودة وسعر. توصيل مجاني وضمان استرداد. اطلب الآن!"`;
          break;
          
        case "imageAlt":
          prompt = `اكتب نص ALT لصورة المنتج يحتوي الكلمة المفتاحية ووصف المنتج:
🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}

❗ مهم: النص يجب أن يحتوي الكلمة المفتاحية "${product.keyword}"
مثال: "${product.keyword} - ${product.name}"`;
          break;
          
        case "url_path":
          prompt = `أنشئ مسار URL مناسب للتجارة الإلكترونية يحتوي الكلمة المفتاحية:
🔹 اسم المنتج: ${product.name}
🔹 الكلمة المفتاحية: ${product.keyword}

أعد مسار URL نظيف يحتوي الكلمة المفتاحية (بدون https:// أو دومين)
مثال: "products/${product.keyword?.replace(/\s+/g, '-')}" أو "shop/${product.keyword?.replace(/\s+/g, '-')}"`;
          break;
          
        default:
          prompt = `لا يوجد برومبت لهذا الحقل.`;
      }

      const response = await generateProductSEO(prompt);
      const cleaned = response.trim();
      console.log("🎯 محتوى مولّد:", cleaned);

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
      alert("فشل توليد الحقل");
    }
    setFieldLoading("");
  };

  // CSS للأنيميشن
  const aiIconStyle = {
    animation: 'pulse 2s infinite, rotate 4s linear infinite',
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
      }
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .ai-icon {
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        animation: pulse 2s infinite;
      }
      .ai-icon:hover {
        background: linear-gradient(45deg, #764ba2 0%, #667eea 100%);
        animation: pulse 1s infinite, rotate 2s linear infinite;
      }
      .generate-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 15px 0 rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
      }
      .generate-btn:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        box-shadow: 0 6px 20px 0 rgba(102, 126, 234, 0.6);
        transform: translateY(-2px);
      }
      .ai-spark {
        animation: sparkle 1.5s infinite alternate;
      }
      @keyframes sparkle {
        0% { opacity: 0.5; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const renderInputField = (label, key, multiline = false) => {
    const aiIcon = (
      <div 
        className="ai-icon w-8 h-8 text-white text-xs rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        onClick={() => handleGenerateField(key)}
        title={`توليد ذكي لـ ${label}`}
        style={fieldLoading === key ? {} : aiIconStyle}
      >
        {fieldLoading === key ? (
          <div className="ai-spark">⏳</div>
        ) : (
          <div className="ai-spark">🤖</div>
        )}
      </div>
    );

    if (key === "description") {
      return (
        <div className="relative bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all">
          <label className="text-sm text-gray-700 font-bold flex items-center gap-2">
            {label}
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">AI متاح</span>
          </label>
          <TiptapEditor
            value={product.description}
            onChange={(val) => setProduct({ ...product, description: val })}
          />
          <div className="absolute top-2 left-2">
            {aiIcon}
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all">
        <label className="text-sm text-gray-700 font-bold flex items-center gap-2">
          {label}
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">AI متاح</span>
        </label>
        {multiline ? (
          <textarea
            value={product[key] || ""}
            onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
            className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[120px] w-full transition-all"
            placeholder={`أدخل ${label} أو استخدم الذكاء الاصطناعي للتوليد...`}
          />
        ) : (
          <input
            type="text"
            value={product[key] || ""}
            onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
            className="p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
            placeholder={`أدخل ${label} أو استخدم الذكاء الاصطناعي...`}
          />
        )}
        <div className="absolute top-2 left-2">
          {aiIcon}
        </div>
      </div>
    );
  };

  const progress = score.length ? Math.round(score.filter(s => s.status === "pass").length / score.length * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar />
        <main className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                📦 بيانات المنتج
                <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">التجارة الإلكترونية</span>
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className={`generate-btn text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    generating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className={generating ? "ai-spark" : ""}>🤖</div>
                  {generating ? "جاري التوليد..." : "التوليد الشامل"}
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  💾 حفظ التغييرات
                </button>
              </div>
            </div>

            <div className="space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-100">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                🔍 تحليل المنتج للتجارة الإلكترونية
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">مدعوم بالذكاء الاصطناعي</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    🏪 فئة المتجر
                  </label>
                  <input
                    type="text"
                    value={product.category || ""}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="p-3 border-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="مثل: إلكترونيات، أزياء، منزل..."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    🎯 المستهلك المستهدف
                  </label>
                  <input
                    type="text"
                    value={product.target_audience || ""}
                    onChange={(e) => setProduct({ ...product, target_audience: e.target.value })}
                    className="p-3 border-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="مثل: الشباب، العائلات، المهتمين بـ..."
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    📝 نغمة التسويق
                  </label>
                  <select
                    value={product.tone || ""}
                    onChange={(e) => setProduct({ ...product, tone: e.target.value })}
                    className="p-3 border-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">اختر نغمة التسويق</option>
                    <option value="مقنعة">مقنعة - تحفز الشراء</option>
                    <option value="موثوقة">موثوقة - تبني الثقة</option>
                    <option value="حماسية">حماسية - تثير الإعجاب</option>
                    <option value="احترافية">احترافية - للمنتجات التقنية</option>
                    <option value="دافئة">دافئة - للمنتجات العائلية</option>
                    <option value="عصرية">عصرية - للمنتجات الحديثة</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    📖 استراتيجية المحتوى
                  </label>
                  <input
                    type="text"
                    value={product.best_story_arc || ""}
                    onChange={(e) => setProduct({ ...product, best_story_arc: e.target.value })}
                    className="p-3 border-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="مثل: المشكلة والحل، قبل وبعد..."
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleAnalyzeProduct}
                  disabled={generating}
                  className={`bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                    generating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className={generating ? "ai-spark" : ""}>🤖</div>
                  {generating ? "جاري التحليل..." : "تحليل ذكي للمنتج"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {renderInputField("📌 عنوان المنتج", "name")}
              {renderInputField("📝 وصف المنتج المفصل", "description")}
              {renderInputField("🔑 الكلمة المفتاحية الرئيسية", "keyword")}
              {renderInputField("🌐 عنوان SEO (Meta Title)", "meta_title")}
              {renderInputField("🧠 وصف SEO (Meta Description)", "meta_description", true)}
              {renderInputField("🔗 مسار الرابط (URL Path)", "url_path")}
              {renderInputField("🖼️ نص بديل للصورة (Alt Text)", "imageAlt")}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                📊 مؤشرات SEO للتجارة الإلكترونية
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">نسبة التحسين:</div>
                <div className={`text-lg font-bold ${progress >= 80 ? 'text-green-600' : progress >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {progress}%
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  progress >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              {progress >= 80 ? "🎉 ممتاز! تحسين SEO مثالي" :
               progress >= 60 ? "⚠️ جيد، يمكن تحسينه أكثر" :
               "❌ يحتاج تحسين كبير"}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.isArray(score) && score.length > 0 ? (
                score.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 text-sm transition-all hover:shadow-md ${
                      item.status === "pass"
                        ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                        : "bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg">
                        {item.status === "pass" ? "✅" : "❌"}
                      </div>
                      <div>
                        <div className="font-semibold">{item.text}</div>
                        {item.suggestion && (
                          <div className="text-xs mt-1 opacity-80">
                            💡 {item.suggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <div>لا توجد نتائج تحليل بعد</div>
                  <div className="text-xs mt-1">أدخل بيانات المنتج للحصول على تحليل SEO</div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}