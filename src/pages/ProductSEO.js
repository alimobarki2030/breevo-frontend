import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  Save, 
  Wand2, 
  Zap, 
  BarChart3, 
  Eye, 
  ArrowLeft, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Globe,
  Image,
  Type,
  FileText,
  Target,
  Users,
  Lightbulb,
  Sparkles,
  Crown,
  Copy,
  ExternalLink,
  Download,
  Package,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { generateProductSEO } from "../utils/generateProductSEO";
import analyzeSEO from "../analyzeSEO";
import TiptapEditor from "../components/TiptapEditor";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Constants
const FIELD_LIMITS = {
  meta_title: 60,
  meta_description: 160,
  keyword_limit: 100,
  name_limit: 70
};

const TONE_OPTIONS = [
  { value: "", label: "اختر النغمة" },
  { value: "رسمية", label: "رسمية - للشركات الكبيرة" },
  { value: "حماسية", label: "حماسية - للمنتجات الرياضية" },
  { value: "دافئة", label: "دافئة - للمنتجات العائلية" },
  { value: "محايدة", label: "محايدة - للمنتجات التقنية" },
  { value: "ناعمة", label: "ناعمة - للمنتجات النسائية" },
  { value: "لطيفة", label: "لطيفة - لمنتجات الأطفال" },
  { value: "فاخرة", label: "فاخرة - للمنتجات المميزة" },
  { value: "عملية", label: "عملية - للأدوات والمعدات" }
];

const STORY_ARC_OPTIONS = [
  { value: "", label: "اختر الحبكة" },
  { value: "مشكلة-حل", label: "مشكلة ← حل" },
  { value: "قبل-بعد", label: "قبل ← بعد" },
  { value: "رحلة-التحول", label: "رحلة التحول" },
  { value: "الاكتشاف", label: "قصة الاكتشاف" },
  { value: "المقارنة", label: "مقارنة الخيارات" },
  { value: "التجربة", label: "التجربة الشخصية" }
];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Enhanced Category-Specific Prompts
const CATEGORY_KEYWORDS = {
  "إلكترونيات": ["جودة عالية", "ضمان", "توصيل مجاني", "أحدث إصدار", "تقنية متطورة"],
  "ملابس": ["موضة", "جودة القماش", "مقاسات متنوعة", "راحة", "أناقة"],
  "تجميل": ["طبيعي", "آمن للبشرة", "نتائج مضمونة", "خالي من المواد الضارة"],
  "طعام": ["طبيعي", "صحي", "طازج", "جودة عالية", "توصيل سريع"],
  "منزل": ["عملي", "متين", "توفير المساحة", "سهل التنظيف", "ضمان طويل"],
  "رياضة": ["أداء عالي", "راحة", "متانة", "مناسب للمحترفين", "نتائج أفضل"]
};

// ✅ ENHANCED: Advanced SEO Prompts System
const ENHANCED_SEO_PROMPTS = {
  
  // Advanced Keyword Research with Market Analysis
  generateKeyword: (product) => {
    const category = product.category || 'عام';
    const categoryKeywords = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS["إلكترونيات"];
    
    return `أنت خبير SEO محترف متخصص في السوق السعودي والخليجي مع 15+ سنة خبرة. مهمتك تحديد الكلمة المفتاحية الذهبية.

معلومات المنتج:
📦 المنتج: "${product.name}"
📝 الوصف: "${product.description?.replace(/<[^>]*>/g, '').slice(0, 200) || 'غير متوفر'}"
🎯 الفئة: "${category}"
👥 الجمهور: "${product.target_audience || 'عام'}"

تحليل السوق السعودي:
✅ حجم البحث: 2000+ شهرياً
✅ المنافسة: متوسطة إلى منخفضة (KD 20-60)
✅ نية الشراء: عالية (Commercial/Transactional Intent)
✅ CPC المتوقع: 0.5-3 ريال سعودي
✅ الموسمية: مناسب للبحث على مدار السنة

أنماط البحث السعودية الناجحة:
🔍 [اسم المنتج] + [مواصفة رئيسية] + [السعودية/الرياض]
🔍 [اسم المنتج] + [سعر/شراء/متجر] + [توصيل]
🔍 [أفضل] + [اسم المنتج] + [للـ/في] + [الاستخدام]

كلمات القوة للفئة "${category}":
${categoryKeywords.map(kw => `• ${kw}`).join('\n')}

معايير التقييم:
1. البحث الشهري > 1000 في السعودية
2. صعوبة الكلمة 20-50 (متوسطة)
3. نية شراء قوية (80%+)
4. صلة مباشرة بالمنتج (100%)
5. تنافسية معقولة مع إمكانية الترتيب

أمثلة كلمات مفتاحية ذهبية ناجحة:
• تقنية: "ايفون 15 برو أسعار السعودية توصيل"
• تجميل: "سيروم فيتامين سي للوجه الأصلي"
• طعام: "عسل سدر جبلي طبيعي سعودي"
• ملابس: "ثوب رجالي قطن فاخر مقاسات"

اختر الكلمة المفتاحية المثالية فقط (2-5 كلمات):`;
  },

  // Enhanced Description Generation
  generateDescription: (product) => {
    const keyword = product.keyword || product.name;
    const category = product.category || 'عام';
    const tone = product.tone || 'محايدة';
    const audience = product.target_audience || 'عام';
    
    return `أنت كاتب محتوى تسويقي محترف متخصص في السوق السعودي. اكتب وصف منتج متقدم يحقق أهداف SEO والتحويل.

معلومات المنتج:
🏷️ المنتج: "${product.name}"
🎯 الكلمة المفتاحية: "${keyword}"
📂 الفئة: "${category}"
👥 الجمهور المستهدف: "${audience}"
🎭 النغمة: "${tone}"

متطلبات SEO الإلزامية:
✅ ابدأ الفقرة الأولى بالكلمة المفتاحية في أول 15 كلمة
✅ طول الوصف: 150-250 كلمة (ليس أقل من 120 كلمة)
✅ كثافة الكلمة المفتاحية: 2-3% (طبيعية وغير مكررة)
✅ استخدم HTML منظم: <h3>, <p>, <ul>, <li>, <strong>
✅ أضف 2-3 روابط داخلية ذات صلة
✅ اذكر مواصفات محددة (حجم، وزن، كمية، أبعاد)
✅ دعوة واضحة لاتخاذ إجراء في النهاية

هيكل الوصف المطلوب:

<p><strong>${keyword}</strong> [جملة افتتاحية قوية تشرح الفائدة الرئيسية والمشكلة التي يحلها]</p>

<h3>🌟 المميزات الرئيسية</h3>
<ul>
<li><strong>الجودة العالية:</strong> [تفصيل مع مواصفات محددة]</li>
<li><strong>سهولة الاستخدام:</strong> [شرح كيفية الاستفادة]</li>
<li><strong>الضمان والأمان:</strong> [معلومات الضمان والجودة]</li>
<li><strong>التوصيل السريع:</strong> [معلومات الشحن في السعودية]</li>
</ul>

<h3>📋 المواصفات التقنية</h3>
<p>[اذكر الحجم، الوزن، الأبعاد، المواد، الألوان المتاحة، etc.]</p>

<h3>💡 كيفية الاستخدام</h3>
<p>[شرح بسيط وواضح لطريقة الاستخدام المثلى]</p>

<p><strong>🛒 اطلب ${keyword} الآن مع ضمان الجودة وتوصيل مجاني في جميع أنحاء السعودية!</strong> <a href="/category/${category.replace(/\s+/g, '-')}" title="تصفح المزيد من منتجات ${category}">تصفح المزيد من منتجات ${category}</a></p>

نصائح للكتابة:
• استخدم الأرقام والإحصائيات عند الإمكان
• اذكر فوائد ملموسة وليس فقط مميزات
• تجنب المبالغة واستخدم لغة واقعية
• اربط بصفحات ذات صلة في الموقع
• استخدم كلمات تحفز العاطفة والثقة

اكتب الوصف باللغة العربية فقط:`;
  },

  // Enhanced Meta Title Generation
  generateMetaTitle: (product) => {
    const keyword = product.keyword || product.name;
    const category = product.category || '';
    
    return `أنت خبير SEO متخصص في كتابة عناوين صفحات محسنة للسوق السعودي. اكتب Page Title مثالي.

المنتج: "${product.name}"
الكلمة المفتاحية: "${keyword}"
الفئة: "${category}"

معايير Page Title المثالي:
✅ الطول: 50-58 حرف بالضبط (مهم جداً)
✅ يبدأ بالكلمة المفتاحية أو يحتويها في البداية
✅ يحتوي على كلمة تحفيزية (أفضل، حصري، عروض، جديد)
✅ يذكر السعودية أو التوصيل إذا كان هناك مساحة
✅ جذاب للنقر بمعدل CTR عالي
✅ يتجنب التكرار والحشو

أمثلة ناجحة:
• "ايفون 15 برو ماكس أسعار حصرية السعودية | توصيل مجاني"
• "كريم فيتامين سي الأصلي للبشرة | عروض محدودة"
• "ساعة ذكية سامسونج جديدة | ضمان سنتين السعودية"

قوالب مجربة:
• [الكلمة المفتاحية] | [ميزة فريدة] | [مكان/ضمان]
• أفضل [الكلمة المفتاحية] في السعودية | [فائدة رئيسية]
• [الكلمة المفتاحية] [صفة مميزة] | توصيل مجاني السعودية

تجنب هذه الأخطاء:
❌ تجاوز 60 حرف
❌ تكرار الكلمات
❌ استخدام رموز غريبة
❌ المبالغة غير المبررة

اكتب العنوان فقط (50-58 حرف):`;
  },

  // Enhanced Meta Description Generation
  generateMetaDescription: (product) => {
    const keyword = product.keyword || product.name;
    const category = product.category || '';
    
    return `أنت خبير في كتابة Meta Description محسنة لمحركات البحث. اكتب وصف ميتا مثالي يحقق أعلى CTR.

المنتج: "${product.name}"
الكلمة المفتاحية: "${keyword}"
الفئة: "${category}"

معايير Meta Description المثالية:
✅ الطول: 150-155 حرف بالضبط
✅ تحتوي الكلمة المفتاحية في النصف الأول
✅ تشرح الفائدة الرئيسية والقيمة المضافة
✅ تحتوي على دعوة لاتخاذ إجراء
✅ تذكر ميزة تنافسية (توصيل مجاني، ضمان، سعر مميز)
✅ تستخدم أرقام أو إحصائيات إذا أمكن
✅ تبدأ بفعل أو صفة قوية

صيغ مجربة ناجحة:
• "اكتشف [الكلمة المفتاحية] بجودة عالية وأسعار منافسة. توصيل مجاني في السعودية وضمان سنتين. اطلب الآن!"
• "احصل على [الكلمة المفتاحية] الأصلي مع خصم 20%. أكثر من 1000 عميل راضي. شحن سريع لجميع المناطق."
• "[الكلمة المفتاحية] بأفضل الأسعار في السعودية. جودة مضمونة وخدمة عملاء 24/7. اطلب الآن واستفد من العروض!"

عناصر القوة:
🎯 الفوائد الواضحة
💰 الأسعار/العروض  
🚚 معلومات التوصيل
⭐ الجودة والضمان
📱 سهولة الطلب
👥 رضا العملاء

كلمات تحفيزية:
• احصل على، اكتشف، استفد من
• حصري، محدود، مميز
• مجاني، خصم، عرض
• ضمان، جودة، أصلي
• سريع، فوري، سهل

اكتب Meta Description فقط (150-155 حرف):`;
  },

  // Enhanced URL Path Generation
  generateUrlPath: (product) => {
    const keyword = product.keyword || product.name;
    
    return `أنت خبير في إنشاء URL صديق لمحركات البحث. أنشئ مسار URL مثالي.

المنتج: "${product.name}"
الكلمة المفتاحية: "${keyword}"

معايير URL المثالي:
✅ باللغة الإنجليزية فقط
✅ قصير ووصفي (3-5 كلمات)
✅ يحتوي على الكلمة المفتاحية المترجمة
✅ يستخدم الشرطات (-) لفصل الكلمات
✅ بدون أحرف خاصة أو مسافات
✅ أحرف صغيرة فقط
✅ سهل الحفظ والمشاركة

أمثلة URL ناجحة:
• كريم فيتامين سي → vitamin-c-serum-original
• ايفون 15 برو → iphone-15-pro-saudi
• ساعة ذكية → smart-watch-samsung
• عسل سدر → sidr-honey-natural

قواعد الترجمة:
• استخدم الكلمات الإنجليزية الشائعة
• ترجم المفاهيم وليس الكلمات حرفياً
• اختصر بذكاء مع الحفاظ على المعنى
• أضف كلمة مميزة إذا لزم الأمر

اكتب مسار URL فقط (بدون http أو نقاط):`;
  },

  // Enhanced Image Alt Text Generation
  generateImageAlt: (product) => {
    const keyword = product.keyword || product.name;
    
    return `أنت خبير في كتابة النص البديل للصور (Alt Text) المحسن للسيو. اكتب alt text مثالي.

المنتج: "${product.name}"
الكلمة المفتاحية: "${keyword}"

معايير Alt Text المثالي:
✅ الطول: 10-15 كلمة
✅ يحتوي على الكلمة المفتاحية بشكل طبيعي
✅ يصف الصورة بدقة للمكفوفين
✅ يذكر اللون والحجم والشكل إذا أمكن
✅ يساعد في فهم المحتوى بدون رؤية الصورة
✅ لا يستخدم كلمات "صورة" أو "صورة لـ"

أمثلة alt text ناجحة:
• "${keyword} باللون الأبيض على خلفية بيضاء"
• "${keyword} عالي الجودة مع العبوة الأصلية"
• "${keyword} يظهر من الأمام مع الملحقات"

عناصر وصفية مهمة:
🎨 الألوان الواضحة
📏 الحجم أو القياس
🔍 التفاصيل المرئية
📦 العبوة أو التغليف
⚡ الحالة (جديد، مستعمل، etc.)

اكتب Alt Text فقط (10-15 كلمة):`;
  },

  // Comprehensive Generation Prompt
  generateAll: (product) => {
    const keyword = product.keyword || 'منتج';
    const category = product.category || 'عام';
    const tone = product.tone || 'محايدة';
    const audience = product.target_audience || 'عام';
    const storyArc = product.best_story_arc || 'مشكلة-حل';
    
    return `أنت خبير تسويق رقمي ومتخصص SEO محترف مع 15+ سنة خبرة في السوق السعودي. مهمتك إنشاء حملة SEO متكاملة لهذا المنتج.

معلومات المشروع:
🏷️ المنتج: "${product.name}"
🎯 الكلمة المفتاحية المستهدفة: "${keyword}"
📂 فئة المنتج: "${category}"
👥 الجمهور المستهدف: "${audience}"
🎭 النغمة المطلوبة: "${tone}"
📖 الحبكة التسويقية: "${storyArc}"

أهداف الحملة:
🎯 ترتيب أول صفحة لـ "${keyword}"
📈 تحسين معدل التحويل CTR بـ 25%
🛒 زيادة المبيعات من البحث العضوي
🌟 بناء سلطة في فئة "${category}"
📱 تحسين تجربة المستخدم للجوال

معايير SEO الإجبارية (يجب تطبيقها 100%):

1️⃣ تحسين الكلمة المفتاحية:
- استخدام "${keyword}" في أول 25 كلمة من الوصف
- كثافة 2-3% في المحتوى
- توزيع طبيعي بدون حشو

2️⃣ جودة المحتوى:
- وصف 150+ كلمة (مفصل ومفيد)
- هيكل HTML منظم ومنسق
- معلومات تقنية دقيقة ومواصفات
- روابط داخلية ذات صلة

3️⃣ تحسين العناوين:
- Page Title: 50-58 حرف بالضبط
- يحتوي الكلمة المفتاحية والفائدة الرئيسية
- جذاب للنقر (High CTR)

4️⃣ Meta Description:
- 150-155 حرف بالضبط
- دعوة واضحة للعمل
- فوائد ملموسة

5️⃣ العناصر التقنية:
- URL صديق لمحركات البحث
- Alt Text وصفي ومحسن
- تحسين للجوال والسرعة

هيكل الوصف المطلوب (اتبعه بدقة):

المقدمة القوية (25 كلمة):
"${keyword} [شرح الفائدة الرئيسية والحل المقدم للعميل في ${category}]"

القسم الرئيسي:
<h3>🌟 لماذا ${keyword} هو الخيار الأمثل؟</h3>
<ul>
<li><strong>الجودة المضمونة:</strong> [تفاصيل الجودة والمواد]</li>
<li><strong>السعر التنافسي:</strong> [قيمة مقابل المال]</li>
<li><strong>الضمان والخدمة:</strong> [معلومات الضمان وخدمة العملاء]</li>
<li><strong>التوصيل السريع:</strong> [معلومات الشحن في السعودية]</li>
</ul>

<h3>📋 المواصفات التفصيلية</h3>
<p>[مواصفات دقيقة: الحجم، الوزن، المواد، الألوان، الأبعاد، etc.]</p>

<h3>💡 طريقة الاستخدام المثلى</h3>
<p>[خطوات واضحة لأفضل استفادة من المنتج]</p>

<h3>⭐ آراء العملاء ولماذا يختارونا</h3>
<p>[فوائد حقيقية يحصل عليها العملاء + إحصائيات إن أمكن]</p>

الخاتمة مع CTA:
<p><strong>🛒 احصل على ${keyword} الآن بأفضل سعر في السعودية!</strong> ضمان الجودة وإرجاع مجاني لمدة 14 يوم. <a href="/category/${category}" title="المزيد من منتجات ${category}">تصفح المزيد من منتجات ${category}</a> أو <a href="/offers" title="العروض الحالية">شاهد العروض الحالية</a>.</p>

المخرج المطلوب (JSON فقط):
{
  "name": "عنوان محسن للمنتج يحتوي الكلمة المفتاحية (أقل من 70 حرف)",
  "description": "الوصف HTML الكامل حسب الهيكل أعلاه",
  "keyword": "${keyword}",
  "meta_title": "Page Title محسن (50-58 حرف بالضبط)",
  "meta_description": "Meta Description جذاب (150-155 حرف بالضبط)",
  "url_path": "مسار-url-صديق-للسيو-باللغة-الانجليزية",
  "imageAlt": "وصف بديل للصورة يحتوي الكلمة المفتاحية (10-15 كلمة)"
}

⚠️ تنبيهات مهمة:
- اجعل المحتوى طبيعي وغير مكرر
- استخدم البيانات الحقيقية للمنتج المذكور
- لا تبالغ في الادعاءات
- تأكد من دقة أطوال النصوص
- اجعل الروابط الداخلية منطقية وذات صلة

ابدأ بكتابة JSON الآن:`;
  }
};

// ✅ FIXED: Enhanced utility functions
const cleanText = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/^["']+|["']+$/g, '') // Remove leading/trailing quotes
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\s+/g, ' '); // Normalize spaces
};

const truncateText = (text, maxLength) => {
  const cleaned = cleanText(text);
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength - 1) + "…" : cleaned;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getScoreColor = (score) => {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

// ✅ ENHANCED: Core SEO Criteria Checker with Product Size
const checkCoreCriteria = (product) => {
  const criteria = [];
  const keyword = cleanText(product.keyword?.toLowerCase()) || "";
  const title = cleanText(product.name?.toLowerCase()) || "";
  const description = cleanText(product.description?.replace(/<[^>]*>/g, ' ')) || "";
  const metaTitle = cleanText(product.meta_title?.toLowerCase()) || "";
  const metaDescription = cleanText(product.meta_description) || "";
  const imageAlt = cleanText(product.imageAlt?.toLowerCase()) || "";
  
  const descriptionWords = description.split(/\s+/).filter(word => word.length > 0);
  const first25Words = descriptionWords.slice(0, 25).join(' ').toLowerCase();

  // 1. Using the ideal focus keyword
  criteria.push({
    id: 'focus_keyword',
    text: 'استخدام الكلمة المفتاحية المثالية',
    status: keyword ? 'pass' : 'fail'
  });

  // 2. Including focus keyword in product title
  criteria.push({
    id: 'keyword_in_title',
    text: 'تضمين الكلمة المفتاحية في عنوان المنتج',
    status: keyword && title.includes(keyword) ? 'pass' : 'fail'
  });

  // 3. Including focus keyword in first 25 words of description
  criteria.push({
    id: 'keyword_in_first_25',
    text: 'تضمين الكلمة المفتاحية في أول 25 كلمة من الوصف',
    status: keyword && first25Words.includes(keyword) ? 'pass' : 'fail'
  });

  // 4. Including focus keyword in SEO title (Page Title)
  criteria.push({
    id: 'keyword_in_meta_title',
    text: 'تضمين الكلمة المفتاحية في Page Title عنوان السيو',
    status: keyword && metaTitle.includes(keyword) ? 'pass' : 'fail'
  });

  // 5. Using meta description (Page Description)
  criteria.push({
    id: 'has_meta_description',
    text: 'استخدام Page Description وصف الميتا',
    status: metaDescription.length > 0 ? 'pass' : 'fail'
  });

  // 6. Description length at least 120 words
  criteria.push({
    id: 'description_length',
    text: `طول الوصف لا يقل عن 120 كلمة (حالياً: ${descriptionWords.length} كلمة)`,
    status: descriptionWords.length >= 120 ? 'pass' : 'fail'
  });

  // 7. Using internal backlinks (check for any links in description)
  const hasLinks = /<a\s+[^>]*href=[^>]*>/i.test(product.description || '');
  criteria.push({
    id: 'internal_links',
    text: 'استخدام روابط داخلية',
    status: hasLinks ? 'pass' : 'fail'
  });

  // 8. Image ALT text includes focus keyword or product title
  const altIncludesKeyword = keyword && imageAlt.includes(keyword);
  const altIncludesTitle = product.name && imageAlt.includes(cleanText(product.name.toLowerCase()));
  criteria.push({
    id: 'image_alt_keyword',
    text: 'نص ALT للصورة يحتوي على الكلمة المفتاحية أو عنوان المنتج',
    status: altIncludesKeyword || altIncludesTitle ? 'pass' : 'fail'
  });

  // ✅ NEW: Product specifications/size mentioned
  const hasSpecs = /\d+(مل|جرام|كيلو|لتر|سم|متر|قطعة|حبة|عبوة|ml|g|kg|l|cm|m|piece)/i.test(description) ||
                   /\d+(مل|جرام|كيلو|لتر|سم|متر|قطعة|حبة|عبوة|ml|g|kg|l|cm|m|piece)/i.test(title);
  criteria.push({
    id: 'product_specs',
    text: 'ذكر مواصفات المنتج (الحجم، الكمية، الأبعاد)',
    status: hasSpecs ? 'pass' : 'fail'
  });

  // ✅ NEW: Call-to-action present
  const hasCTA = /(اشتري|اطلب|احصل|استفد|تسوق|اشتر|اضف للسلة|اطلب الآن)/i.test(description);
  criteria.push({
    id: 'call_to_action',
    text: 'وجود دعوة واضحة لاتخاذ إجراء (CTA)',
    status: hasCTA ? 'pass' : 'fail'
  });

  const passedCount = criteria.filter(c => c.status === 'pass').length;
  const totalCount = criteria.length;
  const score = Math.round((passedCount / totalCount) * 100);

  return {
    criteria,
    score,
    passedCount,
    totalCount
  };
};

// Enhanced SEO Display Component
const EnhancedSEODisplay = ({ analysis, product }) => {
  const [showAdditionalCriteria, setShowAdditionalCriteria] = useState(false);

  // Get core criteria results
  const coreResults = checkCoreCriteria(product);

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            تحليل السيو المتقدم
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-600">--</div>
            <div className="text-xs text-gray-500">النقاط</div>
          </div>
        </div>
        <div className="text-center text-gray-400 py-8">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">أدخل بيانات المنتج لبدء التحليل المتقدم</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'text-green-700 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'fail': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          تحليل السيو المتقدم
        </h2>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(coreResults.score)}`}>
            {coreResults.score}%
          </div>
          <div className="text-xs text-gray-500">
            {coreResults.passedCount}/{coreResults.totalCount} معيار متقدم
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            coreResults.score >= 85 ? 'bg-green-500' : 
            coreResults.score >= 70 ? 'bg-blue-500' :
            coreResults.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${coreResults.score}%` }}
        />
      </div>

      {/* Core Criteria */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          المعايير المتقدمة للسيو
        </h3>
        
        <div className="space-y-2">
          {coreResults.criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${getStatusColor(criterion.status)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(criterion.status)}
              </div>
              <div className="flex-1 leading-relaxed">
                {criterion.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Interpretation */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="text-sm font-medium text-blue-900 mb-1">
          {coreResults.score >= 85 && "🏆 مستوى احترافي! SEO متقدم ومكتمل"}
          {coreResults.score >= 70 && coreResults.score < 85 && "⭐ جيد جداً! قريب من المستوى الاحترافي"}
          {coreResults.score >= 50 && coreResults.score < 70 && "📈 متوسط - يحتاج تحسينات مهمة"}
          {coreResults.score < 50 && "🚀 ابدأ رحلة التحسين للوصول للمستوى المطلوب"}
        </div>
        <div className="text-xs text-blue-700">
          تطبيق المعايير المتقدمة يضمن ترتيب أفضل ومنافسة قوية في نتائج البحث
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ProductSEO() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedProduct = location.state?.product;

  // Main state
  const [product, setProduct] = useState({});
  const [originalProduct, setOriginalProduct] = useState({});
  const [score, setScore] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fieldLoading, setFieldLoading] = useState("");
  const [productAnalysis, setProductAnalysis] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // User subscription info and trial tracking
  const [userPlan, setUserPlan] = useState("free");
  const [canUseAI, setCanUseAI] = useState(false);
  const [trialUsage, setTrialUsage] = useState({ used: 0, limit: 3, resetDate: null });
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load user plan and trial usage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    const plan = subscription.plan || user.plan || "free";
    
    // Check if this is the site owner - full access always
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    setUserPlan(isOwner ? "owner" : plan);
    setCanUseAI(true); // Always true for now
    setIsTrialExpired(false); // Never expired for testing

    // Load trial usage only for non-owner free users
    if (!isOwner && plan === "free") {
      loadTrialUsage();
    }
  }, []);

  const loadTrialUsage = () => {
    const usage = JSON.parse(localStorage.getItem("seo_trial_usage") || "{}");
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    // Reset if new month
    if (!usage.month || usage.month !== currentMonth) {
      const newUsage = {
        used: 0,
        limit: 3,
        month: currentMonth,
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
      };
      localStorage.setItem("seo_trial_usage", JSON.stringify(newUsage));
      setTrialUsage(newUsage);
      setIsTrialExpired(false);
    } else {
      setTrialUsage(usage);
      setIsTrialExpired(usage.used >= usage.limit);
    }
  };

  const incrementTrialUsage = () => {
    const usage = JSON.parse(localStorage.getItem("seo_trial_usage") || "{}");
    usage.used = (usage.used || 0) + 1;
    localStorage.setItem("seo_trial_usage", JSON.stringify(usage));
    setTrialUsage(usage);
    setIsTrialExpired(usage.used >= usage.limit);
  };

  const checkTrialAccess = () => {
    // Site owner always has access
    if (userPlan === "owner") return true;
    if (userPlan !== "free") return true;
    return trialUsage.used < trialUsage.limit;
  };

  const showUpgradePrompt = () => {
    setShowUpgradeModal(true);
  };

  // Load product data
  useEffect(() => {
    loadProduct();
  }, [id, passedProduct]);

  // Analyze SEO when product changes
  useEffect(() => {
    if (Object.keys(product).length > 0) {
      const result = analyzeSEO(product);
      setScore(result);
    }
  }, [
    product.name,
    product.description,
    product.keyword,
    product.meta_title,
    product.meta_description,
    product.url_path,
    product.imageAlt,
  ]);

  // Track unsaved changes
  useEffect(() => {
    if (Object.keys(originalProduct).length > 0) {
      const hasChanges = JSON.stringify(product) !== JSON.stringify(originalProduct);
      setHasUnsavedChanges(hasChanges);
    }
  }, [product, originalProduct]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      let productData = null;

      if (passedProduct) {
        productData = passedProduct;
      } else if (id) {
        // Try localStorage only for now
        const saved = JSON.parse(localStorage.getItem("saved_products") || "[]");
        productData = saved.find(p => p.id == id);
      }

      if (productData) {
        setProduct(productData);
        setOriginalProduct(JSON.parse(JSON.stringify(productData)));
      } else {
        throw new Error("المنتج غير موجود");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      setErrors({ load: error.message || "فشل في تحميل بيانات المنتج" });
      toast.error("فشل في تحميل بيانات المنتج");
    } finally {
      setLoading(false);
    }
  }, [id, passedProduct]);

  const handleProductChange = useCallback((field, value) => {
    // ✅ FIXED: Clean the value before setting
    const cleanedValue = field === 'keyword' ? cleanText(value) : value;
    
    setProduct(prev => ({
      ...prev,
      [field]: cleanedValue,
      lastUpdated: new Date().toISOString()
    }));
    
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateProduct = useCallback(() => {
    const newErrors = {};
    
    if (!product.name?.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    } else if (product.name.length > FIELD_LIMITS.name_limit) {
      newErrors.name = `اسم المنتج يجب ألا يتجاوز ${FIELD_LIMITS.name_limit} حرف`;
    }

    if (product.meta_title && product.meta_title.length > FIELD_LIMITS.meta_title) {
      newErrors.meta_title = `Page Title يجب ألا يتجاوز ${FIELD_LIMITS.meta_title} حرف`;
    }

    if (product.meta_description && product.meta_description.length > FIELD_LIMITS.meta_description) {
      newErrors.meta_description = `Page Description يجب ألا يتجاوز ${FIELD_LIMITS.meta_description} حرف`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [product]);

  const handleSave = useCallback(async () => {
    if (!validateProduct()) {
      toast.error("يرجى تصحيح الأخطاء قبل الحفظ");
      return;
    }

    setSaving(true);
    setErrors(prev => ({ ...prev, save: null }));

    try {
      const payload = {
        name: product.name || "",
        description: product.description || "",
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
        url_path: product.url_path || "",
        keyword: cleanText(product.keyword) || "", // ✅ Clean keyword on save
        category: product.category || "",
        target_audience: product.target_audience || "",
        tone: product.tone || "",
        best_story_arc: product.best_story_arc || "",
        imageAlt: product.imageAlt || "",
        lastUpdated: new Date().toISOString()
      };

      // Update localStorage
      const saved = JSON.parse(localStorage.getItem("saved_products") || "[]");
      const index = saved.findIndex(p => p.id === product.id);
      const updatedProduct = { ...product, ...payload };
      
      if (index !== -1) {
        saved[index] = updatedProduct;
      } else {
        saved.push(updatedProduct);
      }
      
      localStorage.setItem("saved_products", JSON.stringify(saved));
      setProduct(updatedProduct);
      setOriginalProduct(JSON.parse(JSON.stringify(updatedProduct)));

      toast.success("تم حفظ التعديلات بنجاح! ✅");
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "حدث خطأ أثناء الحفظ";
      setErrors(prev => ({ ...prev, save: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setSaving(false);
    }
  }, [product, validateProduct]);

  const handleAnalyzeProduct = useCallback(async () => {
    if (!product.name?.trim()) {
      setErrors(prev => ({ ...prev, analyze: "اسم المنتج مطلوب للتحليل" }));
      return;
    }

    const {
      categorizeProduct,
      analyzeTargetAudience,
      selectTone,
      selectStoryArc
    } = analyzeSEO(product);

    setGenerating(true);
    setErrors(prev => ({ ...prev, analyze: null }));

    try {
      console.log('🔄 Starting advanced product analysis...');

      // ✅ ENHANCED: Use new advanced keyword generation
      const keywordResponse = await generateProductSEO(ENHANCED_SEO_PROMPTS.generateKeyword(product));
      const keyword = cleanText(keywordResponse);
      console.log('✅ Generated advanced keyword:', keyword);

      // Category analysis
      const categoryPrompt = await categorizeProduct(product);
      const category = cleanText(await generateProductSEO(categoryPrompt));
      console.log('✅ Generated category:', category);

      // Target audience analysis
      const audiencePrompt = await analyzeTargetAudience(product, category);
      const targetAudience = cleanText(await generateProductSEO(audiencePrompt));
      console.log('✅ Generated audience:', targetAudience);

      const tone = selectTone(category, targetAudience);
      const bestStoryArc = selectStoryArc(category);

      const analysis = {
        category: category,
        target_audience: targetAudience,
        tone: tone,
        best_story_arc: bestStoryArc
      };
      
      setProduct(prev => ({
        ...prev,
        keyword: keyword,
        category: analysis.category || "",
        target_audience: analysis.target_audience || "",
        tone: analysis.tone || "",
        best_story_arc: analysis.best_story_arc || "",
      }));

      setProductAnalysis(analysis);
      
      toast.success("تم التحليل المتقدم بنجاح! 🎯");
      
    } catch (error) {
      console.error("Error analyzing product:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "فشل في تحليل المنتج";
      setErrors(prev => ({ ...prev, analyze: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [product.name, product.description]);

  const handleGenerateAll = useCallback(async () => {
    if (!product.name?.trim()) {
      setErrors(prev => ({ ...prev, generate: "اسم المنتج مطلوب للتوليد" }));
      return;
    }

    setGenerating(true);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      console.log('🔄 Starting comprehensive enhanced generation...');

      // Ensure we have analysis data
      let analysisData = productAnalysis;
      if (!analysisData) {
        await handleAnalyzeProduct();
        analysisData = {
          category: product.category || "عام",
          target_audience: product.target_audience || "عام",
          tone: product.tone || "محايدة",
          best_story_arc: product.best_story_arc || "مشكلة-حل"
        };
      }

      // ✅ ENHANCED: Use new comprehensive generation prompt
      console.log('📤 Sending enhanced comprehensive generation request...');
      const generated = await generateProductSEO(ENHANCED_SEO_PROMPTS.generateAll(product));
      console.log('📥 Received enhanced response:', generated.substring(0, 200) + '...');
      
      const jsonMatch = generated.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("لم يتم العثور على JSON صالح في الإجابة المحسنة");
      }

      const fields = JSON.parse(jsonMatch[0]);

      // ✅ ENHANCED: Clean and validate all generated fields
      const processedFields = {
        name: truncateText(fields.name, FIELD_LIMITS.name_limit),
        description: fields.description || "",
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
        keyword: cleanText(fields.keyword),
        url_path: cleanText(fields.url_path),
        imageAlt: cleanText(fields.imageAlt),
      };

      console.log('✅ Processed enhanced fields:', processedFields);

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      toast.success("تم توليد المحتوى المتقدم بنجاح! ⭐✨");

    } catch (error) {
      console.error("Error generating enhanced fields:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "فشل في توليد المحتوى المتقدم";
      setErrors(prev => ({ ...prev, generate: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [product, productAnalysis, handleAnalyzeProduct]);

  const handleGenerateField = useCallback(async (fieldType) => {
    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      console.log(`🔄 Generating enhanced field: ${fieldType}`);
      
      // ✅ ENHANCED: Use new field-specific prompts
      const prompts = {
        keyword: ENHANCED_SEO_PROMPTS.generateKeyword(product),
        description: ENHANCED_SEO_PROMPTS.generateDescription(product),
        meta_title: ENHANCED_SEO_PROMPTS.generateMetaTitle(product),
        meta_description: ENHANCED_SEO_PROMPTS.generateMetaDescription(product),
        url_path: ENHANCED_SEO_PROMPTS.generateUrlPath(product),
        imageAlt: ENHANCED_SEO_PROMPTS.generateImageAlt(product)
      };

      const prompt = prompts[fieldType];
      if (!prompt) {
        throw new Error(`لا يوجد برومبت محسن للحقل: ${fieldType}`);
      }

      const response = await generateProductSEO(prompt);
      let value = cleanText(response); // ✅ Clean the response

      // Apply field-specific processing
      if (fieldType === "meta_title") {
        value = truncateText(value, FIELD_LIMITS.meta_title);
      } else if (fieldType === "meta_description") {
        value = truncateText(value, FIELD_LIMITS.meta_description);
      }

      console.log(`✅ Generated enhanced ${fieldType}:`, value);

      setProduct(prev => ({
        ...prev,
        [fieldType]: value,
      }));

      const fieldLabels = {
        keyword: 'الكلمة المفتاحية المتقدمة',
        description: 'الوصف المحسن',
        meta_title: 'Page Title المحسن',
        meta_description: 'Page Description المحسن',
        url_path: 'مسار الرابط المحسن',
        imageAlt: 'النص البديل المحسن'
      };

      toast.success(`تم توليد ${fieldLabels[fieldType]} بنجاح! 🎯⭐`);

    } catch (error) {
      console.error(`Error generating enhanced ${fieldType}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `فشل في توليد ${fieldType} المحسن`;
      setErrors(prev => ({ ...prev, [fieldType]: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setFieldLoading("");
    }
  }, [product]);

  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label} للحافظة! 📋`);
    } catch (error) {
      toast.error("فشل في النسخ");
    }
  }, []);

  const renderInputField = useCallback((label, key, multiline = false, placeholder = "", icon = null) => {
    const hasError = errors[key];
    const isLoading = fieldLoading === key;
    const fieldValue = product[key] || "";
    
    // Character count for limited fields
    const showCharCount = ['meta_title', 'meta_description', 'name'].includes(key);
    const charLimit = FIELD_LIMITS[key + '_limit'] || FIELD_LIMITS[key];
    const charCount = fieldValue.length;
    const isOverLimit = charLimit && charCount > charLimit;

    if (key === "description") {
      return (
        <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {icon}
              {label}
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">Enhanced AI</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerateField(key)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                  isLoading 
                    ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                }`}
                disabled={isLoading}
                title="توليد متقدم بالذكاء الاصطناعي"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                    توليد متقدم...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    توليد متقدم
                  </>
                )}
              </button>
              {fieldValue && (
                <button
                  onClick={() => copyToClipboard(fieldValue, label)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  title="نسخ"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          
          <TiptapEditor
            value={fieldValue}
            onChange={(val) => handleProductChange(key, val)}
            placeholder={placeholder}
          />
          
          {hasError && (
            <div className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {hasError}
            </div>
          )}
          
          {/* Enhanced rich text editor note */}
          <div className="text-xs text-gray-500 mt-2">
            ⭐ المحرر المتقدم: يدعم <strong>التنسيق المتقدم</strong>، <strong>الروابط الداخلية المحسنة</strong>، والقوائم المنظمة للسيو
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            {icon}
            {label}
            {key === 'keyword' && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">AI Advanced</span>}
          </label>
          <div className="flex items-center gap-2">
            {showCharCount && (
              <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}{charLimit && `/${charLimit}`}
              </span>
            )}
            <button
              onClick={() => handleGenerateField(key)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                isLoading 
                  ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                  : key === 'keyword' 
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
              }`}
              disabled={isLoading}
              title="توليد متقدم بالذكاء الاصطناعي"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                  متقدم...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  متقدم
                </>
              )}
            </button>
            {fieldValue && (
              <button
                onClick={() => copyToClipboard(fieldValue, label)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                title="نسخ"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        {multiline ? (
          <textarea
            value={fieldValue}
            onChange={(e) => handleProductChange(key, e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 resize-y min-h-[120px] transition-colors ${
              hasError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            rows={4}
          />
        ) : (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleProductChange(key, e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              hasError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        )}
        
        {hasError && (
          <div className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {hasError}
          </div>
        )}

        {/* Enhanced field-specific hints */}
        {key === 'meta_title' && (
          <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded mt-2">
            ⭐ Page Title المتقدم: 50-58 حرف، كلمة مفتاحية قوية، عنصر تحفيزي، معدل نقر عالي
          </div>
        )}
        {key === 'meta_description' && (
          <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded mt-2">
            ⭐ Page Description المتقدم: 150-155 حرف، فائدة واضحة، دعوة للعمل، ميزة تنافسية
          </div>
        )}
        {key === 'keyword' && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
            🎯 الكلمة المفتاحية المتقدمة: تحليل حجم البحث، المنافسة، نية الشراء، والسوق السعودي
          </div>
        )}
        {key === 'url_path' && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
            ⚠️ إذا كان الموقع مفهرس مسبقاً، لا تعدل هذا الحقل حيث قد يؤثر على الفهرسة
          </div>
        )}
      </div>
    );
  }, [product, errors, fieldLoading, handleGenerateField, handleProductChange, copyToClipboard]);

  // Progress calculation using core criteria
  const progress = useMemo(() => {
    const coreResults = checkCoreCriteria(product);
    return coreResults.score;
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل نظام السيو المتقدم...</p>
        </div>
      </div>
    );
  }

  if (errors.load) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-6">{errors.load}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              العودة للمنتجات
            </button>
            <button
              onClick={loadProduct}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link 
                to="/products" 
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للمنتجات
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Crown className="w-6 h-6 text-purple-500" />
                تحليل وتحسين السيو المتقدم
              </h1>
              {hasUnsavedChanges && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  تغييرات غير محفوظة
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'إخفاء المعاينة' : 'معاينة Google'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {(errors.save || errors.generate || errors.analyze) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">خطأ:</span>
                <span>{errors.save || errors.generate || errors.analyze}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Enhanced Product Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    معلومات المنتج المتقدمة
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateAll}
                      disabled={generating}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        generating 
                          ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
                      }`}
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                          توليد متقدم جاري...
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          توليد شامل متقدم بالـ AI
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !hasUnsavedChanges}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        saving 
                          ? "bg-purple-100 text-purple-700 cursor-not-allowed"
                          : hasUnsavedChanges
                            ? "bg-purple-600 text-white hover:bg-purple-700" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border border-purple-600 border-t-transparent"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          حفظ التغييرات
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Last Updated */}
                {product.lastUpdated && (
                  <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    آخر تحديث: {formatDate(product.lastUpdated)}
                  </div>
                )}

                {/* Enhanced Product Analysis Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      تحليل المنتج والسوق المتقدم
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">AI Enhanced</span>
                    </h3>
                    <button
                      onClick={handleAnalyzeProduct}
                      disabled={generating}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                        generating 
                          ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      }`}
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                          تحليل متقدم...
                        </>
                      ) : (
                        <>
                          <Crown className="w-3 h-3" />
                          تحليل متقدم
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">📦 فئة المنتج</label>
                      <input
                        type="text"
                        value={product.category || ""}
                        onChange={(e) => handleProductChange('category', e.target.value)}
                        placeholder="مثل: إلكترونيات، ملابس، منزل..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">🎯 الجمهور المستهدف</label>
                      <input
                        type="text"
                        value={product.target_audience || ""}
                        onChange={(e) => handleProductChange('target_audience', e.target.value)}
                        placeholder="مثل: الشباب، العائلات، المهنيين..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">🎭 النغمة</label>
                      <select
                        value={product.tone || ""}
                        onChange={(e) => handleProductChange('tone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        {TONE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">📖 الحبكة التسويقية</label>
                      <select
                        value={product.best_story_arc || ""}
                        onChange={(e) => handleProductChange('best_story_arc', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        {STORY_ARC_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Google Preview */}
              {showPreview && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    معاينة نتائج Google المحسنة
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Live Preview</span>
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {product.meta_title || product.name || "عنوان المنتج المحسن"}
                    </div>
                    <div className="text-green-600 text-sm mt-1">
                      https://example.com/{product.url_path || "enhanced-product"}
                    </div>
                    <div className="text-gray-600 text-sm mt-2 leading-relaxed">
                      {product.meta_description || "وصف المنتج المحسن سيظهر هنا مع أفضل معايير السيو..."}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced SEO Fields */}
              <div className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Type className="w-5 h-5 text-purple-500" />
                    المعلومات الأساسية المحسنة
                  </h3>
                  
                  {renderInputField(
                    "اسم المنتج", 
                    "name", 
                    false, 
                    "أدخل اسم المنتج الجذاب والواضح...", 
                    <Package className="w-4 h-4 text-purple-500" />
                  )}
                  
                  {renderInputField(
                    "الكلمة المفتاحية المتقدمة", 
                    "keyword", 
                    false, 
                    "سيتم تحليل حجم البحث والمنافسة في السوق السعودي...", 
                    <Search className="w-4 h-4 text-green-500" />
                  )}
                </div>

                {/* Enhanced Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-green-500" />
                    وصف المنتج المحسن للسيو
                  </h3>
                  
                  {renderInputField(
                    "وصف المنتج التفصيلي المحسن", 
                    "description", 
                    true, 
                    "سيتم إنشاء وصف احترافي محسن للسيو مع HTML منظم وروابط داخلية...", 
                    <FileText className="w-4 h-4 text-green-500" />
                  )}
                </div>

                {/* Enhanced Page Title & Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-purple-500" />
                    Page Title & Description المحسنين
                  </h3>
                  
                  {renderInputField(
                    "Page Title المحسن للسيو", 
                    "meta_title", 
                    false, 
                    "سيتم إنشاء عنوان محسن بمعدل نقر عالي...", 
                    <Type className="w-4 h-4 text-purple-500" />
                  )}
                  
                  {renderInputField(
                    "Page Description المحسن", 
                    "meta_description", 
                    true, 
                    "سيتم إنشاء وصف ميتا محسن يحفز على النقر...", 
                    <FileText className="w-4 h-4 text-purple-500" />
                  )}
                </div>

                {/* Enhanced Technical SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    السيو التقني المتقدم
                  </h3>
                  
                  {renderInputField(
                    "مسار الرابط المحسن (URL Slug)", 
                    "url_path", 
                    false, 
                    "enhanced-product-seo-optimized", 
                    <Globe className="w-4 h-4 text-orange-500" />
                  )}
                  
                  {renderInputField(
                    "النص البديل المحسن للصورة", 
                    "imageAlt", 
                    false, 
                    "سيتم إنشاء وصف محسن للصورة مع الكلمة المفتاحية...", 
                    <Image className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              
              {/* Enhanced SEO Score */}
              <EnhancedSEODisplay analysis={score} product={product} />

              {/* ✅ ENHANCED: Advanced Tips with New SEO Criteria */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  نصائح السيو المتقدمة
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-500 mt-0.5">🎯</div>
                    <div>
                      <strong>الكلمة المفتاحية المتقدمة:</strong> تحليل حجم البحث +2000 شهرياً ومنافسة متوسطة في السوق السعودي
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-500 mt-0.5">📊</div>
                    <div>
                      <strong>Page Title المتقدم:</strong> 50-58 حرف بالضبط مع كلمة تحفيزية ومعدل نقر عالي (CTR 15%+)
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-green-500 mt-0.5">📝</div>
                    <div>
                      <strong>الوصف المتقدم:</strong> 150+ كلمة، هيكل HTML منظم، كثافة كلمة مفتاحية 2-3%، روابط داخلية
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-500 mt-0.5">🎨</div>
                    <div>
                      <strong>المحتوى التفاعلي:</strong> استخدم العناوين الفرعية H3، القوائم المنظمة، والصور المحسنة
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="text-red-500 mt-0.5">🛒</div>
                    <div>
                      <strong>تحفيز التحويل:</strong> دعوات واضحة للعمل، مواصفات دقيقة، وضمانات ملموسة
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="text-yellow-500 mt-0.5">⚡</div>
                    <div>
                      <strong>السرعة والجوال:</strong> محسن للأجهزة المحمولة، سرعة تحميل عالية، وتجربة مستخدم متميزة
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  ملخص الأداء المتقدم
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">نقاط السيو المتقدم</span>
                    <span className={`font-bold ${getScoreColor(progress)}`}>
                      {progress}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        progress >= 85 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                        progress >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        progress >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    {progress >= 85 && "🏆 مستوى خبير! SEO احترافي متقدم"}
                    {progress >= 70 && progress < 85 && "⭐ متقدم جداً! قريب من الكمال"}
                    {progress >= 50 && progress < 70 && "📈 جيد - يحتاج تحسينات إضافية"}
                    {progress < 50 && "🚀 ابدأ التحسين المتقدم"}
                  </div>
                  
                  {/* Enhanced Core Field completion status */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-700 mb-2">المعايير المتقدمة:</div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {[
                        { key: 'keyword', label: 'كلمة مفتاحية متقدمة' },
                        { key: 'name', label: 'عنوان محسن' },
                        { key: 'description', label: 'وصف متقدم 150+ كلمة' },
                        { key: 'meta_title', label: 'Page Title محسن' },
                        { key: 'meta_description', label: 'Meta Description متقدم' },
                        { key: 'imageAlt', label: 'Image Alt محسن' },
                        { key: 'specs', label: 'مواصفات تقنية' },
                        { key: 'cta', label: 'دعوة للعمل قوية' }
                      ].map(field => {
                        const coreResults = checkCoreCriteria(product);
                        const criterion = coreResults.criteria.find(c => 
                          c.id.includes(field.key) || 
                          c.text.includes(field.label) ||
                          (field.key === 'specs' && c.id === 'product_specs') ||
                          (field.key === 'cta' && c.id === 'call_to_action')
                        );
                        const isComplete = criterion?.status === 'pass';
                        
                        return (
                          <div key={field.key} className="flex items-center gap-2">
                            {isComplete ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-gray-400" />
                            )}
                            <span className={isComplete ? 'text-green-700' : 'text-gray-500'}>
                              {field.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات متقدمة</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(product, null, 2), "بيانات المنتج المحسنة")}
                    className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ البيانات المحسنة
                  </button>
                  
                  <Link
                    to="/products"
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-colors flex items-center gap-2 justify-center"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    العودة للمنتجات
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}