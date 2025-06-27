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
  { value: "مقنعة", label: "مقنعة - تحفز الشراء الفوري" },
  { value: "موثوقة", label: "موثوقة - تبني الثقة والأمان" },
  { value: "حماسية", label: "حماسية - تثير الإعجاب والرغبة" },
  { value: "احترافية", label: "احترافية - للمنتجات التقنية والطبية" },
  { value: "دافئة", label: "دافئة - للمنتجات العائلية والشخصية" },
  { value: "عصرية", label: "عصرية - للمنتجات الحديثة والترند" },
  { value: "فاخرة", label: "فاخرة - للمنتجات المميزة والغالية" },
  { value: "عملية", label: "عملية - للأدوات والمعدات الوظيفية" }
];

const STORY_ARC_OPTIONS = [
  { value: "", label: "اختر الحبكة" },
  { value: "مشكلة-حل", label: "مشكلة ← حل (الأكثر فعالية)" },
  { value: "قبل-بعد", label: "قبل ← بعد (للتحولات المرئية)" },
  { value: "الفوائد-الحصرية", label: "الفوائد الحصرية (للمنتجات المميزة)" },
  { value: "المقارنة-التفوق", label: "المقارنة والتفوق (ضد المنافسين)" },
  { value: "التجربة-الشخصية", label: "التجربة الشخصية (قصص العملاء)" },
  { value: "الاكتشاف-المبكر", label: "الاكتشاف المبكر (للمنتجات الجديدة)" }
];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

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
    text: `طول الوصف لا يقل عن 100 كلمة (حالياً: ${descriptionWords.length} كلمة)`,
    status: descriptionWords.length >= 100 ? 'pass' : 'fail'
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
            {coreResults.passedCount}/{coreResults.totalCount} معيار
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

      {/* Score Interpretation */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="text-sm font-medium text-blue-900 mb-1">
          {coreResults.score >= 85 && "ممتاز! جميع المعايير الأساسية مكتملة تقريباً"}
          {coreResults.score >= 70 && coreResults.score < 85 && "جيد جداً! معظم المعايير الأساسية مكتملة"}
          {coreResults.score >= 50 && coreResults.score < 70 && "يحتاج تحسين في المعايير الأساسية"}
          {coreResults.score < 50 && "ابدأ بتطبيق المعايير الأساسية"}
        </div>
        <div className="text-xs text-blue-700">
          أكمل المعايير الأساسية أولاً للحصول على أفضل نتائج السيو
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
      console.log('🔄 Starting product analysis...');

      // ✅ FIXED: Enhanced keyword generation
      const keywordPrompt = `أنت خبير SEO محترف. استخرج أفضل كلمة مفتاحية لهذا المنتج:

المنتج: "${product.name}"

معايير الكلمة المفتاحية المثالية:
- حجم بحث عالي في السعودية
- منافسة معقولة
- صلة مباشرة بالمنتج
- احتمالية تحويل عالية
- 2-4 كلمات فقط

أمثلة جيدة:
- منتج: "كريم مرطب للوجه" → كلمة مفتاحية: "كريم مرطب للوجه"
- منتج: "ساعة ذكية سامسونج" → كلمة مفتاحية: "ساعة ذكية سامسونج"
- منتج: "شامبو للشعر الجاف" → كلمة مفتاحية: "شامبو للشعر الجاف"

أعد الكلمة المفتاحية فقط بدون علامات اقتباس أو شرح:`;

      const keyword = cleanText(await generateProductSEO(keywordPrompt));
      console.log('✅ Generated keyword:', keyword);

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
      
      toast.success("تم تحليل المنتج بنجاح! 🎯");
      
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
      console.log('🔄 Starting comprehensive generation...');

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

      const keyword = cleanText(product.keyword) || "منتج";

      // ✅ ENHANCED: Better comprehensive generation prompt for E-commerce
      const prompt = `أنت مساعد تسويق محترف متخصص في SEO للتجارة الإلكترونية في السوق السعودي.

المنتج المطلوب تحسينه:
الاسم: "${product.name}"
الكلمة المفتاحية: "${keyword}"
الفئة: "${analysisData.category}"
الجمهور: "${analysisData.target_audience}"
النغمة: "${analysisData.tone}"
الحبكة: "${analysisData.best_story_arc}"

مهمتك: توليد محتوى متكامل لصفحة منتج في متجر إلكتروني يحقق أفضل نتائج SEO للتجارة الإلكترونية.

معايير SEO الإلزامية للتجارة الإلكترونية:
✅ الوصف يبدأ بالكلمة المفتاحية "${keyword}" في أول 25 كلمة
✅ طول الوصف 150+ كلمة (ليس أقل) مناسب للمتاجر الإلكترونية
✅ استخدام HTML منظم مع عناصر تحفز الشراء
✅ توزيع طبيعي للكلمة المفتاحية في النص
✅ ذكر مواصفات المنتج (الحجم، الكمية، الأبعاد)
✅ دعوة واضحة لاتخاذ إجراء (اشتري الآن، اطلب، احصل على)
✅ عناصر الثقة والضمان للمتاجر الإلكترونية

هيكل الوصف المطلوب للتجارة الإلكترونية:
1. فقرة افتتاحية قوية تبدأ بـ "${keyword}" وتحفز الشراء <p>
2. قسم "المميزات والفوائد" <h3>
3. قائمة 4-6 مميزات أساسية للمنتج <ul><li>
4. قسم "المواصفات والتفاصيل" <h3>  
5. شرح المواصفات التقنية أو طريقة الاستخدام <p>
6. فقرة ختامية تحفيزية مع ضمانات ودعوة واضحة للشراء <p>

تنبيه مهم للتجارة الإلكترونية: المحتوى يجب أن يركز على فوائد الشراء، الثقة، والضمانات.

أعد JSON فقط:
{
  "name": "عنوان محسن يحتوي الكلمة المفتاحية ${keyword} (أقل من 70 حرف)",
  "description": "وصف HTML منسق حسب المعايير أعلاه يبدأ بـ ${keyword}",
  "keyword": "${keyword}",
  "meta_title": "Page Title يحتوي ${keyword} + كلمات تجارية (50-60 حرف)",
  "meta_description": "Page Description يحتوي ${keyword} + CTA واضح (145-150 حرف)",
  "url_path": "مسار-url-يحتوي-الكلمة-المفتاحية",
  "imageAlt": "وصف صورة يحتوي ${keyword} ووصف المنتج"
}`;

      console.log('📤 Sending comprehensive generation request...');
      const generated = await generateProductSEO(prompt);
      console.log('📥 Received response:', generated.substring(0, 200) + '...');
      
      const jsonMatch = generated.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("لم يتم العثور على JSON صالح في الإجابة");
      }

      const fields = JSON.parse(jsonMatch[0]);

      // ✅ FIXED: Clean all generated fields
      const processedFields = {
        name: truncateText(fields.name, FIELD_LIMITS.name_limit),
        description: fields.description || "",
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
        keyword: cleanText(fields.keyword),
        url_path: cleanText(fields.url_path),
        imageAlt: cleanText(fields.imageAlt),
      };

      console.log('✅ Processed fields:', processedFields);

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      toast.success("تم توليد جميع الحقول بنجاح! ✨");

    } catch (error) {
      console.error("Error generating fields:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "فشل في توليد المحتوى";
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
      console.log(`🔄 Generating field: ${fieldType}`);
      
      const prompts = {
  keyword: `You are a professional Arabic SEO expert. Choose the most relevant Arabic target keyword for this product in the Saudi market.

Product: ${product.name}
Description: ${product.description || 'غير متوفر'}
Category: ${product.category || 'عام'}

Selection criteria:
- High search volume in Saudi Arabia
- Reasonable competition
- Strong product relevance
- High conversion potential

Provide only the keyword in Arabic without quotation marks.`,

  description: `You are a professional Arabic marketing copywriter specialized in SEO. Write an HTML formatted product description in Arabic.

Product: ${product.name}
Target keyword: ${cleanText(product.keyword) || 'منتج'}
Tone: ${product.tone || 'محايدة'}

Description requirements:
- At least 100 words
- Start the first paragraph with the target keyword
- Use proper HTML tags (<p>, <ul>, <li>, <h3>)
- Include at least one internal link
- Mention product specifications (size, quantity)
- Add a clear call to action
- Suitable for the Saudi market

Provide only the HTML content in Arabic.`,

  meta_title: `أنشئ عنوان SEO احترافي للتجارة الإلكترونية يحتوي على الكلمة المفتاحية ولا يتجاوز 60 حرفًا:

Product: ${product.name}
Target keyword: ${cleanText(product.keyword) || 'منتج'}
Description: ${product.description || 'غير متوفر'}

Title requirements:
- Between 50 and 60 characters
- MUST include the target keyword "${cleanText(product.keyword) || 'منتج'}" naturally
- Attractive and persuasive for Google search results
- Include purchase-encouraging words like "شراء", "أفضل", "سعر", "مضمون"

Examples for inspiration:
- "شراء ${cleanText(product.keyword) || 'منتج'} بأفضل سعر"
- "${cleanText(product.keyword) || 'منتج'} أصلي مضمون - توصيل مجاني"

Provide only the title text in Arabic that CONTAINS the target keyword.`,

  meta_description: `اكتب وصف ميتا تسويقي للتجارة الإلكترونية يحتوي الكلمة المفتاحية ويحفز الشراء، بين 145-150 حرفًا:

Product: ${product.name}
Target keyword: ${cleanText(product.keyword) || 'منتج'}
Category: ${product.category || 'عام'}

Description requirements:
- Exactly 145-150 characters
- MUST naturally include the target keyword "${cleanText(product.keyword) || 'منتج'}"
- Clearly communicate the main customer benefit
- Include a clear call-to-action (CTA)
- Encourage clicks with purchase motivation

Example format:
"اشتري ${cleanText(product.keyword) || 'منتج'} بأفضل جودة وسعر. توصيل مجاني وضمان استرداد. اطلب الآن واحصل على خصم!"

Provide only the description text in Arabic that CONTAINS the target keyword.`,

  url_path: `Generate an SEO-friendly English URL path for this product.

Product: ${product.name}
Target keyword: ${cleanText(product.keyword) || 'product'}

URL requirements:
- All lowercase
- Words separated by hyphens
- Short and clear
- No special characters

Provide only the URL path without http.`,

  imageAlt: `Create a descriptive Arabic ALT text for this product image.

Product: ${product.name}
Target keyword: ${cleanText(product.keyword) || 'منتج'}

ALT text requirements:
- Accurately describe the image
- Include the target keyword naturally
- Between 10 and 15 words
- Help visually impaired users understand the image

Provide only the Arabic ALT text.`
};


      const prompt = prompts[fieldType];
      if (!prompt) {
        throw new Error(`لا يوجد برومبت للحقل: ${fieldType}`);
      }

      const response = await generateProductSEO(prompt);
      let value = cleanText(response); // ✅ Clean the response

      // Apply field-specific processing
      if (fieldType === "meta_title") {
        value = truncateText(value, FIELD_LIMITS.meta_title);
      } else if (fieldType === "meta_description") {
        value = truncateText(value, FIELD_LIMITS.meta_description);
      }

      console.log(`✅ Generated ${fieldType}:`, value);

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
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Rich Text Editor</span>
            </label>
            <div className="flex items-center gap-2">
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
                    <div className="animate-pulse">🤖</div>
                    AI
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
          
          {/* Rich text editor note */}
          <div className="text-xs text-gray-500 mt-2">
            💡 استخدم المحرر لإضافة <strong>التنسيق</strong>، <strong>الروابط الداخلية</strong>، والقوائم المنظمة
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
                  <div className="animate-pulse">🤖</div>
                  AI
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

        {/* Field-specific hints */}
        {key === 'meta_title' && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Title المثالي: 50-60 حرف، يحتوي الكلمة المفتاحية، جذاب للنقر
          </div>
        )}
        {key === 'meta_description' && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Description المثالي: 150-160 حرف، يحتوي الكلمة المفتاحية، يحفز على الزيارة
          </div>
        )}
        {key === 'keyword' && (
          <div className="text-xs text-gray-500 mt-2">
            💡 اختر كلمة مفتاحية بحجم بحث عالي ومنافسة معقولة
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
                    <button
                      onClick={handleGenerateAll}
                      disabled={generating}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
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
                          <div className="animate-pulse">🤖</div>
                          التوليد الشامل
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !hasUnsavedChanges}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        saving 
                          ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                          : hasUnsavedChanges
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

                {/* Product Analysis Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      تحليل المنتج والجمهور
                    </h3>
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
                          <div className="animate-pulse">🤖</div>
                          تحليل ذكي
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

              {/* ✅ ENHANCED: Quick Tips with New SEO Criteria */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  نصائح سريعة محسنة
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-500 mt-0.5">🎯</div>
                    <div>
                      <strong>الكلمة المفتاحية:</strong> اختر كلمة مرتبطة بنية الشراء مثل "شراء [منتج]" أو "[منتج] أصلي"
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-green-500 mt-0.5">📍</div>
                    <div>
                      <strong>Page Title:</strong> يجب أن يحتوي الكلمة المفتاحية + كلمات تحفز الشراء (أفضل سعر، مضمون، توصيل مجاني)
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-500 mt-0.5">🛒</div>
                    <div>
                      <strong>Page Description:</strong> يجب أن يحتوي الكلمة المفتاحية + دعوة واضحة للشراء مع فوائد محددة
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-500 mt-0.5">📏</div>
                    <div>
                      <strong>مواصفات المنتج:</strong> اذكر تفاصيل مهمة للشراء (الحجم، الكمية، المادة، اللون، الضمان)
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="text-red-500 mt-0.5">🎁</div>
                    <div>
                      <strong>عناصر الثقة:</strong> أضف "ضمان الاسترداد"، "توصيل مجاني"، "منتج أصلي"، "خدمة عملاء 24/7"
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 mt-0.5">🔗</div>
                    <div>
                      <strong>الروابط الداخلية:</strong> اربط بصفحات منتجات مشابهة، فئات، أو صفحة الضمانات لتحسين التجربة
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
                        { key: 'description', label: 'وصف 100+ كلمة' },
                        { key: 'meta_title', label: 'Page Title' },
                        { key: 'meta_description', label: 'Page Description' },
                        { key: 'imageAlt', label: 'Image Alt' },
                        { key: 'specs', label: 'مواصفات المنتج' },
                        { key: 'cta', label: 'دعوة لاتخاذ إجراء' }
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