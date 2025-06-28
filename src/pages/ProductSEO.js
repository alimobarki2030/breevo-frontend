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
import { generateProductSEO } from "../utils/generateProductSEO";
import analyzeSEO from "../analyzeSEO"; // الملف المحسن
import TiptapEditor from "../components/TiptapEditor";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Constants
const FIELD_LIMITS = {
  meta_title: 60,
  meta_description: 160,
  keyword_limit: 100,
  name_limit: 70
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

// Fallback content generator
const generateFallbackContent = (productName, keyword) => {
  if (!productName) return "";
  
  const keywordToUse = keyword || productName.split(' ')[0];
  
  return `
    <p><strong>${keywordToUse}</strong> ${productName} منتج عالي الجودة يوفر لك أفضل تجربة ممكنة.</p>
    
    <h3>المميزات الرئيسية:</h3>
    <ul>
      <li>جودة عالية ومضمونة</li>
      <li>سعر تنافسي ممتاز</li>
      <li>خدمة عملاء متميزة</li>
      <li>ضمان شامل على المنتج</li>
    </ul>
    
    <h3>لماذا تختار منتجنا؟</h3>
    <p>نحن نضمن لك الحصول على أفضل ${keywordToUse} بأعلى معايير الجودة.</p>
    
    <p><strong>اطلب الآن</strong> واستمتع بخدمة التوصيل السريع في جميع أنحاء المملكة. <a href="/contact">تواصل معنا</a> للمزيد من المعلومات.</p>
  `;
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

  // استخدام البيانات من analyzeSEO
  const coreResults = analysis?.coreResults || { criteria: [], score: 0, passedCount: 0, totalCount: 0 };
  const additionalCategories = analysis?.categories || {};
  
  // تحويل المعايير الإضافية لتنسيق مناسب للعرض
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

      {/* Additional Criteria */}
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
    setIsTrialExpired(false); // Never expired for owner

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
        // Try API first
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

        // Fallback to localStorage
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
    setProduct(prev => ({
      ...prev,
      [field]: value,
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
        category: product.category || "",
        target_audience: product.target_audience || "",
        tone: product.tone || "",
        best_story_arc: product.best_story_arc || "",
        imageAlt: product.imageAlt || "",
        lastUpdated: new Date().toISOString()
      };

      // Try API first
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
  }, [validateProduct, product]);

  // تحديث دالة handleGenerateAll مع إصلاح الأخطاء
  const handleGenerateAll = useCallback(async () => {
    if (userPlan === "free" && !checkTrialAccess()) {
      showUpgradePrompt();
      return;
    }

    if (!product.name?.trim()) {
      setErrors(prev => ({ ...prev, generate: "اسم المنتج مطلوب للتوليد" }));
      toast.error("⚠️ أدخل اسم المنتج أولاً");
      return;
    }

    setGenerating(true);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      toast.loading("🧠 جاري تحليل المنتج وتوليد المحتوى...", { id: 'generating' });

      // Increment trial usage for free users
      if (userPlan === "free") {
        incrementTrialUsage();
      }

      // === التحليل المحلي (بدون API) ===
      const seoAnalysis = analyzeSEO(product);
      
      // 1. تصنيف المنتج محلياً
      const category = seoAnalysis.categorizeProduct();
      
      // 2. تحليل الجمهور المستهدف محلياً
      const targetAudience = seoAnalysis.analyzeTargetAudience(product, category);
      
      // 3. اختيار النغمة والحبكة تلقائياً
      const tone = seoAnalysis.selectTone(category, targetAudience);
      const bestStoryArc = seoAnalysis.selectStoryArc(category);

      // === توليد الكلمة المفتاحية أولاً ===
      let keyword;
      try {
        keyword = (await generateProductSEO(`استخرج أفضل كلمة مفتاحية لهذا المنتج للسوق السعودي: "${product.name}". أعد الكلمة فقط بدون شرح.`)).trim();
        keyword = keyword.replace(/['"]/g, ''); // إزالة علامات التنصيص
      } catch (error) {
        console.warn("فشل في توليد الكلمة المفتاحية، استخدام fallback");
        keyword = product.name.split(' ')[0]; // استخدام أول كلمة
      }

      // === توليد المحتوى الأساسي ===
      const prompt = `أنت مساعد تسويق محترف متخصص في SEO للسوق السعودي.

المنتج: "${product.name}"
الكلمة المفتاحية: "${keyword}"
الفئة: "${category}"
الجمهور: "${targetAudience}"
النغمة: "${tone}"

مهمتك: توليد محتوى متكامل لصفحة هذا المنتج يحقق أفضل نتائج SEO.

معايير SEO الإلزامية:
✅ الوصف يبدأ بالكلمة المفتاحية في أول 25 كلمة
✅ طول الوصف 100+ كلمة
✅ استخدام HTML منظم مع روابط داخلية
✅ دعوة واضحة لاتخاذ إجراء

أعد JSON فقط:
{
  "name": "عنوان محسن يحتوي الكلمة المفتاحية (أقل من 70 حرف)",
  "description": "وصف HTML منسق حسب المعايير أعلاه",
  "keyword": "${keyword}",
  "meta_title": "Page Title جذاب (50-60 حرف)",
  "meta_description": "Page Description مقنع (140-150 حرف)",
  "url_path": "مسار-url-صديق-لمحركات-البحث",
  "imageAlt": "وصف بديل للصورة يحتوي الكلمة المفتاحية"
}`;

      let processedFields;
      
      try {
        const generated = await generateProductSEO(prompt);
        const jsonMatch = generated.match(/{[\s\S]*}/);
        
        if (!jsonMatch) {
          throw new Error("لم يتم العثور على JSON في الاستجابة");
        }

        const fields = JSON.parse(jsonMatch[0]);

        // Apply field limits and validation
        processedFields = {
          ...fields,
          name: truncateText(fields.name, FIELD_LIMITS.name_limit),
          meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
          meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
          keyword: keyword,
          // حفظ بيانات التحليل في الخلفية
          category,
          target_audience: targetAudience,
          tone,
          best_story_arc: bestStoryArc
        };

      } catch (error) {
        console.warn("فشل في توليد المحتوى عبر API، استخدام محتوى احتياطي");
        
        // Fallback content generation
        processedFields = {
          name: product.name,
          description: generateFallbackContent(product.name, keyword),
          keyword: keyword,
          meta_title: `${product.name} - ${keyword}`,
          meta_description: `اكتشف ${product.name} عالي الجودة. ${keyword} مميز بأفضل الأسعار والخدمة الممتازة.`,
          url_path: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
          imageAlt: `صورة ${product.name} - ${keyword}`,
          category,
          target_audience: targetAudience,
          tone,
          best_story_arc: bestStoryArc
        };
      }

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      // رسالة نجاح محسنة
      toast.success("🎉 تم توليد المحتوى بنجاح!", { id: 'generating' });
      
      if (userPlan === "free") {
        const remaining = trialUsage.limit - trialUsage.used - 1;
        if (remaining > 0) {
          toast.success(`✨ ${remaining} توليدة مجانية متبقية هذا الشهر`, { duration: 4000 });
        }
      }

    } catch (error) {
      console.error("Error generating fields:", error);
      
      // رسائل خطأ مخصصة
      let errorMessage = "فشل في توليد المحتوى";
      
      if (error.message?.includes("تسجيل الدخول")) {
        errorMessage = "انتهت جلسة العمل، يرجى تسجيل الدخول مرة أخرى";
        toast.error("🔐 " + errorMessage, { id: 'generating' });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error.message?.includes("اتصال")) {
        errorMessage = "مشكلة في الاتصال، تحقق من الإنترنت وأعد المحاولة";
        toast.error("🌐 " + errorMessage, { id: 'generating' });
      } else {
        toast.error("❌ " + errorMessage, { id: 'generating' });
      }
      
      setErrors(prev => ({ ...prev, generate: errorMessage }));
    } finally {
      setGenerating(false);
    }
  }, [userPlan, trialUsage, product.name, checkTrialAccess, navigate]);

  const handleGenerateField = useCallback(async (fieldType) => {
    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      const prompts = {
        keyword: `استخرج أفضل كلمة مفتاحية لهذا المنتج للسوق السعودي: "${product.name}". أعد الكلمة فقط.`,
        
        description: `اكتب وصفاً HTML منسقاً لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

متطلبات:
- 100+ كلمة
- يبدأ بالكلمة المفتاحية
- HTML منسق
- رابط داخلي واحد
- دعوة لاتخاذ إجراء

أعد الوصف HTML فقط:`,
        
        meta_title: `أنشئ Page Title مثالي لهذا المنتج:
المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}
المعايير: 50-60 حرف، يحتوي الكلمة المفتاحية
أعطني العنوان فقط:`,
        
        meta_description: `اكتب Page Description مثالي:
المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}
المعايير: 140-150 حرف، يحفز على النقر
أعطني الوصف فقط:`,
        
        url_path: `أنشئ مسار URL محسن:
المنتج: ${product.name}
معايير: باللغة الإنجليزية، شرطات بدلاً من المسافات
أعطني المسار فقط:`,
        
        imageAlt: `أنشئ نص ALT للصورة:
المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}
معايير: 10-15 كلمة، وصف دقيق
أعطني النص فقط:`
      };

      const prompt = prompts[fieldType];
      if (!prompt) {
        throw new Error(`لا يوجد برومبت للحقل: ${fieldType}`);
      }

      const response = await generateProductSEO(prompt);
      let value = response.trim();

      // Clean up response
      value = value.replace(/^["']|["']$/g, ''); // Remove quotes
      value = value.replace(/^`+|`+$/g, ''); // Remove backticks

      // Apply field-specific processing
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
        meta_title: 'Page Title عنوان السيو',
        meta_description: 'Page Description وصف الميتا',
        url_path: 'مسار الرابط',
        imageAlt: 'النص البديل للصورة'
      };

      toast.success(`تم توليد ${fieldLabels[fieldType]} بنجاح! 🎯`);

    } catch (error) {
      console.error(`Error generating ${fieldType}:`, error);
      const errorMessage = error?.response?.data?.message || error?.message || `فشل في توليد ${fieldType}`;
      setErrors(prev => ({ ...prev, [fieldType]: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setFieldLoading("");
    }
  }, [product.name, product.keyword]);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label} للحافظة! 📋`);
    } catch (error) {
      toast.error("فشل في النسخ");
    }
  };

  // دالة العنوان الرئيسي المحسن
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
        {/* شارات الخطة */}
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
        
        {/* زر المعاينة محسن */}
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

  // دالة رسائل التحفيز
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
              <p className="text-blue-700">أدخل اسم منتجك وسنقوم بتوليد محتوى محسن تلقائياً</p>
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
              <p className="text-amber-700">ابدأ الآن رحلة التحسين</p>
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

  // دالة الحقول المبسطة
  const renderInputField = (label, key, multiline = false, placeholder = "", icon = null) => {
    const hasError = errors[key];
    const isLoading = fieldLoading === key;
    const fieldValue = product[key] || "";
    const isLocked = userPlan === "free" && isTrialExpired;
    
    // Character count for limited fields
    const showCharCount = ['meta_title', 'meta_description', 'name'].includes(key);
    const charLimit = FIELD_LIMITS[key + '_limit'] || FIELD_LIMITS[key];
    const charCount = fieldValue.length;
    const isOverLimit = charLimit && charCount > charLimit;

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
                  title="توليد ذكي"
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
              🔒 انتهت التجربة المجانية. قم بالترقية لتواصل ابداعك
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
              💡 استخدم المحرر لإضافة <strong>التنسيق</strong>، <strong>الروابط الداخلية</strong>، والقوائم المنظمة
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
              <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}{charLimit && `/${charLimit}`}
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
                title="توليد ذكي"
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
            🔒 انتهت التجربة المجانية. قم بالترقية لتواصل ابداعك
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

        {/* Field-specific hints */}
        {key === 'meta_title' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Title المثالي: 50-60 حرف، يحتوي الكلمة المفتاحية، جذاب للنقر
          </div>
        )}
        {key === 'meta_description' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Description المثالي: 140-150 حرف، يحتوي الكلمة المفتاحية، يحفز على الزيارة
          </div>
        )}
        {key === 'keyword' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 اختر كلمة مفتاحية بحجم بحث عالي ومنافسة معقولة
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

  // Progress calculation using core criteria
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
          
          {/* Header المحسن */}
          {renderPageHeader()}

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

          {/* Motivational Banner */}
          {renderMotivationalBanner()}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Product Header المبسط */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    معلومات المنتج
                  </h2>
                  <div className="flex gap-3">
                    {/* زر التوليد الشامل */}
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
                            🎯 توليد ذكي مجاني ({trialUsage.limit - trialUsage.used} متبقي)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            التوليد الذكي
                          </>
                        )}
                      </button>
                    )}

                    {/* زر الترقية للمستخدمين المنتهية تجربتهم */}
                    {userPlan === "free" && !checkTrialAccess() && (
                      <button
                        onClick={showUpgradePrompt}
                        className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Crown className="w-5 h-5" />
                        🔓 ترقية للاستمرار
                      </button>
                    )}

                    {/* زر الحفظ */}
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
                          {userPlan === "free" && isTrialExpired ? "🔒 حفظ مؤمن" : hasUnsavedChanges ? "💾 حفظ التغييرات" : "✅ محفوظ"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Last Updated */}
                {product.lastUpdated && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    آخر تحديث: {formatDate(product.lastUpdated)}
                  </div>
                )}

                {/* معلومات سريعة للتجربة المجانية */}
                {userPlan === "free" && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎁</div>
                      <div>
                        <div className="font-semibold text-blue-800">التجربة المجانية</div>
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

              {/* Google Preview */}
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

              {/* SEO Fields */}
              <div className="space-y-6">
                
                {/* Basic Info */}
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

                {/* Description */}
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

                {/* Page Title & Description */}
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

                {/* Technical SEO */}
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

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* SEO Score */}
              <EnhancedSEODisplay analysis={score} product={product} />

              {/* Quick Tips */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  نصائح سريعة
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-500 mt-0.5">💡</div>
                    <div>
                      <strong>الكلمة المفتاحية:</strong> اختر كلمة لها حجم بحث جيد ومنافسة معقولة
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-green-500 mt-0.5">🎯</div>
                    <div>
                      <strong>Page Title:</strong> يجب أن يكون بين 50-60 حرف ويحتوي الكلمة المفتاحية
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-500 mt-0.5">📝</div>
                    <div>
                      <strong>الوصف:</strong> ابدأ بالكلمة المفتاحية واجعل المحتوى 100+ كلمة مع روابط داخلية
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-500 mt-0.5">🔗</div>
                    <div>
                      <strong>الروابط الداخلية:</strong> استخدم أداة الرابط 🔗 في شريط أدوات المحرر لإضافة روابط لصفحات أخرى في موقعك
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
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
    </>
  );
}