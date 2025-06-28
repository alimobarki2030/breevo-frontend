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

// Core SEO Criteria Checker
const checkCoreCriteria = (product) => {
  const criteria = [];
  const keyword = product.keyword?.trim().toLowerCase() || "";
  const title = product.name?.trim().toLowerCase() || "";
  const description = product.description?.trim() || "";
  const metaTitle = product.meta_title?.trim().toLowerCase() || "";
  const metaDescription = product.meta_description?.trim() || "";
  const imageAlt = product.imageAlt?.trim().toLowerCase() || "";
  
  // Remove HTML tags for word counting
  const cleanDescription = description.replace(/<[^>]*>/g, ' ').trim();
  const descriptionWords = cleanDescription.split(/\s+/).filter(word => word.length > 0);
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
  const hasLinks = /<a\s+[^>]*href=[^>]*>/i.test(description);
  criteria.push({
    id: 'internal_links',
    text: 'استخدام روابط داخلية',
    status: hasLinks ? 'pass' : 'fail'
  });

  // 8. Image ALT text includes focus keyword or product title
  const altIncludesKeyword = keyword && imageAlt.includes(keyword);
  const altIncludesTitle = product.name && imageAlt.includes(product.name.toLowerCase());
  criteria.push({
    id: 'image_alt_keyword',
    text: 'نص ALT للصورة يحتوي على الكلمة المفتاحية أو عنوان المنتج',
    status: altIncludesKeyword || altIncludesTitle ? 'pass' : 'fail'
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

// Enhanced SEO Display Component - Completely Revised
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

  // Additional criteria from original analysis
  const additionalCriteria = [];
  if (analysis && analysis.categories) {
    Object.entries(analysis.categories).forEach(([categoryName, checks]) => {
      if (checks && Array.isArray(checks)) {
        checks.forEach(check => {
          // Skip core criteria that we handle separately
          const coreIds = ['focus_keyword', 'keyword_in_title', 'keyword_in_first_25', 
                          'keyword_in_meta_title', 'has_meta_description', 'description_length',
                          'internal_links', 'image_alt_keyword'];
          if (!coreIds.includes(check.id)) {
            additionalCriteria.push({
              ...check,
              category: categoryName
            });
          }
        });
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header with Score - Always Visible */}
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

      {/* Progress Bar - Always Visible */}
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

      {/* Core Criteria - Always Visible */}
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
              معايير إضافية
            </h3>
            <button
              onClick={() => setShowAdditionalCriteria(!showAdditionalCriteria)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {showAdditionalCriteria ? 'إخفاء' : `عرض (${additionalCriteria.length})`}
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

      {/* Score Interpretation - Compact */}
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
    setCanUseAI(true); // Always true for owner
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
    // Site owner always has full access
    if (userPlan === "owner") {
      setProduct(prev => ({
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString()
      }));
      
      // Clear field error
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
      return;
    }

    // Regular user restrictions (for future customers)
    // if (userPlan === "free" && isTrialExpired) {
    //   showUpgradePrompt();
    //   return;
    // }

    setProduct(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString()
    }));
    
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors, userPlan]);

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
      // Removed trial usage increment for testing
      // if (userPlan === "free") {
      //   incrementTrialUsage();
      // }

      // Generate keyword


  
      const keyword = (await generateProductSEO(`استخرج كلمة مفتاحية لهذا المنتج: "${product.name}"`)).trim();


      // Enhanced categorization with both title AND description
      const productName = product.name?.trim() || '';
      const productDescription = product.description?.replace(/<[^>]*>/g, ' ').trim() || '';
      
     const categoryPrompt = await categorizeProduct(product);
const category = (await generateProductSEO(categoryPrompt)).trim();


      // Step 2: Analyze target audience based on category and product details
      const audiencePrompt = await analyzeTargetAudience(product, category);
const targetAudience = (await generateProductSEO(audiencePrompt)).trim();


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
        keyword: truncateText(keyword, FIELD_LIMITS.keyword_limit),
        category: analysis.category || "",
        target_audience: analysis.target_audience || "",
        tone: analysis.tone || "",
        best_story_arc: analysis.best_story_arc || "",
      }));

      setProductAnalysis(analysis);
      
      if (userPlan === "free") {
        const remaining = trialUsage.limit - trialUsage.used - 1;
        toast.success(`تم تحليل المنتج بنجاح! 🎯 (${remaining} تحليل متبقي هذا الشهر)`);
      } else {
        toast.success("تم تحليل المنتج بنجاح! 🎯");
      }
      
    } catch (error) {
      console.error("Error analyzing product:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "فشل في تحليل المنتج";
      setErrors(prev => ({ ...prev, analyze: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [product.name, product.description, userPlan, checkTrialAccess, trialUsage]);

  const handleGenerateAll = useCallback(async () => {
    if (userPlan === "free" && !checkTrialAccess()) {
      showUpgradePrompt();
      return;
    }

    if (!product.name?.trim()) {
      setErrors(prev => ({ ...prev, generate: "اسم المنتج مطلوب للتوليد" }));
      return;
    }

    setGenerating(true);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      // Increment trial usage for free users
      if (userPlan === "free") {
        incrementTrialUsage();
      }

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

      const keyword = product.keyword || "منتج";

      const prompt = `أنت مساعد تسويق محترف متخصص في SEO للسوق السعودي.

المنتج المطلوب تحسينه:
الاسم: "${product.name}"
الكلمة المفتاحية: "${keyword}"
الفئة: "${analysisData.category}"
الجمهور: "${analysisData.target_audience}"
النغمة: "${analysisData.tone}"
الحبكة: "${analysisData.best_story_arc}"

مهمتك: توليد محتوى متكامل لصفحة هذا المنتج المحدد يحقق أفضل نتائج SEO.

معايير SEO الإلزامية:
✅ الوصف يبدأ بالكلمة المفتاحية في أول 25 كلمة
✅ طول الوصف 120+ كلمة (ليس أقل)
✅ استخدام HTML منظم ومنسق مع روابط داخلية
✅ توزيع طبيعي للكلمة المفتاحية
✅ دعوة واضحة لاتخاذ إجراء في النهاية

هيكل الوصف المطلوب (مهم جداً):
1. فقرة افتتاحية قوية تبدأ بالكلمة المفتاحية <p>
2. قسم "المميزات الرئيسية" <h3>
3. قائمة 4-6 مميزات <ul><li>
4. قسم "كيفية الاستخدام" <h3>  
5. شرح بسيط للاستخدام <p>
6. فقرة ختامية تحفيزية مع CTA <p>
7. تضمين رابط داخلي واحد على الأقل

تنبيه مهم: يجب أن يكون المحتوى متناسب تماماً مع طبيعة المنتج "${product.name}".

أعد JSON فقط:
{
  "name": "عنوان محسن يحتوي الكلمة المفتاحية (أقل من 70 حرف)",
  "description": "وصف HTML منسق حسب المعايير أعلاه مع روابط داخلية",
  "keyword": "${keyword}",
  "meta_title": "Page Title عنوان السيو جذاب (50-60 حرف)",
  "meta_description": "Page Description وصف الميتا مقنع يحتوي الكلمة المفتاحية (150-160 حرف)",
  "url_path": "مسار-url-صديق-لمحركات-البحث",
  "imageAlt": "وصف بديل للصورة يحتوي الكلمة المفتاحية"
}`;

      const generated = await generateProductSEO(prompt);
      const jsonMatch = generated.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("لم يتم العثور على JSON صالح في الإجابة");
      }

      const fields = JSON.parse(jsonMatch[0]);

      // Apply field limits and validation
      const processedFields = {
        ...fields,
        name: truncateText(fields.name, FIELD_LIMITS.name_limit),
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
        keyword: keyword,
      };

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      if (userPlan === "free") {
        const remaining = trialUsage.limit - trialUsage.used - 1;
        toast.success(`تم توليد جميع الحقول بنجاح! ✨ (${remaining} تحليل متبقي هذا الشهر)`);
      } else {
        toast.success("تم توليد جميع الحقول بنجاح! ✨");
      }

    } catch (error) {
      console.error("Error generating fields:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "فشل في توليد المحتوى";
      setErrors(prev => ({ ...prev, generate: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [product, productAnalysis, userPlan, checkTrialAccess, trialUsage, handleAnalyzeProduct]);

  const handleGenerateField = useCallback(async (fieldType) => {
    // Remove restrictions for testing - allow all AI generation
    // if (!canUseAI) {
    //   toast.error("تحتاج لترقية خطتك لاستخدام التوليد التلقائي");
    //   return;
    // }

    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      const prompts = {
        keyword: `أنت خبير SEO محترف. اختر أفضل كلمة مفتاحية لهذا المنتج:

المنتج: ${product.name}
الوصف: ${product.description || 'غير متوفر'}
الفئة: ${product.category || 'عام'}

معايير الاختيار:
- حجم بحث عالي في السعودية
- منافسة معقولة
- صلة قوية بالمنتج
- احتمالية تحويل عالية

أعطني الكلمة المفتاحية فقط:`,
        
        description: `أنت كاتب محتوى متخصص في SEO. اكتب وصفاً HTML منسقاً لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}
النغمة: ${product.tone || 'محايدة'}

متطلبات الوصف:
- 120+ كلمة
- يبدأ بالكلمة المفتاحية
- HTML منسق (<p>, <ul>, <li>, <h3>)
- رابط داخلي واحد على الأقل
- دعوة واضحة لاتخاذ إجراء
- مناسب للسوق السعودي

أعد الوصف HTML فقط:`,
        
        meta_title: `أنشئ Page Title عنوان السيو مثالي لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

معايير العنوان:
- 50-60 حرف فقط
- يحتوي الكلمة المفتاحية
- جذاب ومقنع
- يناسب نتائج Google

أعطني العنوان فقط:`,
        
        meta_description: `اكتب Page Description وصف الميتا مثالي لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}
الفئة: ${product.category || 'عام'}

معايير الوصف:
- 150-160 حرف بالضبط
- يحتوي الكلمة المفتاحية
- يحفز على النقر
- يوضح الفائدة الأساسية

أعطني الوصف فقط:`,
        
        url_path: `أنشئ مسار URL محسن لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

معايير المسار:
- صديق لمحركات البحث
- باللغة الإنجليزية
- كلمات مفصولة بشرطات
- موجز وواضح

أعطني المسار فقط (بدون http):`,
        
        imageAlt: `أنشئ نص ALT مثالي لصورة هذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

معايير النص:
- وصف دقيق للصورة
- يحتوي الكلمة المفتاحية
- 10-15 كلمة
- مفيد للمكفوفين

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
  }, [product, canUseAI]);

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
              {userPlan !== "free" && (
                <button
                  onClick={() => handleGenerateField(key)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                    isLoading 
                      ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                  disabled={isLoading}
                  title="توليد ذكي"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      توليد ذكي
                    </>
                  )}
                </button>
              )}
              {userPlan === "free" && checkTrialAccess() && (
                <button
                  onClick={() => handleGenerateField(key)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                    isLoading 
                      ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  disabled={isLoading}
                  title={`توليد ذكي (${trialUsage.limit - trialUsage.used} متبقي)`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      تجربة مجانية ({trialUsage.limit - trialUsage.used})
                    </>
                  )}
                </button>
              )}
              {userPlan === "free" && !checkTrialAccess() && (
                <button
                  onClick={showUpgradePrompt}
                  className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center gap-1"
                >
                  <Crown className="w-3 h-3" />
                  ترقية مطلوبة
                </button>
              )}
              {fieldValue && !isLocked && (
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
          
          {/* Rich text editor note */}
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
            {userPlan !== "free" && (
              <button
                onClick={() => handleGenerateField(key)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                  isLoading 
                    ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
                disabled={isLoading}
                title="توليد ذكي"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                    جاري...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3" />
                    توليد
                  </>
                )}
              </button>
            )}
            {userPlan === "free" && checkTrialAccess() && (
              <button
                onClick={() => handleGenerateField(key)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                  isLoading 
                    ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
                disabled={isLoading}
                title={`توليد ذكي (${trialUsage.limit - trialUsage.used} متبقي)`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                    جاري...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3" />
                    تجربة ({trialUsage.limit - trialUsage.used})
                  </>
                )}
              </button>
            )}
            {userPlan === "free" && !checkTrialAccess() && (
              <button
                onClick={showUpgradePrompt}
                className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center gap-1"
              >
                <Crown className="w-3 h-3" />
                ترقية
              </button>
            )}
            {fieldValue && !isLocked && (
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

        {/* Field-specific hints */}
        {key === 'meta_title' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Title المثالي: 50-60 حرف، يحتوي الكلمة المفتاحية، جذاب للنقر
          </div>
        )}
        {key === 'meta_description' && !isLocked && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Description المثالي: 150-160 حرف، يحتوي الكلمة المفتاحية، يحفز على الزيارة
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
  }, [product, errors, fieldLoading, userPlan, isTrialExpired, trialUsage, checkTrialAccess, handleGenerateField, handleProductChange, copyToClipboard, showUpgradePrompt]);

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
          
          {/* Header */}
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
                تحليل وتحسين السيو
              </h1>
              {hasUnsavedChanges && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  تغييرات غير محفوظة
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {userPlan === "owner" && (
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  👑 مالك الموقع - وصول كامل
                </div>
              )}
              {userPlan === "free" && userPlan !== "owner" && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  💎 التجربة المجانية: {trialUsage.used}/{trialUsage.limit} تحليل مستخدم
                </div>
              )}
              {userPlan !== "free" && userPlan !== "owner" && (
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  ✨ عضوية مميزة - استخدام غير محدود
                </div>
              )}
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
              
              {/* Product Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    معلومات المنتج
                  </h2>
                  <div className="flex gap-2">
                    {userPlan !== "free" && (
                      <button
                        onClick={handleGenerateAll}
                        disabled={generating}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          generating 
                            ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                        }`}
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                            جاري التوليد...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            توليد شامل بالذكاء الاصطناعي
                          </>
                        )}
                      </button>
                    )}
                    {userPlan === "free" && checkTrialAccess() && (
                      <button
                        onClick={handleGenerateAll}
                        disabled={generating}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          generating 
                            ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                            : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                        }`}
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                            جاري التوليد...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            تجربة مجانية ({trialUsage.limit - trialUsage.used})
                          </>
                        )}
                      </button>
                    )}
                    {userPlan === "free" && !checkTrialAccess() && (
                      <button
                        onClick={showUpgradePrompt}
                        className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all flex items-center gap-2"
                      >
                        <Crown className="w-4 h-4" />
                        ترقية للاستمرار
                      </button>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={saving || !hasUnsavedChanges || (userPlan === "free" && isTrialExpired)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        saving 
                          ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                          : hasUnsavedChanges && !(userPlan === "free" && isTrialExpired)
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border border-blue-600 border-t-transparent"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {userPlan === "free" && isTrialExpired ? "🔒 حفظ مؤمن" : "حفظ التغييرات"}
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

                {/* Product Analysis Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      تحليل المنتج والجمهور
                    </h3>
                    {userPlan === "free" && checkTrialAccess() && (
                      <button
                        onClick={handleAnalyzeProduct}
                        disabled={generating}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                          generating 
                            ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                            تحليل...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3" />
                            تجربة مجانية ({trialUsage.limit - trialUsage.used})
                          </>
                        )}
                      </button>
                    )}
                    {userPlan === "free" && !checkTrialAccess() && (
                      <button
                        onClick={showUpgradePrompt}
                        className="px-3 py-1 text-xs rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-1"
                      >
                        <Crown className="w-3 h-3" />
                        ترقية مطلوبة
                      </button>
                    )}
                    {userPlan !== "free" && (
                      <button
                        onClick={handleAnalyzeProduct}
                        disabled={generating}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                          generating 
                            ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border border-yellow-600 border-t-transparent"></div>
                            تحليل...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3" />
                            تحليل ذكي
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">📦 فئة المنتج</label>
                      <input
                        type="text"
                        value={product.category || ""}
                        onChange={(e) => handleProductChange('category', e.target.value)}
                        placeholder="مثل: إلكترونيات، ملابس، منزل..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">🎯 الجمهور المستهدف</label>
                      <input
                        type="text"
                        value={product.target_audience || ""}
                        onChange={(e) => handleProductChange('target_audience', e.target.value)}
                        placeholder="مثل: الشباب، العائلات، المهنيين..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">🎭 النغمة</label>
                      <select
                        value={product.tone || ""}
                        onChange={(e) => handleProductChange('tone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {STORY_ARC_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
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
                      <strong>الوصف:</strong> ابدأ بالكلمة المفتاحية واجعل المحتوى 120+ كلمة مع روابط داخلية
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

              {/* Progress Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  ملخص التقدم
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">النقاط الإجمالية</span>
                    <span className={`font-bold ${getScoreColor(progress)}`}>
                      {progress}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        progress >= 85 ? 'bg-green-500' : 
                        progress >= 70 ? 'bg-blue-500' :
                        progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    {progress >= 85 && "ممتاز! 🎉"}
                    {progress >= 70 && progress < 85 && "جيد جداً! 👍"}
                    {progress >= 50 && progress < 70 && "يحتاج تحسين 📈"}
                    {progress < 50 && "ابدأ التحسين 🚀"}
                  </div>
                  
                  {/* Core Field completion status */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-700 mb-2">المعايير الأساسية:</div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {[
                        { key: 'keyword', label: 'الكلمة المفتاحية' },
                        { key: 'name', label: 'عنوان يحتوي الكلمة المفتاحية' },
                        { key: 'description', label: 'وصف 120+ كلمة' },
                        { key: 'meta_title', label: 'Page Title' },
                        { key: 'meta_description', label: 'Page Description' },
                        { key: 'imageAlt', label: 'Image Alt' }
                      ].map(field => {
                        const coreResults = checkCoreCriteria(product);
                        const criterion = coreResults.criteria.find(c => c.id.includes(field.key) || c.text.includes(field.label));
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
  