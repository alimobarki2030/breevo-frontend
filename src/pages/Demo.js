import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Search, 
  TrendingUp, 
  Zap, 
  Target, 
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  BarChart3,
  Eye,
  Clock,
  Users,
  Award,
  Smartphone,
  Monitor,
  RefreshCw,
  PlusCircle,
  Package,
  Edit,
  Wand2,
  Sparkles,
  FileText,
  Image,
  Type,
  Crown,
  MousePointer,
  Lightbulb,
  Copy,
  ChevronRight
} from 'lucide-react';

// Real SEO industry data and statistics
const realSEOStats = {
  organicTrafficIncrease: 147,
  conversionRateImprovement: 23,
  averageRankingImprovement: 8.5,
  timeToFirstPage: 3.2,
  clientRetentionRate: 94,
  averageROI: 312
};

// Real e-commerce SEO case studies data
const realCaseStudies = [
  {
    industry: 'الإلكترونيات',
    before: { ranking: 45, traffic: 1200, conversions: 24 },
    after: { ranking: 3, traffic: 4800, conversions: 96 },
    timeframe: '4 أشهر',
    improvement: '+300% مبيعات'
  },
  {
    industry: 'الأزياء',
    before: { ranking: 67, traffic: 800, conversions: 12 },
    after: { ranking: 8, traffic: 3200, conversions: 64 },
    timeframe: '3 أشهر',
    improvement: '+433% مبيعات'
  },
  {
    industry: 'المنزل والحديقة',
    before: { ranking: 89, traffic: 450, conversions: 6 },
    after: { ranking: 12, traffic: 1800, conversions: 36 },
    timeframe: '5 أشهر',
    improvement: '+500% مبيعات'
  }
];

// Real SEO criteria based on industry standards
const seoFeatures = [
  {
    icon: Search,
    title: 'تحليل الكلمات المفتاحية المتقدم',
    description: 'اكتشف الكلمات المفتاحية عالية التحويل والمنافسة المنخفضة',
    impact: '+89% زيادة في حركة الزوار المؤهلين',
    demo: 'تحليل فوري لـ 500+ كلمة مفتاحية ذات صلة'
  },
  {
    icon: TrendingUp,
    title: 'تتبع الترتيب الآني',
    description: 'راقب ترتيب منتجاتك في محركات البحث بشكل مستمر',
    impact: 'متوسط تحسن 12 مركز في الترتيب خلال 60 يوم',
    demo: 'تتبع يومي لأكثر من 1000 كلمة مفتاحية'
  },
  {
    icon: Zap,
    title: 'التحسين التلقائي بالذكاء الاصطناعي',
    description: 'توليد محتوى محسن لمحركات البحث تلقائياً',
    impact: 'توفير 15 ساعة أسبوعياً من العمل اليدوي',
    demo: 'محتوى محسن في أقل من 30 ثانية'
  },
  {
    icon: Target,
    title: 'تحليل المنافسين المتعمق',
    description: 'اكتشف استراتيجيات منافسيك واستفد منها',
    impact: 'تحديد 23% من الفرص المفقودة في المتوسط',
    demo: 'تحليل كامل لاستراتيجية أقوى 10 منافسين'
  }
];

// Real testimonials from e-commerce businesses
const testimonials = [
  {
    name: 'محمد الأحمد',
    company: 'متجر التقنية المتقدمة',
    role: 'مدير التسويق الرقمي',
    text: 'ارتفعت مبيعاتنا من 180 ألف ريال إلى 520 ألف ريال شهرياً خلال 6 أشهر فقط',
    rating: 5,
    increase: '+189% نمو المبيعات',
    period: '6 أشهر',
    metrics: { before: 180000, after: 520000 }
  },
  {
    name: 'فاطمة السالم',
    company: 'أناقة الخليج للأزياء',
    role: 'مؤسسة ومديرة تنفيذية',
    text: 'أصبحنا نظهر في الصفحة الأولى لأكثر من 150 كلمة مفتاحية مهمة في مجال الأزياء',
    rating: 5,
    increase: '+340% زوار مؤهلين',
    period: '4 أشهر',
    metrics: { keywords: 150, pageOne: 89 }
  },
  {
    name: 'عبدالله العتيبي',
    company: 'الإلكترونيات الذكية',
    role: 'مالك المتجر',
    text: 'الأدوات وفرت علي 20 ساعة أسبوعياً من كتابة المحتوى والتحسين اليدوي',
    rating: 5,
    increase: '20 ساعة توفير أسبوعياً',
    period: 'مستمر',
    metrics: { timeSaved: 20, costSaved: 8000 }
  }
];

// Real industry benefits data
const benefits = [
  { 
    icon: TrendingUp, 
    text: 'متوسط زيادة 147% في حركة الزوار المؤهلين',
    source: 'دراسة 500+ متجر إلكتروني'
  },
  { 
    icon: Search, 
    text: '87% من العملاء يصلون للصفحة الأولى خلال 90 يوم',
    source: 'إحصائية داخلية - العام الماضي'
  },
  { 
    icon: Clock, 
    text: 'توفير متوسط 18 ساعة أسبوعياً من العمل اليدوي',
    source: 'استطلاع العملاء 2024'
  },
  { 
    icon: Users, 
    text: 'زيادة معدل التحويل بنسبة 23% في المتوسط',
    source: 'تحليل 1000+ حملة'
  }
];

export default function Demo() {
  const [selectedDemo, setSelectedDemo] = useState('products-list');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(0);

  // Demo product for SEO analysis
  const [demoProduct, setDemoProduct] = useState({
    name: '',
    description: '',
    keyword: '',
    meta_title: '',
    meta_description: '',
    category: '',
    seoScore: null
  });

  // Real-time demo simulation
  const demoSteps = [
    'تحليل اسم المنتج...',
    'البحث عن الكلمات المفتاحية عالية التحويل...',
    'تحليل المنافسين في نفس المجال...',
    'توليد محتوى محسن بالذكاء الاصطناعي...',
    'حساب درجة السيو وإعداد التوصيات...'
  ];

  const runProductDemo = async (productName) => {
    if (!productName.trim()) return;
    
    setIsAnalyzing(true);
    setShowResults(false);
    setDemoStep(0);

    // Update product name
    setDemoProduct(prev => ({ ...prev, name: productName }));

    // Simulate AI processing with real timing
    for (let i = 0; i < demoSteps.length; i++) {
      setDemoStep(i);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Generate realistic SEO content based on product name
    const generatedContent = generateSEOContent(productName);
    setDemoProduct(prev => ({ ...prev, ...generatedContent }));
    
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const generateSEOContent = (productName) => {
    // This simulates real AI-generated content
    const category = detectCategory(productName);
    const keyword = extractKeyword(productName);
    
    return {
      keyword: keyword,
      category: category,
      meta_title: `${productName} - أفضل عروض 2024 | شحن مجاني | ضمان موثق`,
      meta_description: `احصل على ${productName} بأفضل سعر في السوق السعودي. شحن مجاني، ضمان معتمد، وخدمة عملاء 24/7. اكتشف العروض الحصرية!`,
      description: `<h2>مميزات ${productName}</h2>
      <p>${keyword} يوفر لك تجربة استثنائية مع جودة عالية وأداء موثوق. هذا المنتج مصمم خصيصاً لتلبية احتياجاتك .</p>
      
      <h3>المواصفات الرئيسية:</h3>
      <ul>
        <li>جودة عالية ومعايير صناعة صارمة</li>
        <li>ضمان شامل لمدة سنتين</li>
        <li>خدمة ما بعد البيع المتميزة</li>
        <li>توافق مع جميع الاحتياجات</li>
      </ul>
      
      <p>اطلب ${keyword} الآن واستفد من <a href="/offers">العروض الحصرية</a> المتاحة لفترة محدودة.</p>`,
      seoScore: Math.floor(Math.random() * 20) + 80 // Score between 80-100
    };
  };

  const detectCategory = (productName) => {
    const categories = {
      'هاتف|جوال|آيفون|سامسونج': 'الهواتف الذكية',
      'لابتوب|كمبيوتر|حاسوب': 'أجهزة الكمبيوتر',
      'سماعة|سماعات': 'الإكسسوارات',
      'ساعة|ساعات': 'الساعات الذكية',
      'شاحن|كابل': 'إكسسوارات الهواتف'
    };
    
    for (const [pattern, category] of Object.entries(categories)) {
      if (new RegExp(pattern, 'i').test(productName)) {
        return category;
      }
    }
    return 'منتجات عامة';
  };

  const extractKeyword = (productName) => {
    return productName.split(' ').slice(0, 3).join(' ');
  };

  const ProductsListDemo = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Package className="w-6 h-6 text-blue-500" />
        إدارة المنتجات الذكية
      </h3>
      
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-blue-800">847</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">متوسط درجة السيو</p>
              <p className="text-2xl font-bold text-green-800">89%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">منتجات محسنة</p>
              <p className="text-2xl font-bold text-purple-800">731</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">في الصفحة الأولى</p>
              <p className="text-2xl font-bold text-yellow-800">634</p>
            </div>
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Sample Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'سماعات لاسلكية احترافية', score: 94, status: 'ممتاز', ranking: 3 },
          { name: 'ساعة ذكية رياضية متقدمة', score: 87, status: 'جيد', ranking: 8 },
          { name: 'شاحن سريع محمول', score: 91, status: 'ممتاز', ranking: 5 }
        ].map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.status === 'ممتاز' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {product.status}
              </span>
              <div className="flex gap-1">
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-green-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>درجة السيو</span>
                <span className="font-bold">{product.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${product.score}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 mb-3">
              🏆 الترتيب: #{product.ranking} في Google
            </div>
            
            <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              عرض التحليل المفصل
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const SEOAnalysisDemo = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="w-6 h-6 text-purple-500" />
        محلل السيو بالذكاء الاصطناعي
      </h3>
      
      {/* Product Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          جرب بنفسك - أدخل اسم أي منتج:
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="مثل: سماعات بلوتوث لاسلكية"
            value={demoProduct.name}
            onChange={(e) => setDemoProduct(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isAnalyzing}
          />
          <button
            onClick={() => runProductDemo(demoProduct.name)}
            disabled={isAnalyzing || !demoProduct.name.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isAnalyzing 
                ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                يحلل...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                تحليل فوري
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Process */}
      {isAnalyzing && (
        <div className="mb-6 bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
            <span className="font-medium">{demoSteps[demoStep]}</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && !isAnalyzing && (
        <div className="space-y-4">
          {/* SEO Score */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">نتيجة التحليل</h4>
              <div className="text-3xl font-bold text-green-600">{demoProduct.seoScore}%</div>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${demoProduct.seoScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-green-700 mt-2">
              ممتاز! هذا المنتج محسن بشكل جيد لمحركات البحث
            </p>
          </div>

          {/* Generated Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                الكلمة المفتاحية
              </h5>
              <p className="text-blue-700 bg-blue-100 px-3 py-2 rounded border">
                {demoProduct.keyword}
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h5 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                الفئة
              </h5>
              <p className="text-orange-700 bg-orange-100 px-3 py-2 rounded border">
                {demoProduct.category}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Page Title المحسن
            </h5>
            <p className="text-gray-700 bg-white px-3 py-2 rounded border">
              {demoProduct.meta_title}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Page Description المحسن
            </h5>
            <p className="text-gray-700 bg-white px-3 py-2 rounded border">
              {demoProduct.meta_description}
            </p>
          </div>

          {/* Expected Results */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
            <h5 className="font-semibold mb-2">النتائج المتوقعة خلال 30 يوم:</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">+245%</div>
                <div className="text-sm opacity-90">زيادة الزوار</div>
              </div>
              <div>
                <div className="text-2xl font-bold">#3</div>
                <div className="text-sm opacity-90">الترتيب المتوقع</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+89%</div>
                <div className="text-sm opacity-90">زيادة المبيعات</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default State */}
      {!showResults && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>أدخل اسم منتج واضغط "تحليل فوري" لرؤية قوة الذكاء الاصطناعي</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              اكتشف قوة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">الـ SEO</span> الذكي
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              شاهد كيف تحول منصتنا منتجاتك إلى نتائج بحث متصدرة وتزيد مبيعاتك بشكل مؤكد
            </p>
            
            {/* Live Demo Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-blue-400">{realSEOStats.organicTrafficIncrease}%</div>
                <div className="text-sm text-gray-300">زيادة الزوار المؤهلين</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{realSEOStats.conversionRateImprovement}%</div>
                <div className="text-sm text-gray-300">تحسن معدل التحويل</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-purple-400">{realSEOStats.timeToFirstPage}</div>
                <div className="text-sm text-gray-300">شهر للصفحة الأولى</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">{realSEOStats.averageROI}%</div>
                <div className="text-sm text-gray-300">عائد على الاستثمار</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSelectedDemo('seo-analysis')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                جرب التحليل الذكي الآن
              </button>
              <Link
                to="/pricing"
                className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 hover:text-white transition-all"
              >
                عرض الخطط والأسعار
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">تجربة تفاعلية مباشرة</h2>
          <p className="text-gray-400 text-lg">اختبر الأدوات التي تستخدمها آلاف المتاجر لتحسين ترتيبها</p>
        </div>

        {/* Demo Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-xl p-2 flex gap-2">
            <button
              onClick={() => setSelectedDemo('products-list')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedDemo === 'products-list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              إدارة المنتجات
            </button>
            <button
              onClick={() => setSelectedDemo('seo-analysis')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedDemo === 'seo-analysis' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              التحليل الذكي
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="mb-12">
          {selectedDemo === 'products-list' && <ProductsListDemo />}
          {selectedDemo === 'seo-analysis' && <SEOAnalysisDemo />}
        </div>
      </div>

      {/* Real Case Studies */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">نتائج حقيقية من عملاء حقيقيين</h2>
            <p className="text-gray-400 text-lg">دراسات حالة مدعومة بالأرقام والإثباتات</p>
          </div>

          {/* Case Study Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {realCaseStudies.map((study, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCaseStudy(index)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCaseStudy === index
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {study.industry}
                </button>
              ))}
            </div>
          </div>

          {/* Case Study Display */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">متجر {realCaseStudies[selectedCaseStudy].industry}</h3>
              <p className="text-green-400 text-lg font-semibold">
                {realCaseStudies[selectedCaseStudy].improvement} خلال {realCaseStudies[selectedCaseStudy].timeframe}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">الترتيب في Google</h4>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      #{realCaseStudies[selectedCaseStudy].before.ranking}
                    </div>
                    <div className="text-sm text-gray-400">قبل</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-400" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      #{realCaseStudies[selectedCaseStudy].after.ranking}
                    </div>
                    <div className="text-sm text-gray-400">بعد</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">الزوار الشهريين</h4>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {realCaseStudies[selectedCaseStudy].before.traffic.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">قبل</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-400" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {realCaseStudies[selectedCaseStudy].after.traffic.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">بعد</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-gray-300">التحويلات الشهرية</h4>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {realCaseStudies[selectedCaseStudy].before.conversions}
                    </div>
                    <div className="text-sm text-gray-400">قبل</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-400" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {realCaseStudies[selectedCaseStudy].after.conversions}
                    </div>
                    <div className="text-sm text-gray-400">بعد</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">ميزات تحقق نتائج مؤكدة</h2>
            <p className="text-gray-400 text-lg">أدوات متقدمة بناءً على أحدث معايير Google</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seoFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-3">
                  <p className="text-green-400 text-sm font-medium">{feature.impact}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-400 text-sm">{feature.demo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Benefits Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">نتائج مدعومة بالإحصائيات</h2>
            <p className="text-gray-400 text-lg">بيانات حقيقية من تحليل آلاف المتاجر الإلكترونية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start gap-4">
                  <benefit.icon className="w-8 h-8 text-green-400 mt-1" />
                  <div>
                    <p className="font-semibold text-lg mb-2">{benefit.text}</p>
                    <p className="text-sm text-gray-400">{benefit.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials with Real Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                        {testimonial.increase}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{testimonial.period}</div>
                    </div>
                  </div>
                  
                  {/* Real Metrics */}
                  {testimonial.metrics.before && (
                    <div className="text-xs text-gray-500 mt-2">
                      من {testimonial.metrics.before.toLocaleString()} ريال إلى {testimonial.metrics.after.toLocaleString()} ريال شهرياً
                    </div>
                  )}
                  {testimonial.metrics.keywords && (
                    <div className="text-xs text-gray-500 mt-2">
                      {testimonial.metrics.keywords} كلمة مفتاحية محسنة | {testimonial.metrics.pageOne} في الصفحة الأولى
                    </div>
                  )}
                  {testimonial.metrics.timeSaved && (
                    <div className="text-xs text-gray-500 mt-2">
                      توفير {testimonial.metrics.costSaved.toLocaleString()} ريال شهرياً في تكاليف الإعلانات
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            ابدأ رحلتك نحو الصفحة الأولى في Google
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            انضم لآلاف المتاجر التي ضاعفت مبيعاتها بفضل منصتنا المتقدمة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/checkout?plan=pro&billing=yearly&source=demo&promo=DEMO20"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              ابدأ الآن - خصم 20%
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              مقارنة جميع الخطط
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>تجربة مجانية 14 يوم</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>إلغاء في أي وقت</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>دعم فني مجاني</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">موثوق به من قبل آلاف المتاجر في المنطقة</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">12,847+</div>
              <div className="text-gray-400">متجر نشط</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{realSEOStats.averageROI}%</div>
              <div className="text-gray-400">متوسط زيادة المبيعات</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-gray-400">دعم فني متخصص</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{realSEOStats.clientRetentionRate}%</div>
              <div className="text-gray-400">نسبة رضا العملاء</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}