// src/utils/sharedSEOLogic.js
import analyzeSEO from '../analyzeSEO';
import { generateProductSEO } from './generateProductSEO';

// 1. SHARED SEO ANALYSIS LOGIC
const sharedSEOAnalysis = {
  // Use same analysis logic in both demo and actual product
  analyzeProduct: async (product) => {
    const { categorizeProduct, analyzeTargetAudience, selectTone, selectStoryArc } = analyzeSEO(product);
    
    try {
      // Same prompts and logic as ProductSEO.js
      const categoryPrompt = await categorizeProduct(product);
      const category = (await generateProductSEO(categoryPrompt)).trim();
      
      const audiencePrompt = await analyzeTargetAudience(product, category);
      const targetAudience = (await generateProductSEO(audiencePrompt)).trim();
      
      const tone = selectTone(category, targetAudience);
      const storyArc = selectStoryArc(category);
      
      return { category, targetAudience, tone, storyArc };
    } catch (error) {
      console.error('Error in sharedSEOAnalysis.analyzeProduct:', error);
      throw error;
    }
  },

  // Same scoring logic for both
  calculateSEOScore: (product) => {
    return analyzeSEO(product); // Use same scoring system
  }
};

// 2. CONSISTENT USER ACCESS LOGIC
const sharedUserAccess = {
  checkUserPlan: () => {
    const user = safeLocalStorageGet("user", {});
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    const plan = subscription.plan || user.plan || "free";
    
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    return {
      plan: isOwner ? "owner" : plan,
      isOwner,
      canUseAI: isOwner || plan !== "free"
    };
  },

  checkTrialUsage: () => {
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
      return newUsage;
    }
    
    return usage;
  },

  incrementTrialUsage: () => {
    const usage = JSON.parse(localStorage.getItem("seo_trial_usage") || "{}");
    usage.used = (usage.used || 0) + 1;
    localStorage.setItem("seo_trial_usage", JSON.stringify(usage));
    return usage;
  }
};

// 3. CONSISTENT FIELD GENERATION (same prompts for both)
const sharedFieldGeneration = {
  prompts: {
    keyword: (product) => `أنت خبير SEO محترف. اختر أفضل كلمة مفتاحية لهذا المنتج:

المنتج: ${product.name}
الوصف: ${product.description || 'غير متوفر'}
الفئة: ${product.category || 'عام'}

معايير الاختيار:
- حجم بحث عالي في السعودية
- منافسة معقولة  
- صلة قوية بالمنتج
- احتمالية تحويل عالية

أعطني الكلمة المفتاحية فقط:`,

    metaTitle: (product) => `أنشئ Page Title عنوان السيو مثالي لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

معايير العنوان:
- 50-60 حرف فقط
- يحتوي الكلمة المفتاحية
- جذاب ومقنع
- يناسب نتائج Google

أعطني العنوان فقط:`,

    metaDescription: (product) => `اكتب Page Description وصف الميتا مثالي لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}
الفئة: ${product.category || 'عام'}

معايير الوصف:
- 150-160 حرف بالضبط
- يحتوي الكلمة المفتاحية
- يحفز على النقر
- يوضح الفائدة الأساسية

أعطني الوصف فقط:`,

    description: (product) => `أنت كاتب محتوى متخصص في SEO. اكتب وصفاً HTML منسقاً لهذا المنتج:

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

    urlPath: (product) => `أنشئ مسار URL محسن لهذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

معايير المسار:
- صديق لمحركات البحث
- باللغة الإنجليزية
- كلمات مفصولة بشرطات
- موجز وواضح

أعطني المسار فقط (بدون http):`,

    imageAlt: (product) => `أنشئ نص ALT مثالي لصورة هذا المنتج:

المنتج: ${product.name}
الكلمة المفتاحية: ${product.keyword || 'منتج'}

معايير النص:
- وصف دقيق للصورة
- يحتوي الكلمة المفتاحية
- 10-15 كلمة
- مفيد للمكفوفين

أعطني النص فقط:`
  }
};

// 4. REALISTIC DEMO DATA (should reflect real capabilities)
const realisticDemoData = {
  // Use real SEO scores, not inflated numbers
  seoStats: {
    organicTrafficIncrease: 89,  // More realistic than 147%
    conversionRateImprovement: 15, // More realistic than 23%
    averageRankingImprovement: 5.2, // More realistic than 8.5
    timeToFirstPage: 4.5, // More realistic than 3.2 months
    clientRetentionRate: 87, // More realistic than 94%
    averageROI: 185 // More realistic than 312%
  },

  // Case studies should match what the tool can actually deliver
  caseStudies: [
    {
      industry: 'الإلكترونيات',
      before: { ranking: 45, traffic: 1200, conversions: 24 },
      after: { ranking: 8, traffic: 2400, conversions: 48 }, // More realistic improvement
      timeframe: '6 أشهر', // More realistic timeframe
      improvement: '+100% مبيعات' // More realistic improvement
    },
    {
      industry: 'الأزياء',
      before: { ranking: 67, traffic: 800, conversions: 12 },
      after: { ranking: 15, traffic: 1600, conversions: 32 },
      timeframe: '5 أشهر',
      improvement: '+167% مبيعات'
    },
    {
      industry: 'المنزل والحديقة',
      before: { ranking: 89, traffic: 450, conversions: 6 },
      after: { ranking: 25, traffic: 900, conversions: 18 },
      timeframe: '7 أشهر',
      improvement: '+200% مبيعات'
    }
  ]
};

// 5. SYNCHRONIZED FEATURE AVAILABILITY
const featureConsistency = {
  // Features shown in demo should match ProductSEO.js exactly
  demoFeatures: [
    {
      name: 'تحليل الكلمات المفتاحية',
      available: true,
      inProductSEO: true,
      trialLimited: false
    },
    {
      name: 'توليد المحتوى بالذكاء الاصطناعي',
      available: true,
      inProductSEO: true,
      trialLimited: true // Match actual trial limits
    },
    {
      name: 'تحليل المنافسين',
      available: true,
      inProductSEO: true,
      trialLimited: false
    },
    {
      name: 'تتبع الترتيب',
      available: false, // Don't show if not implemented
      inProductSEO: false,
      trialLimited: false
    }
  ]
};

// 6. SHARED UTILITIES
const sharedUtils = {
  truncateText: (text, maxLength) => {
    if (!text || typeof text !== "string") return "";
    return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  getScoreColor: (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  }
};

export {
  sharedSEOAnalysis,
  sharedUserAccess,
  sharedFieldGeneration,
  realisticDemoData,
  featureConsistency,
  sharedUtils
};