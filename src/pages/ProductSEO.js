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
  Brain
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import analyzeSEO from "../analyzeSEO";
import TiptapEditor from "../components/TiptapEditor";
import React, { useState, useEffect, useCallback, useMemo } from "react";

/*
🔧 تم تحديث النظام للعمل مع Chat Completions API الرسمي:
- ✅ استبدال "/v1/prompts/{id}/completions" بـ "/v1/chat/completions"
- ✅ البرومبت محفوظ في الكود مباشرة كـ system message
- ✅ استخدام منطق استبدال المتغيرات {{variable}}
- ✅ طريقة أكثر موثوقية واستقراراً
*/

// نص البرومبت المحفوظ من Dashboard
const SAVED_PROMPT_TEMPLATE = `هذا هو انت خبير كتابة المحتوى التسويقي للمتاجر الالكترونية اكتب محتوى تسويقي للمنتجات بما يتلائم مع نية بحث المستخدم .
🔹 بيانات المنتج:
- اسم المنتج: {{product_name}}
- الكلمة المفتاحية: {{keyword}}
- الجمهور المستهدف: {{audience}}
- نبرة الكتابة: {{tone}}
🔹 التعليمات:
1. إذا لم تحصل على كلمة مفتاحية محددة، اختر الكلمة المفتاحية الأنسب للمنتج والجمهور المستهدف.
2. اكتب وصف HTML يتضمن:
   - فقرة افتتاحية تبدأ بالكلمة المفتاحية.
   - فقرة تشرح فائدة المنتج بإيجاز.
   - إذا كان المنتج عطرًا، اذكر النوتات العطرية بالتفصيل هكذا:
     <ul>
       <li><strong>مقدمة العطر:</strong> (وصف المقدمة)</li>
       <li><strong>قلب العطر:</strong> (وصف القلب)</li>
       <li><strong>قاعدة العطر:</strong> (وصف النهاية)</li>
     </ul>
   - قائمة مميزات عامة <ul><li>.
   - فقرة عن طريقة الاستخدام إن أمكن.
   - دعوة واضحة للشراء.
   - رابط داخلي في النهاية <a href="/products">تصفح منتجاتنا الأخرى</a>
3. اكتب Page Title واضح وجذاب (53-60 حرف بالضبط).
4. اكتب Meta Description تسويقي (130-150 حرف بالضبط).
5. اكتب URL path قصير بالإنجليزية.
6. اكتب ALT نص بديل يحتوي على الكلمة المفتاحية.
🔹 قواعد عامة:
- لا تستخدم لهجة عامية.
- حافظ على لغة محترفة.
- استخدم أسلوب تسويقي ابداعي يتناسب مع نوع المنتج.
- إذا لم تتوفر معلومات الاستخدام، تجاهلها.
- لا تضف أي معلومات غير مؤكدة.
- لا تكتب أي مقدمة خارج JSON.
🔹 الناتج:
أعد JSON فقط:
{
  "keyword": "الكلمة المفتاحية المثلى",
  "description": "الوصف HTML",
  "meta_title": "عنوان الصفحة",
  "meta_description": "وصف الميتا",
  "url_path": "short-url-path",
  "imageAlt": "النص البديل للصورة"
}`;

// Constants
const FIELD_LIMITS = {
  meta_title: { min: 53, max: 60 }, // تحديث: إضافة حد أدنى وأقصى
  meta_description: { min: 130, max: 150 }, // تحديث: إضافة حد أدنى وأقصى  
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

// دالة التوليد باستخدام البرومبت المحفوظ - الطريقة الصحيحة
const generateWithCustomPrompt = async (variables) => {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("OpenAI API Key غير موجود في متغيرات البيئة");
  }

  try {
    // استبدال المتغيرات في البرومبت المحفوظ
    let processedPrompt = SAVED_PROMPT_TEMPLATE
      .replace(/{{product_name}}/g, variables.product_name || '')
      .replace(/{{keyword}}/g, variables.keyword || '')
      .replace(/{{audience}}/g, variables.audience || 'العملاء العرب')
      .replace(/{{tone}}/g, variables.tone || 'احترافية');

    // استخدام Chat Completions API الصحيح
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4", // يمكنك تغيير الموديل حسب الحاجة
        messages: [
          {
            role: "system",
            content: processedPrompt // البرومبت المحفوظ مع المتغيرات المستبدلة
          },
          {
            role: "user", 
            content: `المنتج: ${variables.product_name}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error("OpenAI API Key غير صحيح أو منتهي الصلاحية");
      } else if (response.status === 429) {
        throw new Error("تم تجاوز حد الاستخدام. يرجى المحاولة لاحقاً");
      } else {
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'خطأ غير معروف'}`);
      }
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error calling OpenAI Chat Completions:', error);
    throw error;
  }
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
  const [editorKey, setEditorKey] = useState(Date.now()); // ← جديد: لإجبار تحديث المحرر

  // User subscription info and trial tracking
  const [userPlan, setUserPlan] = useState("free");
  const [canUseAI, setCanUseAI] = useState(false);
  const [trialUsage, setTrialUsage] = useState({ used: 0, limit: 3, resetDate: null });
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Smart Generation Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateOptions, setGenerateOptions] = useState(() => {
    // تحميل الخيارات المحفوظة من localStorage
    const saved = localStorage.getItem("seo_generate_options");
    return saved ? JSON.parse(saved) : {
      productNameAction: "keep",
      keywordAction: "generate", 
      customKeyword: ""
    };
  });

  // Load user plan and trial usage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    const plan = subscription.plan || user.plan || "free";
    
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    setUserPlan(isOwner ? "owner" : plan);
    setCanUseAI(true);
    setIsTrialExpired(false);

    if (!isOwner && plan === "free") {
      loadTrialUsage();
    }

    // تنظيف الخيارات القديمة وإبقاء الأساسيات فقط
    const saved = localStorage.getItem("seo_generate_options");
    if (saved) {
      try {
        const options = JSON.parse(saved);
        const simplifiedOptions = {
          productNameAction: options.productNameAction || "keep",
          keywordAction: options.keywordAction || "generate",
          customKeyword: options.customKeyword || ""
        };
        localStorage.setItem("seo_generate_options", JSON.stringify(simplifiedOptions));
      } catch (error) {
        // في حالة الخطأ، احذف الخيارات القديمة
        localStorage.removeItem("seo_generate_options");
      }
    }
  }, []);

  const loadTrialUsage = () => {
    const usage = JSON.parse(localStorage.getItem("seo_trial_usage") || "{}");
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
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
    if (userPlan === "owner") return true;
    if (userPlan !== "free") return true;
    return trialUsage.used < trialUsage.limit;
  };

  const showUpgradePrompt = () => {
    setShowUpgradeModal(true);
  };

  const updateGenerateOptions = (newOptions) => {
    const updatedOptions = { ...generateOptions, ...newOptions };
    setGenerateOptions(updatedOptions);
    // حفظ الخيارات في localStorage
    localStorage.setItem("seo_generate_options", JSON.stringify(updatedOptions));
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
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await fetch(`${API_BASE_URL}/product/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.ok) {
              productData = await response.json();
            }
          } catch (apiError) {
            console.log("API not available, loading from localStorage");
          }
        }

        if (!productData) {
          const saved = JSON.parse(localStorage.getItem("saved_products") || "[]");
          productData = saved.find(p => p.id == id);
        }
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
    if (userPlan === "owner") {
      setProduct(prev => ({
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString()
      }));
      
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
      return;
    }

    setProduct(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString()
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [userPlan]);

  const validateProduct = useCallback(() => {
    const newErrors = {};
    
    if (!product.name?.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    } else if (product.name.length > FIELD_LIMITS.name_limit) {
      newErrors.name = `اسم المنتج يجب ألا يتجاوز ${FIELD_LIMITS.name_limit} حرف`;
    }

    // التحقق من Page Title مع الحدود الجديدة
    if (product.meta_title) {
      const titleLength = product.meta_title.length;
      if (titleLength > FIELD_LIMITS.meta_title.max) {
        newErrors.meta_title = `Page Title يجب ألا يتجاوز ${FIELD_LIMITS.meta_title.max} حرف (حالياً ${titleLength})`;
      } else if (titleLength < FIELD_LIMITS.meta_title.min) {
        newErrors.meta_title = `Page Title يجب ألا يقل عن ${FIELD_LIMITS.meta_title.min} حرف (حالياً ${titleLength})`;
      }
    }

    // التحقق من Meta Description مع الحدود الجديدة
    if (product.meta_description) {
      const descLength = product.meta_description.length;
      if (descLength > FIELD_LIMITS.meta_description.max) {
        newErrors.meta_description = `Page Description يجب ألا يتجاوز ${FIELD_LIMITS.meta_description.max} حرف (حالياً ${descLength})`;
      } else if (descLength < FIELD_LIMITS.meta_description.min) {
        newErrors.meta_description = `Page Description يجب ألا يقل عن ${FIELD_LIMITS.meta_description.min} حرف (حالياً ${descLength})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [product.name, product.meta_title, product.meta_description]);

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
        keyword: product.keyword || "",
        imageAlt: product.imageAlt || "",
        lastUpdated: new Date().toISOString()
      };

      const token = localStorage.getItem("token");
      if (token && product.id) {
        try {
          const response = await fetch(`${API_BASE_URL}/product/${product.id}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const result = await response.json();
            console.log("✅ API save successful:", result);
          }
        } catch (apiError) {
          console.log("API not available, saving locally only");
        }
      }

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
  }, [validateProduct, product]);

  // التوليد الذكي الشامل - مع نافذة التحكم
  const handleGenerateAll = useCallback(async () => {
    if (userPlan === "free" && !checkTrialAccess()) {
      showUpgradePrompt();
      return;
    }

    if (!product.name?.trim()) {
      setErrors(prev => ({ ...prev, generate: "اسم المنتج مطلوب للتوليد الذكي" }));
      toast.error("⚠️ أدخل اسم المنتج أولاً");
      return;
    }

    // إظهار نافذة التحكم بدلاً من التوليد المباشر
    setShowGenerateModal(true);
  }, [userPlan, trialUsage.used, trialUsage.limit, product.name, checkTrialAccess]);

  // تنفيذ التوليد الذكي مع الخيارات المحددة - باستخدام البرومبت المحفوظ فقط
  const executeSmartGeneration = useCallback(async () => {
    setGenerating(true);
    setShowGenerateModal(false);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      toast.loading("🧠 جاري التوليد الذكي باستخدام البرومبت المحفوظ...", { id: 'generating' });

      if (userPlan === "free") {
        incrementTrialUsage();
      }

      // تحديد الكلمة المفتاحية حسب اختيار المستخدم
      let finalKeyword = "";
      if (generateOptions.keywordAction === "use_existing") {
        finalKeyword = generateOptions.customKeyword.trim();
      } else {
        // سيتم توليدها بواسطة البرومبت الرئيسي
        finalKeyword = ""; // فارغة عشان البرومبت يولدها
      }

      // تحديد اسم المنتج حسب اختيار المستخدم
      let finalProductName = product.name;
      if (generateOptions.productNameAction === "add_keyword" && finalKeyword) {
        finalProductName = `${product.name} ${finalKeyword}`;
      } else if (generateOptions.productNameAction === "regenerate") {
        // استخدام البرومبت المحفوظ لتوليد اسم محسن
        const nameVariables = {
          task: "optimize_product_name",
          original_name: product.name,
          keyword: finalKeyword,
          audience: generateOptions.audience,
          tone: generateOptions.tone
        };

        try {
          const nameResponse = await generateWithCustomPrompt(nameVariables);
          finalProductName = nameResponse.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
        } catch (error) {
          console.error("Product name generation failed:", error);
          finalProductName = product.name; // fallback
        }
      }

      // استخدام البرومبت المحفوظ لتوليد جميع المحتويات
      const variables = {
        product_name: finalProductName,
        keyword: finalKeyword || "توليد تلقائي", // إشارة للبرومبت لتوليد كلمة مفتاحية
        audience: "العملاء العرب", // قيمة افتراضية ثابتة
        tone: "احترافية", // قيمة افتراضية ثابتة
        existing_description: product.description || ""
      };

      const generated = await generateWithCustomPrompt(variables);
      
      // تنظيف النص المُولد قبل تحليل JSON
      let cleanedGenerated = generated
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // إزالة أحرف التحكم
        .replace(/\n/g, '\\n') // تحويل أسطر جديدة لصيغة JSON صالحة
        .replace(/\r/g, '\\r') // تحويل carriage returns
        .replace(/\t/g, '\\t') // تحويل tabs
        .trim();
      
      const jsonMatch = cleanedGenerated.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("فشل في توليد المحتوى - لم يتم العثور على JSON صالح");
      }

      let fields;
      try {
        fields = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Generated content:", generated);
        console.error("Cleaned content:", cleanedGenerated);
        throw new Error("فشل في تحليل المحتوى المُولد - يرجى المحاولة مرة أخرى");
      }

      const processedFields = {
        keyword: fields.keyword || finalKeyword || "يحتاج كلمة مفتاحية", // إعطاء أولوية لما يولده البرومبت
        name: finalProductName,
        description: fields.description || "",
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title.max),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description.max),
        url_path: fields.url_path?.trim() || "",
        imageAlt: fields.imageAlt?.trim() || ""
      };

      // إذا كان اسم المنتج يحتاج تحديث بناء على الكلمة المفتاحية المولدة
      if (generateOptions.productNameAction === "add_keyword" && fields.keyword && !finalKeyword) {
        processedFields.name = `${product.name} ${fields.keyword}`;
      }

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      toast.success("🎉 تم إنشاء محتوى احترافي باستخدام البرومبت المحفوظ!", { id: 'generating' });
      
      // تحذير إذا لم يتم توليد كلمة مفتاحية
      if (!processedFields.keyword && generateOptions.keywordAction === "generate") {
        toast.warning("⚠️ لم يتم توليد كلمة مفتاحية. يمكنك إضافتها يدوياً.", { duration: 4000 });
      }
      
      if (userPlan === "free") {
        const remaining = trialUsage.limit - trialUsage.used - 1;
        toast.success(`✨ ${remaining} توليدة مجانية متبقية هذا الشهر`, { duration: 4000 });
      }

    } catch (error) {
      console.error("Error generating fields:", error);
      
      // رسائل خطأ محددة حسب نوع المشكلة
      let errorMessage = "فشل في التوليد الذكي. حاول مرة أخرى.";
      
      if (error.message.includes("JSON")) {
        errorMessage = "خطأ في تحليل المحتوى المُولد. يرجى المحاولة مرة أخرى.";
      } else if (error.message.includes("فشل في توليد المحتوى")) {
        errorMessage = "لم يتم توليد محتوى صالح. تأكد من صحة اسم المنتج والمحاولة مرة أخرى.";
      } else if (error.name === "TypeError" || error.message.includes("fetch")) {
        errorMessage = "مشكلة في الاتصال. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.";
      }
      
      toast.error("❌ " + errorMessage, { id: 'generating' });
      setErrors(prev => ({ ...prev, generate: errorMessage }));
    } finally {
      setGenerating(false);
    }
  }, [userPlan, trialUsage.used, trialUsage.limit, product.name, generateOptions, checkTrialAccess]);

  // التوليد لحقل واحد - باستخدام البرومبت المحفوظ فقط
  const handleGenerateField = useCallback(async (fieldType) => {
    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      // استخدام البرومبت المحفوظ لتوليد حقل واحد
      const variables = {
        product_name: product.name,
        keyword: fieldType === "keyword" ? "توليد تلقائي" : (product.keyword || "توليد تلقائي"),
        audience: "العملاء العرب", // قيمة افتراضية ثابتة
        tone: "احترافية", // قيمة افتراضية ثابتة
        existing_description: product.description || ""
      };

      const response = await generateWithCustomPrompt(variables);
      
      // إذا كان التوليد للكلمة المفتاحية، نحتاج استخراجها من JSON
      let value = response.trim();
      
      if (fieldType === "keyword") {
        // محاولة استخراج الكلمة المفتاحية من JSON
        const jsonMatch = response.match(/{[\s\S]*}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            value = parsed.keyword || value;
          } catch (error) {
            // إذا فشل، استخدم النص كما هو
            console.log("فشل في تحليل JSON للكلمة المفتاحية، استخدام النص المباشر");
          }
        }
      }

      value = value.replace(/^["']|["']$/g, '');
      value = value.replace(/^`+|`+$/g, '');

      if (fieldType === "meta_title") {
        value = truncateText(value, FIELD_LIMITS.meta_title.max);
      } else if (fieldType === "meta_description") {
        value = truncateText(value, FIELD_LIMITS.meta_description.max);
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

      toast.success(`تم التوليد الذكي لـ${fieldLabels[fieldType]} بنجاح! 🎯`);

    } catch (error) {
      console.error(`Error generating ${fieldType}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `فشل في التوليد الذكي لـ${fieldType}`;
      setErrors(prev => ({ ...prev, [fieldType]: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setFieldLoading("");
    }
  }, [product.name, product.keyword, product.description]);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label} للحافظة! 📋`);
    } catch (error) {
      toast.error("فشل في النسخ");
    }
  };

  const renderPageHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link 
          to="/products" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للمنتجات
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-2xl font-bold text-gray-900">
          تحسين السيو الذكي
        </h1>
        {generating && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
            جاري التوليد...
          </span>
        )}
        {hasUnsavedChanges && !generating && (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
            • تغييرات غير محفوظة
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {userPlan === "owner" && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            👑 مالك الموقع
          </div>
        )}
        {userPlan === "free" && userPlan !== "owner" && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            💎 تجربة مجانية: {trialUsage.used}/{trialUsage.limit}
          </div>
        )}
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            showPreview 
              ? "bg-green-100 text-green-700 hover:bg-green-200" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Eye className="w-4 h-4" />
          {showPreview ? '✅ معاينة Google' : '👁️ معاينة Google'}
        </button>
      </div>
    </div>
  );

  const renderMotivationalBanner = () => {
    let progress = 0;
    if (Object.keys(product).length > 0) {
      const analysisResult = analyzeSEO(product);
      progress = analysisResult.coreScore || 0;
    }

    if (!product.name) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">ابدأ رحلة تحسين السيو!</h3>
              <p className="text-blue-700">أدخل اسم منتجك وسنقوم بتوليد محتوى احترافي باستخدام البرومبت المحفوظ</p>
            </div>
          </div>
        </div>
      );
    }

    if (progress < 50) {
      return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-100">
          <div className="flex items-center gap-4">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="font-bold text-amber-900 text-lg">استخدم التوليد الذكي!</h3>
              <p className="text-amber-700">اضغط "التوليد الذكي" للحصول على محتوى احترافي </p>
            </div>
          </div>
        </div>
      );
    }

    if (progress >= 85) {
      return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="font-bold text-green-900 text-lg">ممتاز! منتجك محسن بالكامل</h3>
              <p className="text-green-700">لا تنس حفظ التغييرات قبل المغادرة</p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderInputField = (label, key, multiline = false, placeholder = "", icon = null) => {
    const hasError = errors[key];
    const isLoading = fieldLoading === key;
    const fieldValue = product[key] || "";
    const isLocked = userPlan === "free" && isTrialExpired;
    
    const showCharCount = ['meta_title', 'meta_description', 'name'].includes(key);
    const charLimit = FIELD_LIMITS[key + '_limit'] || (FIELD_LIMITS[key]?.max || FIELD_LIMITS[key]);
    const charMin = FIELD_LIMITS[key]?.min;
    const charCount = fieldValue.length;
    const isOverLimit = charLimit && charCount > charLimit;
    const isUnderLimit = charMin && charCount < charMin && charCount > 0;

    if (key === "description") {
      return (
        <div className={`relative bg-white p-6 rounded-2xl shadow-sm border transition-colors ${
          isLocked ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {icon}
              {label}
              {!isLocked && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Rich Text Editor</span>}
              {isLocked && <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">🔒 مؤمن</span>}
            </label>
            <div className="flex items-center gap-2">
              {(userPlan !== "free" || checkTrialAccess()) && !isLocked && (
                <button
                  onClick={() => handleGenerateField(key)}
                  className={`p-2 rounded-lg transition-all ${
                    isLoading 
                      ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105"
                  }`}
                  disabled={isLoading}
                  title="التوليد الذكي بالبرومبت المحفوظ"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                </button>
              )}
              {fieldValue && !isLocked && (
                <button
                  onClick={() => copyToClipboard(fieldValue, label)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="نسخ"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {isLocked ? (
            <div className="w-full p-3 border border-red-300 rounded-lg bg-red-50 text-red-700 text-center">
              🔒 انتهت التجربة المجانية. ترقية مطلوبة للمتابعة
              <div className="mt-2">
                <button
                  onClick={showUpgradePrompt}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  ترقية الآن
                </button>
              </div>
            </div>
          ) : (
            <TiptapEditor
              value={fieldValue}
              onChange={(val) => handleProductChange(key, val)}
              placeholder={placeholder}
            />
          )}
          
          {hasError && (
            <div className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {hasError}
            </div>
          )}
          
          {!isLocked && (
            <div className="text-xs text-gray-500 mt-2">
              💡 استخدم المحرر لإضافة <strong>التنسيق</strong>، <strong>الروابط الداخلية</strong>، والقوائم المنظمة | أو جرب التوليد الذكي بالبرومبت المحفوظ 🧠
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`relative bg-white p-6 rounded-2xl shadow-sm border transition-colors ${
        isLocked ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            {icon}
            {label}
            {isLocked && <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">🔒 مؤمن</span>}
          </label>
          <div className="flex items-center gap-2">
            {showCharCount && (
              <span className={`text-xs ${
                isOverLimit ? 'text-red-500' : 
                isUnderLimit ? 'text-orange-500' : 
                'text-gray-500'
              }`}>
                {charCount}
                {charMin && charLimit ? `/${charMin}-${charLimit}` : 
                 charLimit ? `/${charLimit}` : ''}
                {isUnderLimit && ` (قليل)`}
                {isOverLimit && ` (كثير)`}
              </span>
            )}
            {(userPlan !== "free" || checkTrialAccess()) && !isLocked && (
              <button
                onClick={() => handleGenerateField(key)}
                className={`p-2 rounded-lg transition-all ${
                  isLoading 
                    ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105"
                }`}
                disabled={isLoading}
                title="التوليد الذكي بالبرومبت المحفوظ"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                ) : (
                  <Brain className="w-4 h-4" />
                )}
              </button>
            )}
            {fieldValue && !isLocked && (
              <button
                onClick={() => copyToClipboard(fieldValue, label)}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="نسخ"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {isLocked ? (
          <div className="w-full p-3 border border-red-300 rounded-lg bg-red-50 text-red-700 text-center">
            🔒 انتهت التجربة المجانية. ترقية مطلوبة للمتابعة
            <div className="mt-2">
              <button
                onClick={showUpgradePrompt}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                ترقية الآن
              </button>
            </div>
          </div>
        ) : multiline ? (
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

        {key === 'meta_title' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Title المثالي: 53-60 حرف بالضبط، يحتوي الكلمة المفتاحية، جذاب للنقر
          </div>
        )}
        {key === 'meta_description' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Description المثالي: 130-150 حرف بالضبط، يحتوي الكلمة المفتاحية، يحفز على الزيارة
          </div>
        )}
        {key === 'keyword' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 اختر كلمة مفتاحية بحجم بحث عالي ومنافسة معقولة - أو جرب التوليد الذكي بالبرومبت المحفوظ 🧠
          </div>
        )}
        {key === 'url_path' && !isLocked && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
            ⚠️ إذا كان الموقع مفهرس مسبقاً، لا تعدل هذا الحقل حيث قد يؤثر على الفهرسة
          </div>
        )}
      </div>
    );
  };

  const progress = useMemo(() => {
    if (Object.keys(product).length === 0) return 0;
    const analysisResult = analyzeSEO(product);
    return analysisResult.coreScore || 0;
  }, [
    product.name, 
    product.keyword, 
    product.description, 
    product.meta_title, 
    product.meta_description, 
    product.imageAlt
  ]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المنتج...</p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          
          {renderPageHeader()}

          {(errors.save || errors.generate || errors.analyze) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">خطأ:</span>
                <span>{errors.save || errors.generate || errors.analyze}</span>
              </div>
            </div>
          )}

          {renderMotivationalBanner()}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            <div className="xl:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    معلومات المنتج
                  </h2>
                  <div className="flex gap-3">
                    {(userPlan !== "free" || checkTrialAccess()) && (
                      <button
                        onClick={handleGenerateAll}
                        disabled={generating || !product.name?.trim()}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm ${
                          generating 
                            ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                            : !product.name?.trim()
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : userPlan === "free"
                                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:shadow-md"
                                : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:shadow-md"
                        }`}
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-600 border-t-transparent"></div>
                            جاري التوليد الذكي...
                          </>
                        ) : !product.name?.trim() ? (
                          <>
                            <Sparkles className="w-5 h-5" />
                            أدخل اسم المنتج أولاً
                          </>
                        ) : userPlan === "free" ? (
                          <>
                            <Sparkles className="w-5 h-5" />
                             التوليد الذكي ({trialUsage.limit - trialUsage.used} متبقي)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                             التوليد الذكي
                          </>
                        )}
                      </button>
                    )}

                    {userPlan === "free" && !checkTrialAccess() && (
                      <button
                        onClick={showUpgradePrompt}
                        className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Crown className="w-5 h-5" />
                        🔓 ترقية للاستمرار
                      </button>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={saving || !hasUnsavedChanges || (userPlan === "free" && isTrialExpired)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm ${
                        saving 
                          ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                          : hasUnsavedChanges && !(userPlan === "free" && isTrialExpired)
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {userPlan === "free" && isTrialExpired ? "🔒 حفظ مؤمن" : hasUnsavedChanges ? "حفظ" : "✅ محفوظ"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {product.lastUpdated && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    آخر تحديث: {formatDate(product.lastUpdated)}
                  </div>
                )}

                {userPlan === "free" && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎁</div>
                      <div>
                        <div className="font-semibold text-blue-800">البرومبت المحفوظ - التجربة المجانية</div>
                        <div className="text-sm text-blue-600">
                          استخدمت {trialUsage.used} من {trialUsage.limit} توليدات ذكية هذا الشهر
                        </div>
                      </div>
                      {!checkTrialAccess() && (
                        <button
                          onClick={showUpgradePrompt}
                          className="mr-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          ترقية الآن
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {showPreview && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    معاينة نتائج Google
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {product.meta_title || product.name || "عنوان المنتج"}
                    </div>
                    <div className="text-green-600 text-sm mt-1">
                      https://example.com/{product.url_path || "product"}
                    </div>
                    <div className="text-gray-600 text-sm mt-2 leading-relaxed">
                      {product.meta_description || "وصف المنتج سيظهر هنا..."}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Type className="w-5 h-5 text-blue-500" />
                    المعلومات الأساسية
                  </h3>
                  
                  {renderInputField(
                    "اسم المنتج", 
                    "name", 
                    false, 
                    "أدخل اسم المنتج الجذاب والواضح...", 
                    <Package className="w-4 h-4 text-blue-500" />
                  )}
                  
                  {renderInputField(
                    "الكلمة المفتاحية الرئيسية", 
                    "keyword", 
                    false, 
                    "الكلمة المفتاحية التي تريد الظهور بها في نتائج البحث...", 
                    <Search className="w-4 h-4 text-green-500" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-green-500" />
                    وصف المنتج
                  </h3>
                  
                  {renderInputField(
                    "وصف المنتج التفصيلي", 
                    "description", 
                    true, 
                    "اكتب وصفاً شاملاً ومقنعاً للمنتج يجذب العملاء ويحسن السيو...", 
                    <FileText className="w-4 h-4 text-green-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-purple-500" />
                    Page Title & Description
                  </h3>
                  
                  {renderInputField(
                    "Page Title عنوان السيو", 
                    "meta_title", 
                    false, 
                    "عنوان قصير وجذاب يظهر في نتائج البحث...", 
                    <Type className="w-4 h-4 text-purple-500" />
                  )}
                  
                  {renderInputField(
                    "Page Description وصف الميتا", 
                    "meta_description", 
                    true, 
                    "وصف موجز ومقنع يظهر أسفل العنوان في نتائج البحث...", 
                    <FileText className="w-4 h-4 text-purple-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    السيو التقني
                  </h3>
                  
                  {renderInputField(
                    "مسار الرابط (URL Slug)", 
                    "url_path", 
                    false, 
                    "product-name-seo-friendly", 
                    <Globe className="w-4 h-4 text-orange-500" />
                  )}
                  
                  {renderInputField(
                    "النص البديل للصورة (Image Alt)", 
                    "imageAlt", 
                    false, 
                    "وصف الصورة للمكفوفين ومحركات البحث...", 
                    <Image className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              
              <EnhancedSEODisplay analysis={score} product={product} />

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  البرومبت المحفوظ
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-500 mt-0.5">🎯</div>
                    <div>
                      <strong>نظام محدث:</strong> يتم توليد جميع المحتويات باستخدام البرومبت المحفوظ في الكود مباشرة - طريقة أكثر موثوقية!
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-500 mt-0.5">🔧</div>
                    <div>
                      <strong>تحكم كامل:</strong> البرومبت محفوظ في الكود مما يضمن الاستقرار والجودة العالية
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-500 mt-0.5">⚡</div>
                    <div>
                      <strong>سرعة وموثوقية:</strong> استجابة أسرع باستخدام Chat Completions API الرسمي
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-500 mt-0.5">🎨</div>
                    <div>
                      <strong>تحديث سهل:</strong> يمكن تعديل البرومبت مباشرة في الكود حسب الحاجة
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(product, null, 2), "بيانات المنتج")}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ البيانات كـ JSON
                  </button>
                  
                  <Link
                    to="/products"
                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 justify-center"
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

      {/* نافذة التوليد الذكي المنبثقة */}
      {showGenerateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // منع الإغلاق أثناء التوليد أو إذا تم النقر على النافذة نفسها
            if (generating || e.target !== e.currentTarget) return;
            setShowGenerateModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <h2 className="text-xl font-bold">التوليد الذكي</h2>
                  <p className="text-blue-100 text-sm mt-1">إنشاء محتوى احترافي بنقرة واحدة</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* نص توضيحي بسيط */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm leading-relaxed">
                  سيساعدك التوليد الذكي على إنشاء وتحسين كل محتوى منتجك بنقرة واحدة، سنستخدم اسم المنتج والمعلومات المتوفرة، لا تنسى مراجعة المحتوى قبل النسخ أو النشر.
                </p>
              </div>

              {/* اسم المنتج وخياراته */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  اسم المنتج: "{product.name}"
                </label>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        name="productNameAction"
                        value="keep"
                        checked={generateOptions.productNameAction === "keep"}
                        onChange={(e) => updateGenerateOptions({ productNameAction: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-medium">☐ لا تغير</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        name="productNameAction"
                        value="add_keyword"
                        checked={generateOptions.productNameAction === "add_keyword"}
                        onChange={(e) => updateGenerateOptions({ productNameAction: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-medium">☐ أضف كلمة مفتاحية</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        name="productNameAction"
                        value="regenerate"
                        checked={generateOptions.productNameAction === "regenerate"}
                        onChange={(e) => updateGenerateOptions({ productNameAction: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-medium">☐ أعد توليد</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* الكلمة المفتاحية وخياراتها */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Search className="w-4 h-4 text-green-500" />
                  الكلمة المفتاحية:
                </label>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        name="keywordAction"
                        value="generate"
                        checked={generateOptions.keywordAction === "generate"}
                        onChange={(e) => updateGenerateOptions({ keywordAction: e.target.value })}
                        className="text-green-600"
                      />
                      <span className="text-sm font-medium">☐ توليد تلقائي</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                      <input
                        type="radio"
                        name="keywordAction"
                        value="use_existing"
                        checked={generateOptions.keywordAction === "use_existing"}
                        onChange={(e) => updateGenerateOptions({ keywordAction: e.target.value })}
                        className="text-green-600"
                      />
                      <span className="text-sm font-medium">☐ لدي كلمة مفتاحية:</span>
                    </label>
                  </div>

                  {generateOptions.keywordAction === "use_existing" && (
                    <div className="space-y-2 mr-6">
                      <input
                        type="text"
                        value={generateOptions.customKeyword}
                        onChange={(e) => updateGenerateOptions({ customKeyword: e.target.value })}
                        placeholder="أدخل الكلمة المفتاحية هنا..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="bg-gray-50 p-6 rounded-b-2xl flex items-center justify-between">
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={generating}
                className={`px-6 py-3 border border-gray-300 rounded-lg transition-colors ${
                  generating 
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-600 bg-white hover:bg-gray-50"
                }`}
              >
                {generating ? "جاري التوليد..." : "إلغاء"}
              </button>
              
              <button
                onClick={executeSmartGeneration}
                disabled={generating || (generateOptions.keywordAction === "use_existing" && !generateOptions.customKeyword.trim())}
                className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  generating 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : (generateOptions.keywordAction === "use_existing" && !generateOptions.customKeyword.trim())
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg"
                }`}
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    إنشاء المحتوى
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}