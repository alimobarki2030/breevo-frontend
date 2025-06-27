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
  Loader2
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

// Smart Analysis Component - New Auto-Analysis Card
const SmartAnalysisCard = ({ product, onUpdate, isAnalyzing, userPlan, canAnalyze }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsAnalysis, setNeedsAnalysis] = useState(false);

  // Check if analysis is needed
  useEffect(() => {
    const hasBasicInfo = product.name?.trim();
    const hasAnalysis = product.category && product.target_audience && product.tone && product.best_story_arc;
    setNeedsAnalysis(hasBasicInfo && !hasAnalysis);
  }, [product]);

  // Auto-analyze when product changes (debounced)
  useEffect(() => {
    if (!needsAnalysis || !canAnalyze) return;
    
    const timer = setTimeout(() => {
      if (product.name?.trim() && product.name.length > 3) {
        handleAutoAnalysis();
      }
    }, 2000); // Wait 2 seconds after user stops typing

    return () => clearTimeout(timer);
  }, [product.name, product.description, needsAnalysis, canAnalyze]);

  const handleAutoAnalysis = async () => {
    if (!canAnalyze || isAnalyzing) return;
    
    try {
      const analysis = await performAnalysis();
      onUpdate(analysis);
      toast.success("تم التحليل التلقائي بنجاح! 🤖", { duration: 2000 });
    } catch (error) {
      console.log("Auto-analysis failed:", error);
    }
  };

  const performAnalysis = async () => {
    const { categorizeProduct, analyzeTargetAudience, selectTone, selectStoryArc } = analyzeSEO(product);
    
    const keyword = (await generateProductSEO(`استخرج كلمة مفتاحية لهذا المنتج: "${product.name}"`)).trim();
    const categoryPrompt = await categorizeProduct(product);
    const category = (await generateProductSEO(categoryPrompt)).trim();
    const audiencePrompt = await analyzeTargetAudience(product, category);
    const targetAudience = (await generateProductSEO(audiencePrompt)).trim();
    const tone = selectTone(category, targetAudience);
    const bestStoryArc = selectStoryArc(category);

    return {
      keyword: truncateText(keyword, FIELD_LIMITS.keyword_limit),
      category: category || "",
      target_audience: targetAudience || "",
      tone: tone || "",
      best_story_arc: bestStoryArc || "",
    };
  };

  const hasAnalysis = product.category && product.target_audience && product.tone && product.best_story_arc;

  return (
    <div className={`relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border transition-all duration-300 ${
      hasAnalysis ? 'border-green-200' : needsAnalysis ? 'border-blue-200' : 'border-gray-200'
    }`}>
      
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${hasAnalysis ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : hasAnalysis ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Brain className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                التحليل الذكي للمنتج
                {hasAnalysis && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">مكتمل</span>}
                {needsAnalysis && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">جاهز للتحليل</span>}
              </h3>
              <p className="text-sm text-gray-600">
                {isAnalyzing ? "جاري التحليل التلقائي..." : 
                 hasAnalysis ? "تم تحليل المنتج وتحديد الجمهور المستهدف" : 
                 "سيتم التحليل تلقائياً عند إدخال اسم المنتج"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canAnalyze && !isAnalyzing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAutoAnalysis();
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                إعادة التحليل
              </button>
            )}
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                فئة المنتج
              </label>
              <input
                type="text"
                value={product.category || ""}
                onChange={(e) => onUpdate({ category: e.target.value })}
                placeholder="مثل: إلكترونيات، ملابس، منزل..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white/70 backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                الجمهور المستهدف
              </label>
              <input
                type="text"
                value={product.target_audience || ""}
                onChange={(e) => onUpdate({ target_audience: e.target.value })}
                placeholder="مثل: الشباب، العائلات، المهنيين..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white/70 backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-500" />
                النغمة التسويقية
              </label>
              <select
                value={product.tone || ""}
                onChange={(e) => onUpdate({ tone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm bg-white/70 backdrop-blur-sm"
              >
                {TONE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-500" />
                الحبكة التسويقية
              </label>
              <select
                value={product.best_story_arc || ""}
                onChange={(e) => onUpdate({ best_story_arc: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white/70 backdrop-blur-sm"
              >
                {STORY_ARC_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Analysis Results Preview */}
          {hasAnalysis && (
            <div className="mt-4 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/70">
              <div className="text-xs text-gray-600 mb-2">نتائج التحليل:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="font-medium">الفئة:</span> {product.category}</div>
                <div><span className="font-medium">الجمهور:</span> {product.target_audience}</div>
                <div><span className="font-medium">النغمة:</span> {product.tone}</div>
                <div><span className="font-medium">الحبكة:</span> {product.best_story_arc}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
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

// Main Component continues with the rest of the logic...
// [The rest of the component remains the same, but with the new SmartAnalysisCard integrated]

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const checkTrialAccess = () => {
    // Site owner always has access
    if (userPlan === "owner") return true;
    if (userPlan !== "free") return true;
    return trialUsage.used < trialUsage.limit;
  };

  const showUpgradePrompt = () => {
    setShowUpgradeModal(true);
  };

  // Updated handleProductChange to work with the new analysis card
  const handleProductChange = useCallback((field, value) => {
    if (typeof field === 'object') {
      // Handle multiple fields update from analysis card
      setProduct(prev => ({
        ...prev,
        ...field,
        lastUpdated: new Date().toISOString()
      }));
    } else {
      // Handle single field update
      setProduct(prev => ({
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString()
      }));
      
      // Clear field error
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    }
  }, [errors]);

  // Auto-analysis handler for the SmartAnalysisCard
  const handleAnalysisUpdate = useCallback((analysisData) => {
    setIsAnalyzing(true);
    handleProductChange(analysisData);
    setIsAnalyzing(false);
    setProductAnalysis(analysisData);
  }, [handleProductChange]);

  // Rest of the component logic remains the same...
  // [Include all the existing useEffect hooks, functions, and render logic]

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
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'إخفاء المعاينة' : 'معاينة Google'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Smart Analysis Card - New improved design */}
              <SmartAnalysisCard 
                product={product}
                onUpdate={handleAnalysisUpdate}
                isAnalyzing={isAnalyzing}
                userPlan={userPlan}
                canAnalyze={checkTrialAccess()}
              />

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

              {/* Rest of the form fields... */}
              {/* [Include all existing form sections with the renderInputField function] */}
              
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* SEO Score */}
              <EnhancedSEODisplay analysis={score} product={product} />

              {/* Quick Tips - Updated */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  نصائح ذكية
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="text-blue-500 mt-0.5">🤖</div>
                    <div>
                      <strong>التحليل التلقائي:</strong> سيتم تحليل منتجك تلقائياً بناءً على الاسم والوصف
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-green-500 mt-0.5">🎯</div>
                    <div>
                      <strong>الكلمة المفتاحية:</strong> ستُقترح تلقائياً بناءً على تحليل المنتج
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-500 mt-0.5">📝</div>
                    <div>
                      <strong>المحتوى الذكي:</strong> استخدم الأزرار الذكية لتوليد محتوى محسن
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}