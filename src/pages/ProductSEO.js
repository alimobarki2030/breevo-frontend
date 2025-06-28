// ✅ React imports يجب أن تكون الأولى دائماً
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ChevronRight,
  Brain,
  X
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { generateProductSEO } from "../utils/generateProductSEO";
import analyzeSEO from "../analyzeSEO";
import TiptapEditor from "../components/TiptapEditor";

// إعدادات البرومبت المخصص - الوحيد المستخدم
const CUSTOM_PROMPT_CONFIG = {
  promptId: "pmpt_685ffc0009bc81978d0bb122e0917a900a4178e0f8d7cd17",
  version: "2"
};

// Constants
const FIELD_LIMITS = {
  meta_title: 60,
  meta_description: 160,
  keyword_limit: 100,
  name_limit: 70
};

// خيارات الجمهور والنبرة
const AUDIENCE_OPTIONS = [
  { value: "العملاء العرب", label: "العملاء العرب (عام)" },
  { value: "النساء", label: "النساء" },
  { value: "الرجال", label: "الرجال" },
  { value: "الشباب", label: "الشباب" },
  { value: "العائلات", label: "العائلات" },
  { value: "المهنيين", label: "المهنيين" },
  { value: "عشاق الجمال", label: "عشاق الجمال" },
  { value: "الرياضيين", label: "الرياضيين" },
  { value: "الأمهات", label: "الأمهات" }
];

const TONE_OPTIONS = [
  { value: "احترافية", label: "احترافية - للشركات والمنتجات الطبية" },
  { value: "ودودة", label: "ودودة - للمنتجات العائلية" },
  { value: "حماسية", label: "حماسية - للمنتجات الرياضية" },
  { value: "فاخرة", label: "فاخرة - للمنتجات المميزة والعطور" },
  { value: "بسيطة", label: "بسيطة - للمنتجات اليومية" },
  { value: "عصرية", label: "عصرية - للمنتجات التقنية والشبابية" },
  { value: "مقنعة", label: "مقنعة - لزيادة المبيعات" }
];

// ✅ دالة البرومبت المخصص الوحيدة - بدون fallback
const generateWithCustomPrompt = async (variables) => {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("OpenAI API Key غير موجود في متغيرات البيئة");
  }

  // استخدام API الخاص بالبرومبتات المخصصة فقط
  const response = await fetch(`https://api.openai.com/v1/prompts/${CUSTOM_PROMPT_CONFIG.promptId}/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      variables: variables
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI Custom Prompt Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Utility functions
const truncateText = (text, maxLength) => {
  if (!text || typeof text !== "string") return "";
  return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
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

// Enhanced SEO Display Component
const EnhancedSEODisplay = ({ analysis, product }) => {
  const [showAdditionalCriteria, setShowAdditionalCriteria] = useState(false);

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            تحليل السيو
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-600">--</div>
            <div className="text-xs text-gray-500">النقاط</div>
          </div>
        </div>
        <div className="text-center text-gray-400 py-8">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">أدخل بيانات المنتج لبدء التحليل</p>
        </div>
      </div>
    );
  }

  const coreResults = analysis?.coreResults || { criteria: [], score: 0, passedCount: 0, totalCount: 0 };
  const additionalCategories = analysis?.categories || {};
  
  const additionalCriteria = [];
  Object.entries(additionalCategories).forEach(([categoryName, checks]) => {
    if (checks && Array.isArray(checks)) {
      checks.forEach(check => {
        additionalCriteria.push({
          ...check,
          category: categoryName
        });
      });
    }
  });

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
          تحليل السيو
        </h2>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(coreResults.score)}`}>
            {coreResults.score}%
          </div>
          <div className="text-xs text-gray-500">
            {coreResults.passedCount}/{coreResults.totalCount} معيار أساسي
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
          المعايير الأساسية
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

      {/* Additional Criteria - Collapsible */}
      {additionalCriteria.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              معايير إضافية ({additionalCriteria.length})
            </h3>
            <button
              onClick={() => setShowAdditionalCriteria(!showAdditionalCriteria)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {showAdditionalCriteria ? 'إخفاء' : 'عرض'}
              {showAdditionalCriteria ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          </div>
          
          {showAdditionalCriteria && (
            <div className="space-y-2">
              {additionalCriteria.map((criterion, index) => (
                <div
                  key={`additional-${index}`}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${getStatusColor(criterion.status)}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(criterion.status)}
                  </div>
                  <div className="flex-1 leading-relaxed">
                    <span className="text-xs text-gray-500 block mb-1">{criterion.category}</span>
                    {criterion.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Score Interpretation */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="text-sm font-medium text-blue-900 mb-1">
          {coreResults.score >= 85 && "ممتاز! جميع المعايير الأساسية مكتملة تقريباً"}
          {coreResults.score >= 70 && coreResults.score < 85 && "جيد جداً! معظم المعايير الأساسية مكتملة"}
          {coreResults.score >= 50 && coreResults.score < 70 && "يحتاج تحسين في المعايير الأساسية"}
          {coreResults.score < 50 && "ابدأ بتطبيق المعايير الأساسية"}
        </div>
        <div className="text-xs text-blue-700">
          أكمل المعايير الأساسية أولاً، ثم انتقل للمعايير الإضافية
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
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // User subscription info and trial tracking
  const [userPlan, setUserPlan] = useState("free");
  const [canUseAI, setCanUseAI] = useState(false);
  const [trialUsage, setTrialUsage] = useState({ used: 0, limit: 3, resetDate: null });
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Smart Generation Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(!localStorage.getItem("seen_seo_update_v2"));
  const [generateOptions, setGenerateOptions] = useState(() => {
    // تحميل الخيارات المحفوظة من localStorage
    const saved = localStorage.getItem("seo_generate_options");
    return saved ? JSON.parse(saved) : {
      productNameAction: "keep",
      keywordAction: "generate", 
      customKeyword: "",
      audience: "العملاء العرب", // جديد
      tone: "احترافية" // جديد
    };
  });

  // تنفيذ التوليد الذكي مع الخيارات المحددة - البرومبت المخصص فقط
  const executeSmartGeneration = useCallback(async () => {
    setGenerating(true);
    setShowGenerateModal(false);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      toast.loading("🧠 جاري التوليد الذكي بالبرومبت المخصص...", { id: 'generating' });

      if (userPlan === "free") {
        incrementTrialUsage();
      }

      // تحديد الكلمة المفتاحية حسب اختيار المستخدم
      let finalKeyword = "";
      if (generateOptions.keywordAction === "use_existing") {
        finalKeyword = generateOptions.customKeyword.trim();
      } else {
        // توليد كلمة مفتاحية جديدة باستخدام البرومبت المخصص
        try {
          const keywordResult = await generateWithCustomPrompt({
            product_name: product.name,
            task_type: "keyword_only",
            audience: generateOptions.audience,
            tone: generateOptions.tone
          });
          
          // استخراج الكلمة المفتاحية من النتيجة
          const cleanKeyword = keywordResult.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
          finalKeyword = cleanKeyword.split('\n')[0].replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\w]/g, '').trim();
        } catch (error) {
          console.error("Keyword generation failed:", error);
          throw new Error("فشل في توليد الكلمة المفتاحية بالبرومبت المخصص");
        }
      }

      // تحديد اسم المنتج حسب اختيار المستخدم
      let finalProductName = product.name;
      if (generateOptions.productNameAction === "add_keyword") {
        finalProductName = `${product.name} ${finalKeyword}`;
      } else if (generateOptions.productNameAction === "regenerate") {
        try {
          const nameResult = await generateWithCustomPrompt({
            product_name: product.name,
            keyword: finalKeyword,
            task_type: "product_name_only",
            audience: generateOptions.audience,
            tone: generateOptions.tone
          });
          
          const cleanName = nameResult.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
          finalProductName = cleanName.split('\n')[0].trim();
        } catch (error) {
          console.error("Product name generation failed:", error);
          throw new Error("فشل في تحسين اسم المنتج بالبرومبت المخصص");
        }
      }

      // **التوليد الرئيسي باستخدام البرومبت المخصص**
      const generated = await generateWithCustomPrompt({
        product_name: finalProductName,
        keyword: finalKeyword,
        audience: generateOptions.audience,
        tone: generateOptions.tone,
        task_type: "complete_seo" // إشارة للبرومبت أن هذا توليد شامل
      });
      
      // تنظيف النص المُولد قبل تحليل JSON
      let cleanedGenerated = generated
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // إزالة أحرف التحكم
        .replace(/\n/g, '\\n') // تحويل أسطر جديدة لصيغة JSON صالحة
        .replace(/\r/g, '\\r') // تحويل carriage returns
        .replace(/\t/g, '\\t') // تحويل tabs
        .trim();
      
      const jsonMatch = cleanedGenerated.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("فشل في توليد المحتوى - لم يتم العثور على JSON صالح من البرومبت المخصص");
      }

      let fields;
      try {
        fields = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Generated content:", generated);
        console.error("Cleaned content:", cleanedGenerated);
        throw new Error("فشل في تحليل المحتوى المُولد من البرومبت المخصص");
      }

      const processedFields = {
        keyword: finalKeyword,
        name: finalProductName,
        description: fields.description || "",
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
        url_path: fields.url_path?.trim() || "",
        imageAlt: fields.imageAlt?.trim() || ""
      };

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      toast.success("🎉 تم إنشاء محتوى احترافي بالبرومبت المخصص!", { id: 'generating' });
      
      if (userPlan === "free") {
        const remaining = trialUsage.limit - trialUsage.used - 1;
        toast.success(`✨ ${remaining} توليدة مجانية متبقية هذا الشهر`, { duration: 4000 });
      }

    } catch (error) {
      console.error("Error generating fields:", error);
      
      // رسائل خطأ واضحة للبرومبت المخصص
      let errorMessage = "فشل في التوليد بالبرومبت المخصص. تحقق من إعدادات API.";
      
      if (error.message.includes("JSON")) {
        errorMessage = "البرومبت المخصص لم يعطي JSON صالح. راجع إعدادات البرومبت.";
      } else if (error.message.includes("OpenAI Custom Prompt Error")) {
        errorMessage = "خطأ في استدعاء البرومبت المخصص. تحقق من API Key والمعرف.";
      } else if (error.message.includes("فشل في توليد")) {
        errorMessage = error.message; // استخدام الرسالة المحددة
      }
      
      toast.error("❌ " + errorMessage, { id: 'generating' });
      setErrors(prev => ({ ...prev, generate: errorMessage }));
    } finally {
      setGenerating(false);
    }
  }, [userPlan, trialUsage.used, trialUsage.limit, product.name, generateOptions]);

  // التوليد لحقل واحد - البرومبت المخصص فقط
  const handleGenerateField = useCallback(async (fieldType) => {
    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      // استخدام البرومبت المخصص لتوليد حقل واحد
      const response = await generateWithCustomPrompt({
        product_name: product.name,
        keyword: product.keyword || '',
        field_type: fieldType, // إخبار البرومبت أي حقل نريد توليده
        audience: generateOptions.audience,
        tone: generateOptions.tone,
        task_type: "single_field"
      });
      
      let value = response.trim();

      // تنظيف القيمة
      value = value.replace(/^["']|["']$/g, '');
      value = value.replace(/^`+|`+$/g, '');
      value = value.split('\n')[0].trim(); // أخذ السطر الأول فقط

      // تطبيق حدود الأحرف
      if (fieldType === "meta_title") {
        value = truncateText(value, FIELD_LIMITS.meta_title);
      } else if (fieldType === "meta_description") {
        value = truncateText(value, FIELD_LIMITS.meta_description);
      }

      setProduct(prev => ({
        ...prev,
        [fieldType]: value,
      }));

      const fieldLabels = {
        keyword: 'الكلمة المفتاحية',
        description: 'الوصف',
        meta_title: 'Page Title',
        meta_description: 'Page Description',
        url_path: 'مسار الرابط',
        imageAlt: 'النص البديل للصورة'
      };

      toast.success(`تم التوليد بالبرومبت المخصص لـ${fieldLabels[fieldType]}! 🎯`);

    } catch (error) {
      console.error(`Error generating ${fieldType}:`, error);
      const errorMessage = `فشل في توليد ${fieldType} بالبرومبت المخصص`;
      setErrors(prev => ({ ...prev, [fieldType]: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setFieldLoading("");
    }
  }, [product.name, product.keyword, generateOptions]);

  // باقي الدوال والـ renders...
  // [كود باقي المكونات يبقى كما هو]

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">البرومبت المخصص فقط</h1>
            <p className="text-gray-600">لا يوجد fallback - اعتماد كامل على البرومبت المخصص</p>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ تم إزالة جميع أنواع الـ Fallback - البرومبت المخصص فقط يعمل الآن
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}