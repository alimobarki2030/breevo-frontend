import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  Save, 
  Wand2, 
  Zap, 
  BarChart3, 
  Eye, 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Globe,
  Image,
  RefreshCw,
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
  AlertTriangle,
  Coins,
  Lock
} from "lucide-react";

import UserNavbar from '../components/navbars/UserNavbar';
import analyzeSEO from "../analyzeSEO";
import TiptapEditor from "../components/TiptapEditor";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// نص البرومبت المحفوظ
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
  meta_title: { min: 53, max: 60 },
  meta_description: { min: 130, max: 150 },
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

// تكاليف الخدمات بالنقاط
const SERVICE_COSTS = {
  AI_DESCRIPTION: 10,
  AI_DESCRIPTION_ADVANCED: 30,
  SEO_ANALYSIS: 20,
  SEO_OPTIMIZATION: 50,
  KEYWORD_RESEARCH: 30,
  BULK_OPTIMIZATION: 100,
  AI_IMAGE_GENERATION: 150
};

// دالة التوليد باستخدام البرومبت المحفوظ
const generateWithCustomPrompt = async (variables) => {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("OpenAI API Key غير موجود في متغيرات البيئة");
  }

  try {
    let processedPrompt = SAVED_PROMPT_TEMPLATE
      .replace(/{{product_name}}/g, variables.product_name || '')
      .replace(/{{keyword}}/g, variables.keyword || '')
      .replace(/{{audience}}/g, variables.audience || 'العملاء العرب')
      .replace(/{{tone}}/g, variables.tone || 'احترافية');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: processedPrompt
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

// نافذة شراء النقاط
const PurchasePointsModal = ({ show, onClose, userPoints, onSuccess }) => {
  if (!show) return null;

  const packages = [
    { id: 1, name: 'حزمة صغيرة', points: 500, price: 29 },
    { id: 2, name: 'حزمة متوسطة', points: 1000, price: 49 },
    { id: 3, name: 'حزمة كبيرة', points: 3000, price: 99, popular: true },
    { id: 4, name: 'حزمة ضخمة', points: 10000, price: 299 }
  ];

  const handlePurchase = async (packageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/points/packages/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package_id: packageId,
          payment_method: 'credit_card'
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('تم شراء النقاط بنجاح!');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'فشل في شراء النقاط');
      }
    } catch (error) {
      toast.error('خطأ في معالجة الشراء');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">شراء نقاط إضافية</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          {userPoints && (
            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span>رصيدك الحالي: <strong>{userPoints.balance}</strong> نقطة</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                  pkg.popular ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    الأكثر شعبية
                  </span>
                )}
                <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {pkg.points.toLocaleString()} نقطة
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {pkg.price} ريال
                </div>
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  شراء الآن
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>ملاحظة:</strong> النقاط صالحة لمدة 6 أشهر من تاريخ الشراء
            </p>
          </div>
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
  const [warnings, setWarnings] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now());
  const [copiedFields, setCopiedFields] = useState({});

  // نظام النقاط
  const [userPoints, setUserPoints] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Smart Generation Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateOptions, setGenerateOptions] = useState(() => {
    const saved = localStorage.getItem("seo_generate_options");
    return saved ? JSON.parse(saved) : {
      productNameAction: "keep",
      keywordAction: "generate", 
      customKeyword: ""
    };
  });

  // دالة التحقق من المالك
  const checkIfOwner = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // قائمة بجميع الطرق للتحقق من المالك
    const ownerEmails = [
      "alimobarki.ad@gmail.com",
      "sul2tan2009@hotmail.com",
      "seo@seoraysa.com"
    ];
    
    const isOwnerCheck = 
      ownerEmails.includes(user.email?.toLowerCase()) ||
      user.role === "owner" ||
      user.role === "admin" ||
      user.id === "1" ||
      user.id === 1 ||
      user.is_owner === true ||
      user.isOwner === true;
      
    console.log("Owner check:", {
      email: user.email,
      role: user.role,
      id: user.id,
      isOwner: isOwnerCheck
    });
    
    return isOwnerCheck;
  };

  // تحميل رصيد النقاط
  useEffect(() => {
    loadUserPoints();
  }, []);

  const loadUserPoints = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPointsLoading(false);
        return;
      }

      // التحقق من المالك
      const ownerStatus = checkIfOwner();
      setIsOwner(ownerStatus);
      
      if (ownerStatus) {
        console.log("✅ تم التعرف عليك كمالك الموقع");
        setUserPoints({
          balance: 999999,
          monthly_points: 999999,
          monthly_points_used: 0,
          available_monthly_points: 999999,
          total_purchased: 999999,
          total_spent: 0
        });
        setPointsLoading(false);
        return;
      }

      // للمستخدمين العاديين
      const response = await fetch(`${API_BASE_URL}/api/points/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserPoints(data);
      } else {
        console.error('Failed to load points balance');
      }
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setPointsLoading(false);
    }
  };

  // التحقق من توفر النقاط للخدمة
  const checkPointsForService = (serviceType) => {
    if (isOwner) return true; // المالك لديه وصول غير محدود
    if (!userPoints) return false;
    const cost = SERVICE_COSTS[serviceType] || 0;
    return userPoints.balance >= cost;
  };

  // استخدام النقاط للخدمة
  const usePointsForService = async (serviceType, metadata = {}) => {
    // التحقق من المالك
    if (isOwner) {
      console.log("✅ مالك الموقع - لا يتم خصم نقاط");
      return true; // لا نخصم نقاط من المالك
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/points/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_type: serviceType,
          metadata: {
            product_id: product.id,
            product_name: product.name,
            ...metadata
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        // تحديث الرصيد
        setUserPoints(prev => ({
          ...prev,
          balance: result.new_balance
        }));
        return true;
      } else {
        const error = await response.json();
        if (response.status === 402) {
          toast.error('رصيد النقاط غير كافي');
          setShowPurchaseModal(true);
        } else {
          toast.error(error.detail || 'فشل في استخدام النقاط');
        }
        return false;
      }
    } catch (error) {
      console.error('Error using points:', error);
      toast.error('خطأ في استخدام النقاط');
      return false;
    }
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
    setProduct(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString()
    }));
    
    if (warnings[field]) {
      setWarnings(prev => ({ ...prev, [field]: null }));
    }
  }, [warnings]);

  const validateProduct = useCallback(() => {
    const newWarnings = {};
    
    if (product.name && product.name.length > FIELD_LIMITS.name_limit) {
      newWarnings.name = `يُفضل ألا يتجاوز اسم المنتج ${FIELD_LIMITS.name_limit} حرف (حالياً ${product.name.length})`;
    }

    if (product.meta_title && product.meta_title.trim()) {
      const titleLength = product.meta_title.length;
      if (titleLength > FIELD_LIMITS.meta_title.max) {
        newWarnings.meta_title = `Page Title مثالي بين ${FIELD_LIMITS.meta_title.min}-${FIELD_LIMITS.meta_title.max} حرف (حالياً ${titleLength})`;
      } else if (titleLength < FIELD_LIMITS.meta_title.min) {
        newWarnings.meta_title = `Page Title مثالي بين ${FIELD_LIMITS.meta_title.min}-${FIELD_LIMITS.meta_title.max} حرف (حالياً ${titleLength})`;
      }
    }

    if (product.meta_description && product.meta_description.trim()) {
      const descLength = product.meta_description.length;
      if (descLength > FIELD_LIMITS.meta_description.max) {
        newWarnings.meta_description = `Page Description مثالي بين ${FIELD_LIMITS.meta_description.min}-${FIELD_LIMITS.meta_description.max} حرف (حالياً ${descLength})`;
      } else if (descLength < FIELD_LIMITS.meta_description.min) {
        newWarnings.meta_description = `Page Description مثالي بين ${FIELD_LIMITS.meta_description.min}-${FIELD_LIMITS.meta_description.max} حرف (حالياً ${descLength})`;
      }
    }

    setErrors({});
    setWarnings(newWarnings);
    
    return true;
  }, [product.name, product.meta_title, product.meta_description]);

  const handleSave = useCallback(async () => {
    validateProduct();

    const hasWarnings = Object.keys(warnings).length > 0;
    if (hasWarnings) {
      toast.warning("تم الحفظ! لكن هناك اقتراحات لتحسين السيو", { duration: 4000 });
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

      if (!hasWarnings) {
        toast.success("تم حفظ التعديلات بنجاح! ✅");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "حدث خطأ أثناء الحفظ";
      setErrors(prev => ({ ...prev, save: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setSaving(false);
    }
  }, [validateProduct, warnings, product]);

  // التوليد الذكي الشامل مع نظام النقاط
  const handleGenerateAll = useCallback(async () => {
    // التحقق من توفر النقاط
    if (!checkPointsForService('BULK_OPTIMIZATION')) {
      toast.error(`تحتاج ${SERVICE_COSTS.BULK_OPTIMIZATION} نقطة للتوليد الذكي الشامل`);
      setShowPurchaseModal(true);
      return;
    }

    if (!product.name?.trim()) {
      toast.error("⚠️ أدخل اسم المنتج أولاً");
      return;
    }

    setShowGenerateModal(true);
  }, [product.name]);

  // تنفيذ التوليد الذكي مع نظام النقاط
  const executeSmartGeneration = useCallback(async () => {
    setGenerating(true);
    setShowGenerateModal(false);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      // استخدام النقاط أولاً
      const pointsUsed = await usePointsForService('BULK_OPTIMIZATION', {
        action: 'full_generation'
      });

      if (!pointsUsed) {
        setGenerating(false);
        return;
      }

      toast.loading("🧠 جاري التوليد الذكي...", { id: 'generating' });

      let finalKeyword = "";
      if (generateOptions.keywordAction === "use_existing") {
        finalKeyword = generateOptions.customKeyword.trim();
      } else {
        finalKeyword = "";
      }

      let finalProductName = product.name;
      if (generateOptions.productNameAction === "add_keyword" && finalKeyword) {
        finalProductName = `${product.name} ${finalKeyword}`;
      } else if (generateOptions.productNameAction === "regenerate") {
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
          finalProductName = product.name;
        }
      }

      const variables = {
        product_name: finalProductName,
        keyword: finalKeyword || "توليد تلقائي",
        audience: "العملاء العرب",
        tone: "احترافية",
        existing_description: product.description || ""
      };

      const generated = await generateWithCustomPrompt(variables);
      
      let cleanedGenerated = generated
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
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
        throw new Error("فشل في تحليل المحتوى المُولد - يرجى المحاولة مرة أخرى");
      }

      const processedFields = {
        keyword: fields.keyword || finalKeyword || "يحتاج كلمة مفتاحية",
        name: finalProductName,
        description: fields.description || "",
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title.max),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description.max),
        url_path: fields.url_path?.trim() || "",
        imageAlt: fields.imageAlt?.trim() || ""
      };

      if (generateOptions.productNameAction === "add_keyword" && fields.keyword && !finalKeyword) {
        processedFields.name = `${product.name} ${fields.keyword}`;
      }

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      toast.success("🎉 تم إنشاء محتوى احترافي بنجاح!", { id: 'generating' });
      
      if (!processedFields.keyword && generateOptions.keywordAction === "generate") {
        toast.warning("⚠️ لم يتم توليد كلمة مفتاحية. يمكنك إضافتها يدوياً.", { duration: 4000 });
      }

    } catch (error) {
      console.error("Error generating fields:", error);
      
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
  }, [product.name, generateOptions]);

  // التوليد لحقل واحد مع نظام النقاط
  const handleGenerateField = useCallback(async (fieldType) => {
    // تحديد نوع الخدمة وتكلفتها
    let serviceType = 'AI_DESCRIPTION';
    if (fieldType === 'keyword') {
      serviceType = 'KEYWORD_RESEARCH';
    } else if (fieldType === 'meta_title' || fieldType === 'meta_description') {
      serviceType = 'SEO_OPTIMIZATION';
    } else if (fieldType === 'description') {
      serviceType = 'AI_DESCRIPTION_ADVANCED';
    }

    // التحقق من توفر النقاط
    if (!checkPointsForService(serviceType)) {
      toast.error(`تحتاج ${SERVICE_COSTS[serviceType]} نقطة لهذه الخدمة`);
      setShowPurchaseModal(true);
      return;
    }

    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      // استخدام النقاط أولاً
      const pointsUsed = await usePointsForService(serviceType, {
        field: fieldType
      });

      if (!pointsUsed) {
        setFieldLoading("");
        return;
      }

      const variables = {
        product_name: product.name,
        keyword: fieldType === "keyword" ? "توليد تلقائي" : (product.keyword || "توليد تلقائي"),
        audience: "العملاء العرب",
        tone: "احترافية",
        existing_description: product.description || ""
      };

      const response = await generateWithCustomPrompt(variables);
      
      let value = response.trim();
      
      if (fieldType === "keyword") {
        const jsonMatch = response.match(/{[\s\S]*}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            value = parsed.keyword || value;
          } catch (error) {
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

  const copyToClipboard = async (text, label, fieldKey) => {
    try {
      await navigator.clipboard.writeText(text);
      
      setCopiedFields(prev => ({ ...prev, [fieldKey]: true }));
      
      setTimeout(() => {
        setCopiedFields(prev => ({ ...prev, [fieldKey]: false }));
      }, 2000);
      
      toast.success(`تم نسخ ${label} للحافظة! 📋`);
    } catch (error) {
      toast.error("فشل في النسخ");
    }
  };

  const updateGenerateOptions = (newOptions) => {
    const updatedOptions = { ...generateOptions, ...newOptions };
    setGenerateOptions(updatedOptions);
    localStorage.setItem("seo_generate_options", JSON.stringify(updatedOptions));
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
        {/* عرض رصيد النقاط */}
        {!pointsLoading && userPoints && (
          <div className={`bg-gradient-to-r ${
            isOwner 
              ? 'from-purple-500 to-pink-500' 
              : 'from-yellow-400 to-orange-500'
          } text-gray-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2`}>
            <Coins className="w-4 h-4" />
            {isOwner ? '∞ مالك الموقع' : `${userPoints.balance.toLocaleString()} نقطة`}
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
              <p className="text-blue-700">أدخل اسم منتجك وسنقوم بتوليد محتوى احترافي باستخدام نظام النقاط</p>
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
              <p className="text-amber-700">اضغط "التوليد الذكي" للحصول على محتوى احترافي (100 نقطة)</p>
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
    const hasWarning = warnings[key];
    const isLoading = fieldLoading === key;
    const fieldValue = product[key] || "";
    const isCopied = copiedFields[key];
    
    // تحديد تكلفة النقاط للحقل
    let pointsCost = SERVICE_COSTS.AI_DESCRIPTION;
    if (key === 'keyword') {
      pointsCost = SERVICE_COSTS.KEYWORD_RESEARCH;
    } else if (key === 'meta_title' || key === 'meta_description') {
      pointsCost = SERVICE_COSTS.SEO_OPTIMIZATION;
    } else if (key === 'description') {
      pointsCost = SERVICE_COSTS.AI_DESCRIPTION_ADVANCED;
    }

    const hasEnoughPoints = userPoints && userPoints.balance >= pointsCost;
    
    const showCharCount = ['meta_title', 'meta_description', 'name'].includes(key);
    const charLimit = FIELD_LIMITS[key + '_limit'] || (FIELD_LIMITS[key]?.max || FIELD_LIMITS[key]);
    const charMin = FIELD_LIMITS[key]?.min;
    const charCount = fieldValue.length;
    const isOverLimit = charLimit && charCount > charLimit;
    const isUnderLimit = charMin && charCount < charMin && charCount > 0;

    if (key === "description") {
      return (
        <div className="relative bg-white p-6 rounded-2xl shadow-sm border transition-colors border-gray-200 hover:border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              {icon}
              {label}
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Rich Text Editor</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!hasEnoughPoints) {
                    toast.error(`تحتاج ${pointsCost} نقطة لهذه الخدمة`);
                    setShowPurchaseModal(true);
                    return;
                  }
                  handleGenerateField(key);
                }}
                className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                  isLoading 
                    ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                    : !hasEnoughPoints
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105"
                }`}
                disabled={isLoading}
                title={!hasEnoughPoints ? `تحتاج ${pointsCost} نقطة` : "التوليد الذكي"}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                ) : !hasEnoughPoints ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">{pointsCost}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs">{pointsCost}</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  if (fieldValue.trim()) {
                    copyToClipboard(fieldValue, label, key);
                  } else {
                    toast.warning(`${label} فارغ - لا يوجد محتوى للنسخ`);
                  }
                }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isCopied 
                    ? "bg-green-100 text-green-700 scale-110" 
                    : fieldValue.trim()
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400"
                }`}
                title={
                  isCopied ? "تم النسخ!" : 
                  fieldValue.trim() ? "نسخ" : 
                  "لا يوجد محتوى للنسخ"
                }
              >
                {isCopied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <TiptapEditor
            key={editorKey}
            value={fieldValue}
            onChange={(val) => handleProductChange(key, val)}
            placeholder={placeholder}
          />
          
          {hasWarning && (
            <div className="text-amber-500 text-xs mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {hasWarning}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            💡 استخدم المحرر لإضافة <strong>التنسيق</strong>، <strong>الروابط الداخلية</strong>، والقوائم المنظمة | أو جرب التوليد الذكي ({pointsCost} نقطة) 🧠
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-white p-6 rounded-2xl shadow-sm border transition-colors border-gray-200 hover:border-gray-300">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            {icon}
            {label}
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
            
            <button
              onClick={() => {
                if (!hasEnoughPoints) {
                  toast.error(`تحتاج ${pointsCost} نقطة لهذه الخدمة`);
                  setShowPurchaseModal(true);
                  return;
                }
                handleGenerateField(key);
              }}
              className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                isLoading 
                  ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                  : !hasEnoughPoints
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105"
              }`}
              disabled={isLoading}
              title={!hasEnoughPoints ? `تحتاج ${pointsCost} نقطة` : "التوليد الذكي"}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
              ) : !hasEnoughPoints ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">{pointsCost}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs">{pointsCost}</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                if (fieldValue.trim()) {
                  copyToClipboard(fieldValue, label, key);
                } else {
                  toast.warning(`${label} فارغ - لا يوجد محتوى للنسخ`);
                }
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isCopied 
                  ? "bg-green-100 text-green-700 scale-110" 
                  : fieldValue.trim()
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-400"
              }`}
              title={
                isCopied ? "تم النسخ!" : 
                fieldValue.trim() ? "نسخ" : 
                "لا يوجد محتوى للنسخ"
              }
            >
              {isCopied ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        {multiline ? (
          <textarea
            value={fieldValue}
            onChange={(e) => handleProductChange(key, e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 resize-y min-h-[120px] transition-colors ${
              hasWarning ? "border-amber-300 focus:ring-amber-500" :
              "border-gray-300 focus:ring-blue-500"
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
              hasWarning ? "border-amber-300 focus:ring-amber-500" :
              "border-gray-300 focus:ring-blue-500"
            }`}
          />
        )}
        
        {hasWarning && (
          <div className="text-amber-500 text-xs mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {hasWarning}
          </div>
        )}

        {key === 'meta_title' && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Title المثالي: 53-60 حرف بالضبط، يحتوي الكلمة المفتاحية، جذاب للنقر ({pointsCost} نقطة للتوليد)
          </div>
        )}
        {key === 'meta_description' && (
          <div className="text-xs text-gray-500 mt-2">
            💡 Page Description المثالي: 130-150 حرف بالضبط، يحتوي الكلمة المفتاحية، يحفز على الزيارة ({pointsCost} نقطة للتوليد)
          </div>
        )}
        {key === 'keyword' && (
          <div className="text-xs text-gray-500 mt-2">
            💡 اختر كلمة مفتاحية بحجم بحث عالي ومنافسة معقولة - أو جرب التوليد الذكي ({pointsCost} نقطة) 🧠
          </div>
        )}
        {key === 'url_path' && (
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
      <UserNavbar />
      
      <div className="min-h-screen flex bg-gray-50">
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          
          {renderPageHeader()}

          {(errors.save || errors.generate || errors.analyze || errors.load) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">خطأ:</span>
                <span>{errors.save || errors.generate || errors.analyze || errors.load}</span>
              </div>
            </div>
          )}

          {Object.keys(warnings).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">اقتراحات تحسين السيو:</span>
                <span>هناك بعض الاقتراحات لتحسين المحتوى</span>
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
                    <button
                      onClick={handleGenerateAll}
                      disabled={generating || !product.name?.trim() || (userPoints && userPoints.balance < SERVICE_COSTS.BULK_OPTIMIZATION)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm ${
                        generating 
                          ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                          : !product.name?.trim()
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : (userPoints && userPoints.balance < SERVICE_COSTS.BULK_OPTIMIZATION)
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
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
                      ) : (userPoints && userPoints.balance < SERVICE_COSTS.BULK_OPTIMIZATION) ? (
                        <>
                          <Lock className="w-5 h-5" />
                          تحتاج {SERVICE_COSTS.BULK_OPTIMIZATION} نقطة
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          التوليد الذكي ({SERVICE_COSTS.BULK_OPTIMIZATION} نقطة)
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving || !hasUnsavedChanges}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm ${
                        saving 
                          ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                          : hasUnsavedChanges
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                          جاري الحفظ...
                        </>
                      ) : hasUnsavedChanges ? (
                        <>
                          <Save className="w-5 h-5" />
                          حفظ
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          محفوظ
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

                {/* عرض رصيد النقاط وتكاليف الخدمات */}
                {userPoints && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Coins className="text-2xl text-yellow-600" />
                        <div>
                          <div className="font-semibold text-gray-900">رصيد النقاط: {userPoints.balance.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">
                            استخدم النقاط لتوليد محتوى احترافي بالذكاء الاصطناعي
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                      >
                        شراء نقاط
                      </button>
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
                  <Coins className="w-5 h-5 text-yellow-500" />
                  تكاليف الخدمات بالنقاط
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      توليد وصف بسيط
                    </span>
                    <span className="font-semibold">{SERVICE_COSTS.AI_DESCRIPTION} نقطة</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      توليد وصف متقدم
                    </span>
                    <span className="font-semibold">{SERVICE_COSTS.AI_DESCRIPTION_ADVANCED} نقطة</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-purple-500" />
                      تحليل كلمات مفتاحية
                    </span>
                    <span className="font-semibold">{SERVICE_COSTS.KEYWORD_RESEARCH} نقطة</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-orange-500" />
                      تحليل SEO
                    </span>
                    <span className="font-semibold">{SERVICE_COSTS.SEO_OPTIMIZATION} نقطة</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="flex items-center gap-2 font-semibold text-blue-700">
                      <Sparkles className="w-4 h-4" />
                      التوليد الذكي الشامل
                    </span>
                    <span className="font-bold text-blue-700">{SERVICE_COSTS.BULK_OPTIMIZATION} نقطة</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(product, null, 2), "بيانات المنتج", "product_json")}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ البيانات كـ JSON
                  </button>
                  
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2 justify-center"
                  >
                    <Coins className="w-4 h-4" />
                    شراء نقاط إضافية
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
            if (generating || e.target !== e.currentTarget) return;
            setShowGenerateModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <h2 className="text-xl font-bold">التوليد الذكي</h2>
                  <p className="text-blue-100 text-sm mt-1">إنشاء محتوى احترافي بنقرة واحدة</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm leading-relaxed">
                  سيساعدك التوليد الذكي على إنشاء وتحسين كل محتوى منتجك بنقرة واحدة، سنستخدم اسم المنتج والمعلومات المتوفرة، لا تنسى مراجعة المحتوى قبل النسخ أو النشر.
                </p>
              </div>

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

              {/* عرض التكلفة */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-800 font-semibold">تكلفة الخدمة:</span>
                  <span className="text-yellow-900 font-bold text-lg">{SERVICE_COSTS.BULK_OPTIMIZATION} نقطة</span>
                </div>
              </div>
            </div>

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
                    إنشاء المحتوى ({SERVICE_COSTS.BULK_OPTIMIZATION} نقطة)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة شراء النقاط */}
      <PurchasePointsModal
        show={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        userPoints={userPoints}
        onSuccess={loadUserPoints}
      />
    </>
  );
}