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
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Link2,
  ImageIcon,
  Strikethrough,
  Highlighter,
  Code,
  Quote,
  Separator,
  Undo,
  Redo
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { generateProductSEO } from "../utils/generateProductSEO";
import analyzeSEO from "../analyzeSEO";
import React, { useState, useEffect, useCallback, useMemo } from "react";

// ✅ ENHANCED: Professional Rich Text Editor Component
const ProfessionalEditor = ({ value, onChange, placeholder }) => {
  const [showSource, setShowSource] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Calculate word and character counts
  useEffect(() => {
    if (value) {
      const textContent = value.replace(/<[^>]*>/g, '');
      setWordCount(textContent.split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(textContent.length);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [value]);

  const insertTag = (tag, hasClosing = true) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (hasClosing) {
      newText = value.substring(0, start) + 
                `<${tag}>${selectedText}</${tag}>` + 
                value.substring(end);
    } else {
      newText = value.substring(0, start) + 
                `<${tag}>` + 
                value.substring(end);
    }
    
    onChange(newText);
  };

  const insertList = (type) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const listTag = type === 'ul' ? 'ul' : 'ol';
    const listItem = '\n<li>عنصر القائمة</li>';
    
    const newText = value.substring(0, start) + 
                    `\n<${listTag}>${listItem}\n</${listTag}>\n` + 
                    value.substring(start);
    
    onChange(newText);
  };

  const insertLink = () => {
    const url = prompt('أدخل رابط الصفحة (مثل: /products/category):');
    const text = prompt('أدخل نص الرابط:');
    
    if (url && text) {
      const textarea = document.getElementById('content-editor');
      const start = textarea ? textarea.selectionStart : value.length;
      const linkHtml = `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
      
      const newText = value.substring(0, start) + linkHtml + value.substring(start);
      onChange(newText);
    }
  };

  const insertHeading = (level) => {
    const text = prompt(`أدخل نص العنوان H${level}:`);
    if (text) {
      const textarea = document.getElementById('content-editor');
      const start = textarea ? textarea.selectionStart : value.length;
      const headingHtml = `\n<h${level} class="font-bold text-gray-900 mb-2">${text}</h${level}>\n`;
      
      const newText = value.substring(0, start) + headingHtml + value.substring(start);
      onChange(newText);
    }
  };

  // ✅ Professional Toolbar
  const ToolbarButton = ({ onClick, icon, tooltip, isActive = false }) => (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-md transition-all duration-150 text-sm
        ${isActive 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
        hover:shadow-sm border border-transparent hover:border-gray-200
      `}
      title={tooltip}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
      
      {/* Professional Toolbar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300">
            <ToolbarButton
              onClick={() => insertTag('strong')}
              icon={<Bold className="w-4 h-4" />}
              tooltip="نص عريض <strong>"
            />
            <ToolbarButton
              onClick={() => insertTag('em')}
              icon={<Italic className="w-4 h-4" />}
              tooltip="نص مائل <em>"
            />
            <ToolbarButton
              onClick={() => insertTag('mark')}
              icon={<Highlighter className="w-4 h-4" />}
              tooltip="تمييز النص <mark>"
            />
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300">
            <ToolbarButton
              onClick={() => insertHeading(2)}
              icon={<span className="text-xs font-bold">H2</span>}
              tooltip="عنوان فرعي H2"
            />
            <ToolbarButton
              onClick={() => insertHeading(3)}
              icon={<span className="text-xs font-bold">H3</span>}
              tooltip="عنوان صغير H3"
            />
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300">
            <ToolbarButton
              onClick={() => insertList('ul')}
              icon={<List className="w-4 h-4" />}
              tooltip="قائمة نقطية <ul>"
            />
            <ToolbarButton
              onClick={() => insertList('ol')}
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="قائمة مرقمة <ol>"
            />
          </div>

          {/* Links & Media */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300">
            <ToolbarButton
              onClick={insertLink}
              icon={<Link2 className="w-4 h-4" />}
              tooltip="إدراج رابط داخلي"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => setShowSource(!showSource)}
              icon={<Code className="w-4 h-4" />}
              tooltip="عرض/إخفاء كود HTML"
              isActive={showSource}
            />
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        {showSource ? (
          // HTML Source View
          <div className="p-4">
            <div className="text-xs text-gray-600 mb-2 font-mono">عرض كود HTML:</div>
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-80 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ fontSize: '13px', lineHeight: '1.5' }}
            />
          </div>
        ) : (
          // WYSIWYG View
          <div className="p-4">
            <textarea
              id="content-editor"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "ابدأ كتابة وصف احترافي للمنتج...\n\nاستخدم الأدوات أعلاه لإضافة التنسيق والروابط الداخلية."}
              className="w-full h-80 p-4 border-0 resize-none focus:outline-none"
              style={{ 
                fontSize: '14px', 
                lineHeight: '1.7',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                color: '#374151'
              }}
            />
          </div>
        )}

        {/* Live Preview */}
        {!showSource && value && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="text-xs text-gray-600 mb-2">المعاينة المباشرة:</div>
            <div 
              className="prose prose-sm max-w-none"
              style={{ fontSize: '14px', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {wordCount} كلمة
          </span>
          <span>{charCount} حرف</span>
          {wordCount >= 100 && (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              طول مناسب للسيو
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            💡 استخدم H2، H3، القوائم والروابط الداخلية لأفضل سيو
          </div>
        </div>
      </div>
    </div>
  );
};

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

// ✅ ENHANCED: Utility functions
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

// ✅ ENHANCED: Core SEO Criteria Checker with Better Analysis
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

  // 6. Description length at least 100 words (optimal for e-commerce)
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

  // 9. Product specifications/size mentioned
  const hasSpecs = /\d+(مل|جرام|كيلو|لتر|سم|متر|قطعة|حبة|عبوة|ml|g|kg|l|cm|m|piece)/i.test(description) ||
                   /\d+(مل|جرام|كيلو|لتر|سم|متر|قطعة|حبة|عبوة|ml|g|kg|l|cm|m|piece)/i.test(title);
  criteria.push({
    id: 'product_specs',
    text: 'ذكر مواصفات المنتج (الحجم، الكمية، الأبعاد)',
    status: hasSpecs ? 'pass' : 'fail'
  });

  // 10. Call-to-action present
  const hasCTA = /(اشتري|اطلب|احصل|استفد|تسوق|اشتر|اضف للسلة|اطلب الآن)/i.test(description);
  criteria.push({
    id: 'call_to_action',
    text: 'وجود دعوة واضحة لاتخاذ إجراء (CTA)',
    status: hasCTA ? 'pass' : 'fail'
  });

  // 11. Structured content (headings)
  const hasHeadings = /<h[2-6][^>]*>/i.test(product.description || '');
  criteria.push({
    id: 'structured_content',
    text: 'استخدام عناوين فرعية منظمة (H2, H3)',
    status: hasHeadings ? 'pass' : 'fail'
  });

  // 12. Lists for better readability
  const hasLists = /<(ul|ol)[^>]*>/i.test(product.description || '');
  criteria.push({
    id: 'content_lists',
    text: 'استخدام قوائم منظمة للمميزات',
    status: hasLists ? 'pass' : 'fail'
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

// ✅ ENHANCED: Professional SEO Display Component
const ProfessionalSEODisplay = ({ analysis, product }) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

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

  const getScoreBadge = (score) => {
    if (score >= 85) return { color: 'bg-green-500', label: 'ممتاز' };
    if (score >= 70) return { color: 'bg-blue-500', label: 'جيد جداً' };
    if (score >= 50) return { color: 'bg-amber-500', label: 'يحتاج تحسين' };
    return { color: 'bg-red-500', label: 'ضعيف' };
  };

  const scoreBadge = getScoreBadge(coreResults.score);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header with Enhanced Score Display */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          تحليل السيو المتقدم
        </h2>
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(coreResults.score)}`}>
            {coreResults.score}%
          </div>
          <div className={`text-xs px-2 py-1 rounded-full text-white ${scoreBadge.color}`}>
            {scoreBadge.label}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar with Gradient */}
      <div className="relative w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${scoreBadge.color} relative`}
          style={{ width: `${coreResults.score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
          {coreResults.passedCount}/{coreResults.totalCount} معيار مكتمل
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{coreResults.criteria.filter(c => c.status === 'pass').length}</div>
          <div className="text-xs text-green-700">مكتمل</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{coreResults.criteria.filter(c => c.status === 'fail').length}</div>
          <div className="text-xs text-red-700">يحتاج عمل</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{Math.round((coreResults.passedCount / coreResults.totalCount) * 100)}</div>
          <div className="text-xs text-blue-700">اكتمال %</div>
        </div>
      </div>

      {/* Toggle for Detailed Analysis */}
      <button
        onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mb-4"
      >
        <span className="font-medium text-gray-800">عرض التحليل التفصيلي</span>
        {showDetailedAnalysis ? 
          <ChevronDown className="w-4 h-4 text-gray-600" /> : 
          <ChevronRight className="w-4 h-4 text-gray-600" />
        }
      </button>

      {/* Detailed Criteria */}
      {showDetailedAnalysis && (
        <div className="space-y-3 mb-6">
          {coreResults.criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-all hover:shadow-sm ${getStatusColor(criterion.status)}`}
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
      )}

      {/* Enhanced Score Interpretation */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
        <div className="text-sm font-medium text-blue-900 mb-2">
          {coreResults.score >= 85 && (
            <span className="flex items-center gap-2">
              🎉 ممتاز! المحتوى محسن بشكل مثالي لمحركات البحث
            </span>
          )}
          {coreResults.score >= 70 && coreResults.score < 85 && (
            <span className="flex items-center gap-2">
              👍 جيد جداً! بعض التحسينات البسيطة ستجعله مثالياً
            </span>
          )}
          {coreResults.score >= 50 && coreResults.score < 70 && (
            <span className="flex items-center gap-2">
              📈 يحتاج تحسين في عدة نقاط أساسية
            </span>
          )}
          {coreResults.score < 50 && (
            <span className="flex items-center gap-2">
              🚀 ابدأ بتطبيق المعايير الأساسية خطوة بخطوة
            </span>
          )}
        </div>
        
        {/* Next Steps */}
        <div className="text-xs text-blue-700">
          <strong>الخطوة التالية:</strong> 
          {coreResults.score < 50 && " ركز على إضافة الكلمة المفتاحية والوصف المطلوب"}
          {coreResults.score >= 50 && coreResults.score < 70 && " أضف روابط داخلية ومواصفات المنتج"}
          {coreResults.score >= 70 && coreResults.score < 85 && " حسّن التنسيق والهيكلة"}
          {coreResults.score >= 85 && " راجع المحتوى دورياً وحدثه"}
        </div>
      </div>
    </div>
  );
};

// ✅ ENHANCED: Professional AI Prompts
const generateProfessionalContent = {
  
  // Enhanced keyword generation
  keyword: (productName) => `أنت خبير SEO محترف متخصص في السوق السعودي. مهمتك اختيار الكلمة المفتاحية الأمثل.

المنتج: "${productName}"

معايير اختيار الكلمة المفتاحية المثلى:
✅ حجم بحث عالي في السعودية والخليج
✅ منافسة معقولة (ليس مشبع جداً)
✅ نية شراء واضحة من الباحثين
✅ صلة مباشرة 100% بالمنتج
✅ طول 2-4 كلمات (الأمثل لـ SEO)

أمثلة ناجحة:
- "جهاز قياس الضغط" ← "جهاز قياس ضغط الدم"
- "كريم للبشرة" ← "كريم مرطب للوجه"
- "ساعة رياضية" ← "ساعة ذكية رياضية"

أعد الكلمة المفتاحية الأمثل فقط (بدون اقتباس):`,

  // Enhanced comprehensive content generation
  comprehensive: (product, keyword, category, tone, targetAudience) => `أنت كاتب محتوى SEO محترف متخصص في السوق السعودي مع خبرة 10+ سنوات.

بيانات المنتج:
📦 الاسم: "${product.name}"
🎯 الكلمة المفتاحية: "${keyword}"
📂 الفئة: "${category}"
👥 الجمهور: "${targetAudience}"
🎭 النغمة: "${tone}"

مهمتك: إنشاء محتوى متكامل يحقق أفضل نتائج SEO ويحفز على الشراء.

معايير الجودة الإلزامية:
✅ الوصف 150+ كلمة (ليس أقل)
✅ يبدأ بالكلمة المفتاحية في أول 20 كلمة
✅ HTML منسق ومهيكل احترافياً
✅ رابط داخلي واحد على الأقل
✅ مواصفات واضحة (حجم، كمية، أبعاد)
✅ دعوة قوية لاتخاذ إجراء
✅ عناوين فرعية منظمة
✅ قوائم للمميزات الرئيسية

هيكل المحتوى المطلوب:
1. فقرة افتتاحية تبدأ بالكلمة المفتاحية
2. قسم "المميزات الرئيسية" مع قائمة
3. قسم "المواصفات التقنية"
4. قسم "طريقة الاستخدام" (إن كان مناسباً)
5. فقرة ختامية مع دعوة للشراء

نموذج HTML مطلوب:
<p>كلمة مفتاحية في بداية الفقرة...</p>
<h3>المميزات الرئيسية</h3>
<ul><li>ميزة 1</li><li>ميزة 2</li></ul>
<h3>المواصفات</h3>
<p>تفاصيل المواصفات مع أرقام...</p>
<p>فقرة ختامية مع <a href="/products">رابط داخلي</a> ودعوة للشراء.</p>

أعد JSON كامل:
{
  "name": "عنوان محسن بالكلمة المفتاحية (أقل من 70 حرف)",
  "description": "HTML مهيكل حسب المواصفات أعلاه",
  "keyword": "${keyword}",
  "meta_title": "عنوان SEO جذاب 50-60 حرف",
  "meta_description": "وصف ميتا مقنع 150-160 حرف",
  "url_path": "مسار-url-باللغة-الانجليزية",
  "imageAlt": "وصف صورة يحتوي الكلمة المفتاحية"
}`,

  // Enhanced individual field generation
  description: (product, keyword, tone) => `أنت كاتب محتوى SEO خبير. اكتب وصف HTML احترافي لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${keyword}
النغمة: ${tone}

متطلبات الوصف:
🎯 150+ كلمة (مهم جداً)
🏗️ HTML منسق: <h3>، <p>، <ul>، <li>
🔗 رابط داخلي واحد على الأقل
📏 مواصفات المنتج (أرقام، أحجام)
🛒 دعوة واضحة للشراء
🔍 يبدأ بالكلمة المفتاحية

هيكل مطلوب:
<p>الكلمة المفتاحية في بداية الوصف...</p>
<h3>المميزات الرئيسية</h3>
<ul><li>ميزة 1</li><li>ميزة 2</li></ul>
<h3>المواصفات</h3>
<p>تفاصيل تقنية...</p>
<p>دعوة للشراء مع <a href="/category">رابط</a></p>

أعد HTML فقط:`,

  metaTitle: (productName, keyword) => `أنشئ Page Title مثالي لمحركات البحث:

المنتج: ${productName}
الكلمة المفتاحية: ${keyword}

معايير العنوان:
✅ 50-60 حرف بالضبط
✅ يحتوي الكلمة المفتاحية
✅ جذاب للنقر (CTR عالي)
✅ يوضح الفائدة الأساسية
✅ مناسب للسوق السعودي

أمثلة ناجحة:
- "ساعة ذكية رياضية مقاومة للماء | اشتري الآن"
- "كريم مرطب للوجه الجاف | نتائج سريعة ومضمونة"

أعد العنوان فقط:`,

  metaDescription: (productName, keyword, benefits) => `اكتب Page Description محسن لمحركات البحث:

المنتج: ${productName}
الكلمة المفتاحية: ${keyword}

معايير الوصف:
✅ 150-160 حرف بالضبط
✅ يحتوي الكلمة المفتاحية
✅ يحفز على النقر والشراء
✅ يذكر فائدة أساسية
✅ يتضمن دعوة للعمل

نموذج: "اشتري [الكلمة المفتاحية] عالية الجودة. [فائدة رئيسية]. توصيل سريع وضمان شامل. اطلب الآن!"

أعد الوصف فقط:`,

  urlPath: (productName, keyword) => `أنشئ مسار URL محسن:

المنتج: ${productName}
الكلمة المفتاحية: ${keyword}

معايير المسار:
✅ باللغة الإنجليزية فقط
✅ كلمات مفصولة بـ (-)
✅ قصير وواضح
✅ يحتوي الكلمة المفتاحية المترجمة

أمثلة:
- "smart-sports-watch"
- "moisturizing-face-cream"
- "bluetooth-wireless-headphones"

أعد المسار فقط:`,

  imageAlt: (productName, keyword) => `أنشئ نص ALT احترافي:

المنتج: ${productName}
الكلمة المفتاحية: ${keyword}

معايير النص:
✅ وصف دقيق للصورة
✅ يحتوي الكلمة المفتاحية
✅ 8-12 كلمة
✅ مفيد للمكفوفين
✅ محسن لـ SEO

نموذج: "صورة [الكلمة المفتاحية] عالية الجودة مع المواصفات"

أعد النص فقط:`
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
    // Clean the value before setting
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
        keyword: cleanText(product.keyword) || "",
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

      toast.success("تم حفظ التعديلات بنجاح! 🎉");
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "حدث خطأ أثناء الحفظ في localStorage";
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

    setGenerating(true);
    setErrors(prev => ({ ...prev, analyze: null }));

    try {
      console.log('🔄 Starting enhanced product analysis...');

      // ✅ FIXED: Use the enhanced English prompt
      const keywordPrompt = `You are a professional SEO expert specializing in the Saudi Arabian market with 10+ years of experience.

TASK: Generate the optimal Arabic keyword for this product targeting Saudi users.

Product: "${product.name}"

CRITERIA for optimal keyword selection:
✅ High search volume in Saudi Arabia/Gulf region (1000+ monthly searches)
✅ Reasonable competition (not oversaturated)
✅ Clear purchase intent from searchers
✅ 100% direct relevance to the product
✅ 2-4 words length (optimal for SEO)
✅ Natural Arabic phrasing that Saudis actually use

PROVEN EXAMPLES:
- "Blood pressure monitor" → "جهاز قياس ضغط الدم"
- "Face moisturizer" → "كريم مرطب للوجه"
- "Smart sports watch" → "ساعة ذكية رياضية"
- "Wireless headphones" → "سماعات بلوتوث لاسلكية"

IMPORTANT: 
- Think like a Saudi consumer searching on Google
- Use terms they naturally type, not formal Arabic
- Consider regional variations and common misspellings
- Focus on commercial intent keywords

OUTPUT: Return ONLY the optimal Arabic keyword (no quotes, no explanations):`;

      const keyword = cleanText(await generateProductSEO(keywordPrompt));
      console.log('✅ Generated keyword:', keyword);

      // Simple category and audience analysis (fallback to basic if needed)
      const category = product.category || "عام";
      const targetAudience = product.target_audience || "عام";
      const tone = product.tone || "محايدة";
      const bestStoryArc = product.best_story_arc || "مشكلة-حل";

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
      
      // Enhanced error handling
      let errorMessage = "فشل في تحليل المنتج";
      if (error.message?.includes("401") || error.message?.includes("Failed to fetch")) {
        errorMessage = "فشل في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة لاحقاً أو الكتابة يدوياً.";
      } else if (error.message?.includes("network") || error.message?.includes("connection")) {
        errorMessage = "مشكلة في الاتصال بالإنترنت. تحقق من الاتصال وأعد المحاولة.";
      }
      
      setErrors(prev => ({ ...prev, analyze: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [product.name]);

  const handleGenerateAll = useCallback(async () => {
    if (!product.name?.trim()) {
      setErrors(prev => ({ ...prev, generate: "اسم المنتج مطلوب للتوليد" }));
      return;
    }

    setGenerating(true);
    setErrors(prev => ({ ...prev, generate: null }));

    try {
      console.log('🔄 Starting comprehensive professional generation...');

      // Ensure we have analysis data
      let analysisData = productAnalysis;
      if (!analysisData) {
        analysisData = {
          category: product.category || "عام",
          target_audience: product.target_audience || "عام",
          tone: product.tone || "محايدة",
          best_story_arc: product.best_story_arc || "مشكلة-حل"
        };
      }

      const keyword = cleanText(product.keyword) || "منتج";

      // ✅ FIXED: Use enhanced comprehensive prompt directly
      const prompt = `You are an elite SEO content writer specializing in the Saudi Arabian e-commerce market with proven track record of ranking #1 on Google.

PRODUCT DATA:
📦 Name: "${product.name}"
🎯 Target Keyword: "${keyword}"
📂 Category: "${analysisData.category}"
👥 Target Audience: "${analysisData.target_audience}"
🎭 Tone: "${analysisData.tone}"

MISSION: Create comprehensive Arabic content that ranks #1 on Google and converts browsers into buyers.

MANDATORY SEO REQUIREMENTS:
✅ Description: 100+ words minimum (optimal for e-commerce)
✅ Target keyword in first 25 words
✅ Professional HTML structure with semantic markup
✅ At least 1 internal link (crucial for SEO)
✅ Specific product specifications (size, weight, dimensions)
✅ Compelling call-to-action
✅ Structured headings (H2, H3)
✅ Bullet points for features
✅ Natural keyword distribution (1-2% density)

CONTENT STRUCTURE (mandatory):
1. Opening paragraph with target keyword in first sentence
2. "المميزات الرئيسية" section with bulleted list
3. "المواصفات التقنية" section with specific numbers
4. "طريقة الاستخدام" section (if applicable)
5. Closing paragraph with internal link and strong CTA

HTML TEMPLATE (follow exactly):
<p>[Target keyword] في بداية الجملة الأولى مع وصف مقنع...</p>
<h3>المميزات الرئيسية</h3>
<ul>
<li>ميزة محددة مع فائدة واضحة</li>
<li>ميزة ثانية مع أرقام إن أمكن</li>
<li>ميزة ثالثة تميز المنتج</li>
<li>ميزة رابعة تخاطب الجمهور المستهدف</li>
</ul>
<h3>المواصفات التقنية</h3>
<p>الأبعاد: [أرقام]، الوزن: [رقم]، الكمية: [رقم]، اللون: [لون]</p>
<h3>طريقة الاستخدام</h3>
<p>خطوات بسيطة وواضحة للاستخدام الأمثل</p>
<p>احصل على [Target keyword] بأفضل جودة وسعر. <a href="/products" class="text-blue-600 hover:text-blue-800 underline">تصفح المزيد من منتجاتنا</a> واطلب الآن مع ضمان الاستبدال خلال 14 يوم!</p>

WRITING GUIDELINES:
- Write for Saudi consumers (use their language style)
- Include emotional triggers and urgency
- Add trust signals (warranty, guarantee, fast delivery)
- Use action verbs and benefit-focused language
- Include social proof hints when relevant

OUTPUT: Return valid JSON only:
{
  "name": "Optimized Arabic product title with target keyword and size if applicable (max 70 chars)",
  "description": "Complete HTML content following above structure (100+ words)",
  "keyword": "${keyword}",
  "meta_title": "Compelling SEO title 50-60 chars with keyword, size if present, and benefit",
  "meta_description": "Persuasive meta description 140-160 chars with keyword and CTA",
  "url_path": "seo-friendly-english-url-slug",
  "imageAlt": "Descriptive alt text including target keyword (no word 'صورة')"
}`;

      console.log('📤 Sending enhanced generation request...');
      const generated = await generateProductSEO(prompt);
      console.log('📥 Received response:', generated.substring(0, 200) + '...');
      
      const jsonMatch = generated.match(/{[\s\S]*}/);
      
      if (!jsonMatch) {
        throw new Error("لم يتم العثور على JSON صالح في الإجابة");
      }

      const fields = JSON.parse(jsonMatch[0]);

      // Process and clean all generated fields
      const processedFields = {
        name: truncateText(fields.name, FIELD_LIMITS.name_limit),
        description: fields.description || "",
        meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
        meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
        keyword: cleanText(fields.keyword),
        url_path: cleanText(fields.url_path),
        imageAlt: cleanText(fields.imageAlt),
      };

      console.log('✅ Enhanced processed fields:', processedFields);

      setProduct(prev => ({
        ...prev,
        ...processedFields,
      }));

      toast.success("تم توليد جميع الحقول بنجاح! ✨🎉");

    } catch (error) {
      console.error("Error generating fields:", error);
      
      // Enhanced error handling
      let errorMessage = "فشل في توليد المحتوى";
      if (error.message?.includes("401") || error.message?.includes("Failed to fetch")) {
        errorMessage = "فشل في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة لاحقاً أو الكتابة يدوياً.";
      } else if (error.message?.includes("network") || error.message?.includes("connection")) {
        errorMessage = "مشكلة في الاتصال بالإنترنت. تحقق من الاتصال وأعد المحاولة.";
      } else if (error.message?.includes("JSON")) {
        errorMessage = "خطأ في معالجة الاستجابة. يرجى المحاولة مرة أخرى.";
      }
      
      setErrors(prev => ({ ...prev, generate: errorMessage }));
      toast.error("❌ " + errorMessage);
    } finally {
      setGenerating(false);
    }
  }, [product, productAnalysis]);

  const handleGenerateField = useCallback(async (fieldType) => {
    setFieldLoading(fieldType);
    setErrors(prev => ({ ...prev, [fieldType]: null }));

    try {
      console.log(`🔄 Generating enhanced field: ${fieldType}`);
      
      // ✅ FIXED: Use direct prompts instead of object reference
      let prompt = "";
      
      switch (fieldType) {
        case 'keyword':
          prompt = `You are a professional SEO expert specializing in the Saudi Arabian market with 10+ years of experience.

TASK: Generate the optimal Arabic keyword for this product targeting Saudi users.

Product: "${product.name}"

CRITERIA for optimal keyword selection:
✅ High search volume in Saudi Arabia/Gulf region (1000+ monthly searches)
✅ Reasonable competition (not oversaturated)
✅ Clear purchase intent from searchers
✅ 100% direct relevance to the product
✅ 2-4 words length (optimal for SEO)
✅ Natural Arabic phrasing that Saudis actually use

OUTPUT: Return ONLY the optimal Arabic keyword (no quotes, no explanations):`;
          break;

        case 'description':
          prompt = `You are an expert Arabic SEO content writer. Create professional HTML content for this product.

PRODUCT: ${product.name}
TARGET KEYWORD: ${cleanText(product.keyword) || 'منتج'}
TONE: ${product.tone || 'محايدة'}

STRICT REQUIREMENTS:
🎯 100+ words minimum (optimal for e-commerce conversion)
🏗️ Semantic HTML: <h3>, <p>, <ul>, <li>
🔗 At least 1 internal link with proper anchor text
📏 Specific product specifications (numbers, sizes, measurements)
🛒 Strong call-to-action at the end
🔍 Target keyword in opening sentence

CONTENT STRUCTURE:
<p>[TARGET KEYWORD] in first sentence with compelling description...</p>
<h3>المميزات الرئيسية</h3>
<ul><li>Feature 1 with specific benefit</li><li>Feature 2 with numbers if possible</li></ul>
<h3>المواصفات التقنية</h3>
<p>Detailed specs with exact measurements...</p>
<p>Compelling closing with <a href="/related-category">internal link</a> and strong CTA</p>

OUTPUT: Return ONLY the HTML content (no explanations):`;
          break;

        case 'meta_title':
          prompt = `You are a Google Ads specialist creating the perfect meta title for Saudi market.

PRODUCT: ${product.name}
TARGET KEYWORD: ${cleanText(product.keyword) || 'منتج'}

OPTIMIZATION CRITERIA:
✅ Exactly 50-60 characters (strict limit)
✅ Include target keyword naturally
✅ MUST include product size/quantity if present in product name (50مل، 250جرام، etc.)
✅ High click-through rate potential
✅ Show primary benefit or USP
✅ Appeal to Saudi consumers

EXAMPLES WITH SIZES:
- "كريم مرطب للوجه الجاف 50مل | نتائج مضمونة"
- "شامبو للشعر التالف 250مل | قوة وحيوية طبيعية"

OUTPUT: Return ONLY the optimized Arabic title:`;
          break;

        case 'meta_description':
          prompt = `You are a conversion copywriter creating meta descriptions that drive clicks and sales.

PRODUCT: ${product.name}
TARGET KEYWORD: ${cleanText(product.keyword) || 'منتج'}

OPTIMIZATION REQUIREMENTS:
✅ Exactly 140-160 characters (Google's sweet spot)
✅ Include target keyword naturally in first half
✅ Clear value proposition or main benefit
✅ Create urgency or desire
✅ Include call-to-action
✅ Appeal to Saudi market preferences

OUTPUT: Return ONLY the optimized Arabic meta description:`;
          break;

        case 'url_path':
          prompt = `You are a technical SEO expert creating URL slugs for maximum ranking potential.

PRODUCT: ${product.name}
TARGET KEYWORD: ${cleanText(product.keyword) || 'منتج'}

SEO-OPTIMIZED URL REQUIREMENTS:
✅ English only (for technical compatibility)
✅ Words separated by hyphens (-)
✅ Include main keyword translated to English
✅ 3-5 words maximum (concise but descriptive)

EXAMPLES:
- "جهاز قياس ضغط الدم" → "blood-pressure-monitor"
- "كريم مرطب للوجه" → "face-moisturizing-cream"

OUTPUT: Return ONLY the URL slug (no explanations):`;
          break;

        case 'imageAlt':
          prompt = `You are an accessibility and SEO expert creating image alt text.

PRODUCT: ${product.name}
TARGET KEYWORD: ${cleanText(product.keyword) || 'منتج'}

ALT TEXT OPTIMIZATION CRITERIA:
✅ Include target keyword naturally
✅ Describe what's actually visible in the image
✅ 8-15 words (optimal length)
✅ Helpful for visually impaired users
✅ Never use the word "صورة" explicitly

OUTPUT: Return ONLY the optimized Arabic alt text:`;
          break;

        default:
          throw new Error(`لا يوجد برومبت للحقل: ${fieldType}`);
      }

      const response = await generateProductSEO(prompt);
      let value = cleanText(response);

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
      
      // Enhanced error handling  
      let errorMessage = `فشل في توليد ${fieldType}`;
      if (error.message?.includes("401") || error.message?.includes("Failed to fetch")) {
        errorMessage = "فشل في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة لاحقاً أو الكتابة يدوياً.";
      } else if (error.message?.includes("network") || error.message?.includes("connection")) {
        errorMessage = "مشكلة في الاتصال بالإنترنت. تحقق من الاتصال وأعد المحاولة.";
      }
      
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
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded font-medium">Professional Editor</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerateField(key)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isLoading 
                    ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                }`}
                disabled={isLoading}
                title="توليد محتوى احترافي"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    توليد احترافي
                  </>
                )}
              </button>
              {fieldValue && (
                <button
                  onClick={() => copyToClipboard(fieldValue, label)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="نسخ"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <ProfessionalEditor
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
              <span className={`text-xs px-2 py-1 rounded ${isOverLimit ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'}`}>
                {charCount}{charLimit && `/${charLimit}`}
              </span>
            )}
            <button
              onClick={() => handleGenerateField(key)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
                isLoading 
                  ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              }`}
              disabled={isLoading}
              title="توليد احترافي"
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
            {fieldValue && (
              <button
                onClick={() => copyToClipboard(fieldValue, label)}
                className="px-2 py-2 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
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
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 resize-y min-h-[120px] transition-colors text-sm ${
              hasError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            style={{ fontSize: '14px', lineHeight: '1.6' }}
            rows={4}
          />
        ) : (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleProductChange(key, e.target.value)}
            placeholder={placeholder}
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 transition-colors text-sm ${
              hasError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            style={{ fontSize: '14px', lineHeight: '1.6' }}
          />
        )}
        
        {hasError && (
          <div className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {hasError}
          </div>
        )}

        {/* Enhanced Field-specific hints */}
        {key === 'meta_title' && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg mt-2">
            💡 <strong>Page Title المثالي:</strong> 50-60 حرف، يحتوي الكلمة المفتاحية، جذاب للنقر، يوضح الفائدة
          </div>
        )}
        {key === 'meta_description' && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg mt-2">
            💡 <strong>Page Description المثالي:</strong> 150-160 حرف، يحتوي الكلمة المفتاحية، يحفز على الزيارة، دعوة للعمل
          </div>
        )}
        {key === 'keyword' && (
          <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded-lg mt-2">
            💡 <strong>الكلمة المفتاحية المثلى:</strong> حجم بحث عالي، منافسة معقولة، نية شراء، 2-4 كلمات
          </div>
        )}
        {key === 'url_path' && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
            ⚠️ <strong>تنبيه:</strong> إذا كان الموقع مفهرس مسبقاً، لا تعدل هذا الحقل حيث قد يؤثر على الفهرسة
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
          
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-4">
              <Link 
                to="/products" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للمنتجات
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 تحليل وتحسين السيو المتقدم
              </h1>
              {hasUnsavedChanges && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs rounded-full border border-yellow-200 font-medium">
                  📝 تغييرات غير محفوظة
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'إخفاء المعاينة' : 'معاينة Google'}
              </button>
            </div>
          </div>

          {/* Enhanced Error Display */}
          {(errors.save || errors.generate || errors.analyze) && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">خطأ:</span>
                <span>{errors.save || errors.generate || errors.analyze}</span>
              </div>
              {(errors.generate || errors.analyze) && (
                <div className="mt-2 text-xs text-red-600">
                  💡 <strong>اقتراح:</strong> تأكد من اتصال الإنترنت وأعد المحاولة. إذا استمر الخطأ، يمكنك الكتابة يدوياً أو الانتظار قليلاً ثم المحاولة مرة أخرى.
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Enhanced Product Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    معلومات المنتج
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={handleGenerateAll}
                      disabled={generating}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        generating 
                          ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                          : "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl"
                      }`}
                      title="توليد شامل بالذكاء الاصطناعي"
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-600 border-t-transparent"></div>
                          جاري التوليد الشامل...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          🤖 توليد شامل بالذكاء الاصطناعي
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !hasUnsavedChanges}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        saving 
                          ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                          : hasUnsavedChanges
                            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl" 
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
                          💾 حفظ التغييرات
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Enhanced Last Updated */}
                {product.lastUpdated && (
                  <div className="text-xs text-gray-500 mb-4 flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-lg">
                    <RefreshCw className="w-3 h-3" />
                    آخر تحديث: {formatDate(product.lastUpdated)}
                  </div>
                )}

                {/* Enhanced Product Analysis Section */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      🎯 تحليل المنتج والجمهور المتقدم
                    </h3>
                    <button
                      onClick={handleAnalyzeProduct}
                      disabled={generating}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${
                        generating 
                          ? "bg-yellow-100 text-yellow-700 cursor-not-allowed" 
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border border-yellow-600 border-t-transparent"></div>
                          تحليل...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          🧠 تحليل ذكي
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                        📦 فئة المنتج
                      </label>
                      <input
                        type="text"
                        value={product.category || ""}
                        onChange={(e) => handleProductChange('category', e.target.value)}
                        placeholder="مثل: إلكترونيات، ملابس، منزل..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                        🎯 الجمهور المستهدف
                      </label>
                      <input
                        type="text"
                        value={product.target_audience || ""}
                        onChange={(e) => handleProductChange('target_audience', e.target.value)}
                        placeholder="مثل: الشباب، العائلات، المهنيين..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                        🎭 النغمة التسويقية
                      </label>
                      <select
                        value={product.tone || ""}
                        onChange={(e) => handleProductChange('tone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                      >
                        {TONE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                        📖 الحبكة التسويقية
                      </label>
                      <select
                        value={product.best_story_arc || ""}
                        onChange={(e) => handleProductChange('best_story_arc', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
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
                    🔍 معاينة نتائج Google المتقدمة
                  </h3>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-blue-500">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer font-medium mb-1">
                      {product.meta_title || product.name || "عنوان المنتج"}
                    </div>
                    <div className="text-green-600 text-sm mb-2 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      https://example.com/{product.url_path || "product"}
                    </div>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {product.meta_description || "وصف المنتج سيظهر هنا..."}
                    </div>
                    
                    {/* Preview Stats */}
                    <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-4">
                      <span>📏 طول العنوان: {(product.meta_title || product.name || "").length}/60</span>
                      <span>📝 طول الوصف: {(product.meta_description || "").length}/160</span>
                      {progress >= 70 && <span className="text-green-600">✅ محسن للسيو</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced SEO Fields */}
              <div className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Type className="w-5 h-5 text-blue-500" />
                    📝 المعلومات الأساسية
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

                {/* Enhanced Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-green-500" />
                    ✍️ وصف المنتج التفصيلي
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
                    🌐 Page Title & Description
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
                    ⚙️ السيو التقني
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

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              
              {/* Enhanced SEO Score */}
              <ProfessionalSEODisplay analysis={score} product={product} />

              {/* Enhanced Quick Tips */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  💡 نصائح احترافية متقدمة
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="text-blue-500 mt-0.5">🎯</div>
                    <div>
                      <strong>الكلمة المفتاحية:</strong> اختر كلمة بحجم بحث 1000+ شهرياً في السعودية ومنافسة أقل من 50
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="text-green-500 mt-0.5">📊</div>
                    <div>
                      <strong>Page Title:</strong> ضع الكلمة المفتاحية في البداية + فائدة + دعوة للعمل
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                    <div className="text-purple-500 mt-0.5">✍️</div>
                    <div>
                      <strong>الوصف الاحترافي:</strong> 100+ كلمة مع H2, H3, قوائم نقطية، وروابط داخلية لبنية أفضل
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                    <div className="text-orange-500 mt-0.5">📏</div>
                    <div>
                      <strong>مواصفات المنتج:</strong> اذكر أرقام دقيقة (50مل، 250جرام، 30×20سم) لبناء الثقة
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                    <div className="text-red-500 mt-0.5">🛒</div>
                    <div>
                      <strong>دعوة متقدمة للعمل:</strong> "اطلب الآن واحصل على توصيل مجاني" أقوى من "اشتر الآن"
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100">
                    <div className="text-gray-500 mt-0.5">🔗</div>
                    <div>
                      <strong>الروابط الداخلية:</strong> أضف 1-2 رابط لصفحات ذات صلة مثل "/products/category" أو "/reviews"
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                    <div className="text-teal-500 mt-0.5">🏗️</div>
                    <div>
                      <strong>البنية المتقدمة:</strong> استخدم عناوين H2 للأقسام الرئيسية و H3 للتفاصيل الفرعية
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  📈 ملخص التقدم المتقدم
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">النقاط الإجمالية</span>
                    <span className={`text-xl font-bold ${getScoreColor(progress)}`}>
                      {progress}%
                    </span>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${
                        progress >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                        progress >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                        progress >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    {progress >= 85 && "🎉 ممتاز! جاهز للنشر"}
                    {progress >= 70 && progress < 85 && "👍 جيد جداً! بعض التحسينات البسيطة"}
                    {progress >= 50 && progress < 70 && "📈 يحتاج تحسين في عدة نقاط"}
                    {progress < 50 && "🚀 ابدأ التحسين خطوة بخطوة"}
                  </div>
                  
                  {/* Quick Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-3">إجراءات سريعة:</div>
                    
                    {progress < 50 && (
                      <button
                        onClick={() => handleGenerateField('keyword')}
                        className="w-full px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all text-sm flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        ابدأ بتوليد الكلمة المفتاحية
                      </button>
                    )}
                    
                    {progress >= 50 && progress < 70 && (
                      <button
                        onClick={() => handleGenerateField('description')}
                        className="w-full px-3 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-lg hover:from-green-200 hover:to-blue-200 transition-all text-sm flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        حسّن وصف المنتج
                      </button>
                    )}
                    
                    {progress >= 70 && progress < 85 && (
                      <button
                        onClick={() => handleGenerateField('meta_title')}
                        className="w-full px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all text-sm flex items-center gap-2"
                      >
                        <Type className="w-4 h-4" />
                        اصقل عناوين السيو
                      </button>
                    )}
                    
                    {progress >= 85 && (
                      <div className="w-full px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        🎉 مثالي! جاهز للنشر
                      </div>
                    )}
                  </div>
                  
                  {/* Core Field Completion Status */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-700 mb-3">حالة إكمال المعايير:</div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {[
                        { key: 'keyword', label: 'الكلمة المفتاحية', check: () => !!product.keyword },
                        { key: 'title_keyword', label: 'عنوان يحتوي الكلمة المفتاحية', check: () => product.keyword && product.name?.toLowerCase().includes(product.keyword.toLowerCase()) },
                        { key: 'description_length', label: 'وصف 100+ كلمة', check: () => {
                          const words = (product.description || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0);
                          return words.length >= 100;
                        }},
                        { key: 'meta_title', label: 'Page Title محسن', check: () => !!product.meta_title },
                        { key: 'meta_description', label: 'Page Description', check: () => !!product.meta_description },
                        { key: 'image_alt', label: 'Image Alt Text', check: () => !!product.imageAlt },
                        { key: 'internal_links', label: 'روابط داخلية', check: () => /<a\s+[^>]*href=[^>]*>/i.test(product.description || '') },
                        { key: 'structured_content', label: 'محتوى منظم', check: () => /<h[2-6][^>]*>/i.test(product.description || '') }
                      ].map(field => {
                        const isComplete = field.check();
                        
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  🚀 إجراءات متقدمة
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(product, null, 2), "بيانات المنتج")}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all flex items-center gap-2 justify-center"
                  >
                    <Copy className="w-4 h-4" />
                    📋 نسخ البيانات كـ JSON
                  </button>
                  
                  <button
                    onClick={() => {
                      const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${product.meta_title || product.name}</title>
    <meta name="description" content="${product.meta_description || ''}">
    <meta name="keywords" content="${product.keyword || ''}">
</head>
<body>
    <h1>${product.name}</h1>
    <div>${product.description || ''}</div>
</body>
</html>`;
                      copyToClipboard(htmlContent, "كود HTML");
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all flex items-center gap-2 justify-center"
                  >
                    <Code className="w-4 h-4" />
                    🌐 تصدير كـ HTML
                  </button>
                  
                  <Link
                    to="/products"
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-lg hover:from-green-200 hover:to-blue-200 transition-all flex items-center gap-2 justify-center"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    ↩️ العودة للمنتجات
                  </Link>
                </div>
              </div>

              {/* Professional Tips */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-sm border border-indigo-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-indigo-500" />
                  👑 نصائح الخبراء
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/60 rounded-lg border border-indigo-100">
                    <div className="font-medium text-indigo-900 mb-1">🎯 استهداف الكلمات المفتاحية</div>
                    <div className="text-indigo-700 text-xs">استخدم أدوات مثل Google Keyword Planner للعثور على كلمات بحجم بحث 1000+ شهرياً ومنافسة أقل من 50%</div>
                  </div>
                  
                  <div className="p-3 bg-white/60 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-900 mb-1">📊 تحليل المنافسين</div>
                    <div className="text-purple-700 text-xs">ادرس أفضل 3 منافسين في نتائج البحث وحسّن محتواك ليكون أشمل وأكثر فائدة</div>
                  </div>
                  
                  <div className="p-3 bg-white/60 rounded-lg border border-pink-100">
                    <div className="font-medium text-pink-900 mb-1">🚀 تحسين معدل التحويل</div>
                    <div className="text-pink-700 text-xs">أضف عروض محدودة المدة، شهادات عملاء، وضمانات لزيادة الثقة ومعدل الشراء</div>
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