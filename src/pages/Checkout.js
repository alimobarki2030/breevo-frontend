import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, Check, CreditCard, Shield, Clock, Percent, Tag, Gift } from "lucide-react";

// معلومات الخطط مع إعدادات الخصم
const PLAN_DETAILS = {
  free: {
    name: "المجانية",
    price: 0,
    originalPrice: 0,
    icon: "🆓",
    color: "from-green-500 to-blue-600",
    discountEligible: false,
    maxDiscount: 0,
    features: [
      "3 منتجات شهرياً",
      "جميع مميزات المنصة",
      "توليد تلقائي بالذكاء الاصطناعي",
      "تحليل SEO فوري",
      "معاينة Google محسنة",
      "دعم عبر البريد الإلكتروني"
    ]
  },
  pro: {
    name: "الاحترافية",
    price: 49,
    originalPrice: 79,
    icon: "💎",
    color: "from-blue-500 to-purple-600",
    discountEligible: true,
    maxDiscount: 50,
    features: [
      "30 منتج شهرياً",
      "مؤشرات سيو متقدمة", 
      "توليد تلقائي بالذكاء الاصطناعي",
      "دعم فني مخصص",
      "تحليلات مفصلة",
      "معاينة Google محسنة"
    ]
  },
  enterprise: {
    name: "الأعمال", 
    price: 129,
    originalPrice: 199,
    icon: "👑",
    color: "from-yellow-500 to-orange-600",
    discountEligible: true,
    maxDiscount: 30,
    features: [
      "منتجات غير محدودة",
      "تحليل شامل متقدم", 
      "دعم خاص ومتابعة مخصصة",
      "تقارير مفصلة",
      "أولوية في الميزات الجديدة",
      "API مخصص للتكامل",
      "استشارة SEO شخصية"
    ]
  },
  business: {
    name: "الأعمال", 
    price: 129,
    originalPrice: 199,
    icon: "👑",
    color: "from-yellow-500 to-orange-600",
    discountEligible: true,
    maxDiscount: 30,
    features: [
      "منتجات غير محدودة",
      "تحليل شامل متقدم", 
      "دعم خاص ومتابعة مخصصة",
      "تقارير مفصلة",
      "أولوية في الميزات الجديدة",
      "API مخصص للتكامل",
      "استشارة SEO شخصية"
    ]
  }
};

// طرق الدفع المتاحة
const PAYMENT_METHODS = [
  { id: 'visa', name: 'فيزا / ماستركارد', icon: '💳', popular: true },
  { id: 'mada', name: 'مدى', icon: '🏦', popular: true },
  { id: 'applepay', name: 'Apple Pay', icon: '🍎', popular: false },
  { id: 'stc', name: 'STC Pay', icon: '📱', popular: false },
  { id: 'tabby', name: 'تابي - ادفع لاحقاً', icon: '⏱️', popular: false }
];

// أكواد الخصم (محاكاة قاعدة البيانات)
const PROMO_CODES = {
  'WELCOME20': {
    type: 'discount',
    discountType: 'percentage',
    discountValue: 20,
    applicablePlans: ['pro', 'enterprise', 'business'],
    isActive: true,
    expirationDate: '2024-12-31',
    usageLimit: 1000,
    currentUsage: 127,
    description: 'خصم ترحيبي للعملاء الجدد'
  },
  'FIRST50': {
    type: 'discount',
    discountType: 'fixed',
    discountValue: 50,
    applicablePlans: ['pro', 'enterprise', 'business'],
    isActive: true,
    expirationDate: '2024-12-31',
    usageLimit: 500,
    currentUsage: 89,
    description: 'خصم ثابت للطلب الأول'
  },
  'SAVE20': {
    type: 'discount',
    discountType: 'percentage',
    discountValue: 20,
    applicablePlans: ['pro', 'enterprise', 'business'],
    isActive: true,
    expirationDate: '2024-12-31',
    usageLimit: 1000,
    currentUsage: 50,
    description: 'خصم خاص - عرض محدود'
  },
  'SUMMER2024': {
    type: 'discount',
    discountType: 'percentage',
    discountValue: 25,
    applicablePlans: ['pro'],
    isActive: true,
    expirationDate: '2024-08-31',
    usageLimit: 250,
    currentUsage: 156,
    description: 'عرض الصيف الخاص'
  },
  'ENTERPRISE15': {
    type: 'discount',
    discountType: 'percentage',
    discountValue: 15,
    applicablePlans: ['enterprise', 'business'],
    isActive: true,
    expirationDate: '2024-12-31',
    usageLimit: 100,
    currentUsage: 23,
    description: 'خصم خاص لخطة الأعمال'
  },
  'UPGRADE30': {
    type: 'discount',
    discountType: 'percentage',
    discountValue: 30,
    applicablePlans: ['pro', 'enterprise', 'business'],
    isActive: true,
    expirationDate: '2024-10-31',
    usageLimit: 200,
    currentUsage: 67,
    description: 'خصم ترقية الحساب',
    minPurchase: 100
  }
};

// CONVERSION OPTIMIZATION UTILITIES
class ConversionTracker {
  static trackCheckoutEvent(eventName, planId, additionalData = {}) {
    const planDetails = PLAN_DETAILS[planId];
    
    // Google Analytics 4 Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', eventName, {
        currency: 'SAR',
        value: planDetails?.price || 0,
        items: [{
          item_id: planId,
          item_name: planDetails?.name,
          category: 'subscription',
          price: planDetails?.price || 0,
          quantity: 1
        }],
        ...additionalData
      });
    }

    // Facebook Pixel (if using)
    if (window.fbq) {
      window.fbq('track', eventName, {
        content_ids: [planId],
        content_type: 'product',
        value: planDetails?.price || 0,
        currency: 'SAR'
      });
    }

    // Custom analytics (send to your backend)
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        planId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...additionalData
      })
    }).catch(err => console.log('Analytics error:', err));
  }

  static beginCheckout(planId, billingCycle = 'monthly') {
    ConversionTracker.trackCheckoutEvent('begin_checkout', planId, {
      billing_cycle: billingCycle,
      checkout_step: 1
    });
  }

  static addPaymentInfo(planId, paymentMethod) {
    ConversionTracker.trackCheckoutEvent('add_payment_info', planId, {
      payment_type: paymentMethod,
      checkout_step: 2
    });
  }

  static purchase(planId, finalAmount, promoCode = null, affiliateCode = null) {
    ConversionTracker.trackCheckoutEvent('purchase', planId, {
      transaction_id: `sub_${Date.now()}`,
      final_amount: finalAmount,
      coupon: promoCode,
      affiliate: affiliateCode,
      checkout_step: 3
    });
  }

  static trackAbandonment(planId, step, reason = 'unknown') {
    ConversionTracker.trackCheckoutEvent('checkout_abandon', planId, {
      abandonment_step: step,
      abandonment_reason: reason,
      time_on_page: Math.round((Date.now() - window.checkoutStartTime) / 1000)
    });
  }
}

// EXIT INTENT HOOK
function useExitIntent(onExitIntent) {
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const checkoutStartTime = useRef(Date.now());

  useEffect(() => {
    if (hasShownExitIntent) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setHasShownExitIntent(true);
        onExitIntent();
      }
    };

    const handleBeforeUnload = (e) => {
      const timeOnPage = Date.now() - checkoutStartTime.current;
      
      if (timeOnPage > 30000 && !hasShownExitIntent) {
        const urlParams = new URLSearchParams(window.location.search);
        const planId = urlParams.get('plan');
        
        if (planId) {
          ConversionTracker.trackAbandonment(planId, 'page_exit', 'before_unload');
        }
        
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Mobile exit intent detection
    let scrollDirection = 0;
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop < lastScrollTop && currentScrollTop < 50) {
        scrollDirection++;
        
        if (scrollDirection > 2 && !hasShownExitIntent) {
          setHasShownExitIntent(true);
          onExitIntent();
        }
      }
      
      lastScrollTop = currentScrollTop;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShownExitIntent, onExitIntent]);
}

// MOBILE DETECTION HOOK
function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// PERFORMANCE MONITORING HOOK
function usePerformanceMonitoring(planId) {
  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      if (performance.getEntriesByType) {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.fetchStart;
          
          if (loadTime > 3000) {
            ConversionTracker.trackCheckoutEvent('slow_page_load', planId, { 
              load_time: loadTime 
            });
          }
        }
      }
    };

    // Track first interaction
    let hasInteracted = false;
    const trackFirstInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        const interactionTime = Date.now() - window.checkoutStartTime;
        ConversionTracker.trackCheckoutEvent('first_interaction', planId, {
          interaction_time: interactionTime
        });
      }
    };

    // Error monitoring
    const handleError = (e) => {
      ConversionTracker.trackCheckoutEvent('javascript_error', planId, {
        error_message: e.message,
        error_line: e.lineno,
        error_file: e.filename
      });
    };

    const handleUnhandledRejection = (e) => {
      ConversionTracker.trackCheckoutEvent('promise_rejection', planId, {
        error_reason: e.reason?.toString()
      });
    };

    window.addEventListener('load', trackPageLoad);
    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, trackFirstInteraction, { once: true });
    });
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('load', trackPageLoad);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [planId]);
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);
  
  // CONVERSION TRACKING STATES
  const [affiliateCode, setAffiliateCode] = useState('');
  const [referralSource, setReferralSource] = useState('');

  // بيانات الفوترة
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: 'SA',
    city: '',
    address: '',
    vatNumber: ''
  });

  // بيانات البطاقة
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // HOOKS FOR OPTIMIZATION
  const isMobile = useMobileDetection();
  usePerformanceMonitoring(selectedPlan);
  
  // EXIT INTENT HANDLING
  const handleExitIntent = () => {
    if (selectedPlan && selectedPlan !== 'free' && !appliedPromo) {
      setShowExitIntentModal(true);
      ConversionTracker.trackCheckoutEvent('exit_intent_triggered', selectedPlan);
    }
  };
  
  useExitIntent(handleExitIntent);

  // ENHANCED URL PARAMETER HANDLING
  useEffect(() => {
    // Track checkout start time
    window.checkoutStartTime = Date.now();
    
    const urlParams = new URLSearchParams(location.search);
    const planParam = urlParams.get('plan');
    const promoParam = urlParams.get('promo');
    const affiliateParam = urlParams.get('affiliate');
    const billingParam = urlParams.get('billing');
    const sourceParam = urlParams.get('source') || urlParams.get('utm_source');
    
    // Track conversion source for analytics
    if (sourceParam) {
      setReferralSource(sourceParam);
    }
    
    // Set affiliate code for commission tracking
    if (affiliateParam) {
      setAffiliateCode(affiliateParam);
      setPromoCode(affiliateParam);
      setTimeout(() => applyPromoCode(affiliateParam), 500);
    }
    
    // Set billing cycle from URL
    if (billingParam === 'annual' || billingParam === 'yearly') {
      setBillingCycle('yearly');
    } else if (billingParam === 'monthly') {
      setBillingCycle('monthly');
    }
    
    // Validate and set plan
    if (planParam && PLAN_DETAILS[planParam]) {
      setSelectedPlan(planParam);
      
      // Track checkout initiation
      ConversionTracker.beginCheckout(planParam, billingParam || 'monthly');
    } else if (planParam) {
      toast.error('خطة غير صحيحة. يرجى اختيار خطة صالحة.');
      navigate('/pricing');
      return;
    } else {
      navigate('/pricing');
      return;
    }

    // Auto-apply promo code from URL
    if (promoParam && !affiliateParam) {
      setPromoCode(promoParam);
      setTimeout(() => applyPromoCode(promoParam), 500);
    }

    // Load user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const clientName = localStorage.getItem('clientName') || '';
    
    setBillingInfo(prev => ({
      ...prev,
      fullName: clientName,
      email: userData.email || ''
    }));
  }, [location.search, navigate]);

  // ADD MOBILE STYLES
  useEffect(() => {
    if (isMobile) {
      const mobileStyles = document.createElement('style');
      mobileStyles.id = 'mobile-checkout-styles';
      mobileStyles.textContent = `
        @media (max-width: 768px) {
          .checkout-button {
            min-height: 48px !important;
            font-size: 16px !important;
          }
          
          .checkout-input {
            min-height: 44px !important;
            font-size: 16px !important;
          }
          
          .checkout-summary {
            position: sticky;
            bottom: 0;
            background: rgb(17, 24, 39);
            border-top: 1px solid rgb(55, 65, 81);
            padding: 16px;
            margin: 0 -16px -16px -16px;
            z-index: 10;
          }
        }
      `;
      
      if (!document.getElementById('mobile-checkout-styles')) {
        document.head.appendChild(mobileStyles);
      }

      return () => {
        const existingStyles = document.getElementById('mobile-checkout-styles');
        if (existingStyles) {
          existingStyles.remove();
        }
      };
    }
  }, [isMobile]);

  const handleInputChange = (section, field, value) => {
    if (section === 'billing') {
      setBillingInfo(prev => ({ ...prev, [field]: value }));
      
      // Enhanced validation for key fields
      if (field === 'email' && value) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isValid) {
          // Could add field-level error state here
        }
      }
      
      if (field === 'phone' && value) {
        // Auto-format Saudi phone numbers
        let formatted = value.replace(/\D/g, '');
        if (formatted.startsWith('966')) {
          formatted = formatted.slice(3);
        }
        if (formatted.startsWith('0')) {
          formatted = formatted.slice(1);
        }
        if (formatted.length > 0) {
          formatted = formatted.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
          setBillingInfo(prev => ({ ...prev, phone: '+966 ' + formatted }));
          return;
        }
      }
    } else if (section === 'card') {
      setCardInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validatePromoCode = (code, plan) => {
    const promoData = PROMO_CODES[code.toUpperCase()];
    
    if (!promoData) {
      return { valid: false, message: 'كود الخصم غير موجود' };
    }

    if (!promoData.isActive) {
      return { valid: false, message: 'كود الخصم غير نشط' };
    }

    if (new Date(promoData.expirationDate) < new Date()) {
      return { valid: false, message: 'كود الخصم منتهي الصلاحية' };
    }

    if (promoData.currentUsage >= promoData.usageLimit) {
      return { valid: false, message: 'تم استنفاد كود الخصم' };
    }

    if (!promoData.applicablePlans.includes(plan)) {
      return { valid: false, message: 'كود الخصم غير متاح لهذه الخطة' };
    }

    if (plan === 'free') {
      return { valid: false, message: 'لا يمكن تطبيق خصم على الخطة المجانية' };
    }

    if (promoData.minPurchase) {
      const planPrice = PLAN_DETAILS[plan].price;
      const totalBeforeDiscount = billingCycle === 'yearly' ? planPrice * 12 * 0.8 : planPrice;
      
      if (totalBeforeDiscount < promoData.minPurchase) {
        return { 
          valid: false, 
          message: `الحد الأدنى للشراء ${promoData.minPurchase} ريال` 
        };
      }
    }

    const maxAllowedDiscount = PLAN_DETAILS[plan].maxDiscount;
    if (promoData.discountType === 'percentage' && promoData.discountValue > maxAllowedDiscount) {
      return { 
        valid: false, 
        message: `أقصى خصم مسموح لهذه الخطة ${maxAllowedDiscount}%` 
      };
    }

    return { valid: true, data: promoData };
  };

  const applyPromoCode = async (codeToApply = null) => {
    const code = codeToApply || promoCode;
    if (!code.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    setPromoLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const validation = validatePromoCode(code, selectedPlan);

      if (validation.valid) {
        setAppliedPromo({
          code: code.toUpperCase(),
          ...validation.data
        });
        
        toast.success(
          <div className="flex items-center gap-2">
            <Gift className="text-green-500" size={20} />
            <div>
              <div className="font-bold">تم تطبيق كود الخصم! 🎉</div>
              <div className="text-sm">{validation.data.description}</div>
            </div>
          </div>,
          { duration: 4000 }
        );

        // Track promo application
        ConversionTracker.trackCheckoutEvent('promo_applied', selectedPlan, { 
          promo_code: code.toUpperCase(),
          discount_amount: calculateDiscount()
        });
      } else {
        toast.error(validation.message);
        setAppliedPromo(null);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحقق من كود الخصم');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('تم إزالة كود الخصم');
  };

  const calculateDiscount = () => {
    if (!appliedPromo || selectedPlan === 'free') return 0;

    const plan = PLAN_DETAILS[selectedPlan];
    let basePrice = plan.price;
    
    if (billingCycle === 'yearly') {
      basePrice = basePrice * 12 * 0.8;
    }

    if (appliedPromo.discountType === 'percentage') {
      return Math.round(basePrice * appliedPromo.discountValue / 100);
    } else {
      return Math.min(appliedPromo.discountValue, basePrice);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    
    const plan = PLAN_DETAILS[selectedPlan];
    let price = plan.price;
    
    if (billingCycle === 'yearly') {
      price = price * 12 * 0.8;
    }
    
    const discountAmount = calculateDiscount();
    price = Math.max(0, price - discountAmount);
    
    return price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Track payment info step
      if (selectedPlan !== 'free') {
        ConversionTracker.addPaymentInfo(selectedPlan, paymentMethod);
      }

      // Enhanced validation
      if (selectedPlan !== 'free') {
        const requiredFields = ['fullName', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => !billingInfo[field]);
        
        if (missingFields.length > 0) {
          toast.error('يرجى ملء جميع الحقول المطلوبة');
          setLoading(false);
          
          // Track form validation error
          ConversionTracker.trackCheckoutEvent('form_validation_error', selectedPlan, {
            missing_fields: missingFields
          });
          return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
          toast.error('يرجى إدخال بريد إلكتروني صحيح');
          setLoading(false);
          return;
        }
      } else {
        if (!billingInfo.email) {
          toast.error('يرجى إدخال البريد الإلكتروني');
          setLoading(false);
          return;
        }
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const finalAmount = calculateTotal();
      
      // Track successful conversion
      ConversionTracker.purchase(
        selectedPlan, 
        finalAmount, 
        appliedPromo?.code, 
        affiliateCode
      );

      // Save subscription data
      const subscriptionData = {
        plan: selectedPlan,
        billingCycle,
        startDate: new Date().toISOString(),
        endDate: billingCycle === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: finalAmount,
        originalAmount: billingCycle === 'yearly' 
          ? PLAN_DETAILS[selectedPlan].price * 12 
          : PLAN_DETAILS[selectedPlan].price,
        discountApplied: appliedPromo ? {
          code: appliedPromo.code,
          amount: calculateDiscount(),
          type: appliedPromo.discountType
        } : null,
        affiliateCode: affiliateCode || null,
        referralSource: referralSource || null,
        paymentMethod: selectedPlan === 'free' ? 'free' : paymentMethod,
        status: 'active',
        deviceType: isMobile ? 'mobile' : 'desktop',
        conversionSource: document.referrer || 'direct'
      };

      localStorage.setItem('subscription', JSON.stringify(subscriptionData));

      // Update user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.plan = selectedPlan;
      user.subscriptionStatus = 'active';
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(
        selectedPlan === 'free' 
          ? '🎉 تم تفعيل حسابك المجاني بنجاح!'
          : '🎉 تم تفعيل اشتراكك بنجاح!'
      );
      
      setTimeout(() => {
        navigate('/products');
      }, 1500);

    } catch (error) {
      console.error('خطأ في معالجة الدفع:', error);
      toast.error('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.');
      
      // Track payment error
      ConversionTracker.trackCheckoutEvent('payment_error', selectedPlan, {
        error_message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // EXIT INTENT MODAL HANDLER
  const handleExitIntentApply = () => {
    setPromoCode('SAVE20');
    setShowExitIntentModal(false);
    applyPromoCode('SAVE20');
    ConversionTracker.trackCheckoutEvent('exit_intent_converted', selectedPlan, { 
      promo_applied: 'SAVE20' 
    });
  };

  const handleExitIntentDismiss = () => {
    setShowExitIntentModal(false);
    ConversionTracker.trackCheckoutEvent('exit_intent_dismissed', selectedPlan);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#83dcc9] mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const plan = PLAN_DETAILS[selectedPlan];
  const total = calculateTotal();
  const discountAmount = calculateDiscount();
  const savings = billingCycle === 'yearly' ? plan.price * 12 * 0.2 : 0;
  const isFree = selectedPlan === 'free';

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <img src="/logo2.png" alt="Logo" className="h-12 mx-auto" />
            </Link>
            <h1 className="text-3xl font-bold mb-2">
              {isFree ? 'تفعيل الحساب المجاني' : 'إتمام الاشتراك'}
            </h1>
            <p className="text-gray-400">
              {isFree 
                ? 'خطوة واحدة للوصول لمميزات SEO مجاناً'
                : 'خطوة واحدة للوصول لجميع مميزات السيو المتقدمة'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* نموذج الدفع */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* معلومات الفوترة */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#83dcc9] text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  {isFree ? 'معلومات الحساب' : 'معلومات الفوترة'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={isFree ? "الاسم (اختياري)" : "الاسم الكامل *"}
                    value={billingInfo.fullName}
                    onChange={(e) => handleInputChange('billing', 'fullName', e.target.value)}
                    className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                    required={!isFree}
                    autoComplete="name"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني *"
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                    className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                    required
                    autoComplete="email"
                  />
                  {!isFree && (
                    <>
                      <input
                        type="tel"
                        placeholder="رقم الجوال *"
                        value={billingInfo.phone}
                        onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                        className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                        required
                        autoComplete="tel"
                      />
                      <input
                        type="text"
                        placeholder="اسم الشركة (اختياري)"
                        value={billingInfo.company}
                        onChange={(e) => handleInputChange('billing', 'company', e.target.value)}
                        className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                        autoComplete="organization"
                      />
                      <select
                        value={billingInfo.country}
                        onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
                        className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                        autoComplete="country"
                      >
                        <option value="SA">السعودية</option>
                        <option value="AE">الإمارات</option>
                        <option value="KW">الكويت</option>
                        <option value="QA">قطر</option>
                        <option value="BH">البحرين</option>
                        <option value="OM">عمان</option>
                      </select>
                      <input
                        type="text"
                        placeholder="المدينة"
                        value={billingInfo.city}
                        onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                        className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                        autoComplete="address-level2"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* طريقة الدفع - Skip for free plan */}
              {!isFree && (
                <div className="bg-gray-900 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#83dcc9] text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    طريقة الدفع
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {/* Prioritize mobile payments for mobile users */}
                    {(isMobile ? 
                      [...PAYMENT_METHODS].sort((a, b) => {
                        const mobileFirst = ['applepay', 'googlepay', 'stc'];
                        return mobileFirst.includes(a.id) ? -1 : 1;
                      }) : 
                      PAYMENT_METHODS
                    ).map((method) => (
                      <label
                        key={method.id}
                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-[#83dcc9] bg-[#83dcc9]/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                        {method.popular && (
                          <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            شائع
                          </span>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* تفاصيل البطاقة */}
                  {(paymentMethod === 'visa' || paymentMethod === 'mada') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="رقم البطاقة"
                          value={cardInfo.number}
                          onChange={(e) => handleInputChange('card', 'number', e.target.value)}
                          className="checkout-input w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                          maxLength={19}
                          autoComplete="cc-number"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) => handleInputChange('card', 'expiry', e.target.value)}
                        className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                        maxLength={5}
                        autoComplete="cc-exp"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardInfo.cvv}
                        onChange={(e) => handleInputChange('card', 'cvv', e.target.value)}
                        className="checkout-input bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                        maxLength={4}
                        autoComplete="cc-csc"
                      />
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="اسم حامل البطاقة"
                          value={cardInfo.name}
                          onChange={(e) => handleInputChange('card', 'name', e.target.value)}
                          className="checkout-input w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#83dcc9] focus:border-transparent"
                          autoComplete="cc-name"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ملخص الطلب */}
            <div className="space-y-6">
              
              {/* تفاصيل الخطة */}
              <div className={`checkout-summary bg-gray-900 rounded-2xl p-6 ${isMobile ? 'sticky top-4' : 'sticky top-4'}`}>
                <div className={`bg-gradient-to-r ${plan.color} rounded-lg p-4 mb-6`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{plan.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">الخطة {plan.name}</h3>
                      <p className="text-white/80 text-sm">
                        {isFree ? 'مجانية للأبد' : 'للمتاجر الاحترافية'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* دورة الفوترة - Skip for free plan */}
                {!isFree && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">دورة الفوترة</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                        billingCycle === 'monthly' ? 'border-[#83dcc9] bg-[#83dcc9]/10' : 'border-gray-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="billing"
                            value="monthly"
                            checked={billingCycle === 'monthly'}
                            onChange={(e) => setBillingCycle(e.target.value)}
                            className="sr-only"
                          />
                          <span>شهرياً</span>
                        </div>
                        <span className="font-bold">{plan.price} ريال</span>
                      </label>
                      
                      <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                        billingCycle === 'yearly' ? 'border-[#83dcc9] bg-[#83dcc9]/10' : 'border-gray-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="billing"
                            value="yearly"
                            checked={billingCycle === 'yearly'}
                            onChange={(e) => setBillingCycle(e.target.value)}
                            className="sr-only"
                          />
                          <div>
                            <span>سنوياً</span>
                            <span className="block text-xs text-green-400">وفر {Math.round(plan.price * 12 * 0.2)} ريال</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="font-bold">{Math.round(plan.price * 12 * 0.8)} ريال</span>
                          <span className="block text-xs text-gray-400 line-through">{plan.price * 12} ريال</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* كود الخصم - Skip for free plan */}
                {!isFree && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      كود الخصم
                    </label>
                    
                    {!appliedPromo ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="أدخل كود الخصم"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#83dcc9]"
                            disabled={promoLoading}
                          />
                          <button
                            type="button"
                            onClick={() => applyPromoCode()}
                            disabled={promoLoading || !promoCode.trim()}
                            className="bg-[#83dcc9] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#6cc9b9] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            {promoLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            ) : (
                              'تطبيق'
                            )}
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          <p>هل لديك كود خصم؟ أدخله أعلاه للحصول على خصم فوري</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">{appliedPromo.code}</span>
                          </div>
                          <button
                            onClick={removePromoCode}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            إزالة
                          </button>
                        </div>
                        <p className="text-xs text-green-300 mt-1">{appliedPromo.description}</p>
                        <p className="text-xs text-green-400 font-medium mt-1">
                          خصم {appliedPromo.discountType === 'percentage' 
                            ? `${appliedPromo.discountValue}%` 
                            : `${appliedPromo.discountValue} ريال`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ملخص السعر */}
                <div className="border-t border-gray-800 pt-4 space-y-2">
                  {isFree ? (
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-green-400 mb-2">مجاني</div>
                      <p className="text-sm text-gray-400">لا توجد رسوم - إلى الأبد</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>السعر الأساسي</span>
                        <span>{billingCycle === 'yearly' ? plan.price * 12 : plan.price} ريال</span>
                      </div>
                      
                      {billingCycle === 'yearly' && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>خصم الاشتراك السنوي (20%)</span>
                          <span>-{Math.round(savings)} ريال</span>
                        </div>
                      )}
                      
                      {appliedPromo && discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>خصم الكوبون ({appliedPromo.code})</span>
                          <span>-{discountAmount} ريال</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span>ضريبة القيمة المضافة (15%)</span>
                        <span>{Math.round(total * 0.15)} ريال</span>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-lg">
                        <span>المجموع</span>
                        <span className="flex items-center gap-2">
                          {appliedPromo && (
                            <span className="text-sm text-gray-400 line-through">
                              {Math.round((billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price) * 1.15)} ريال
                            </span>
                          )}
                          <span className="text-[#83dcc9]">{Math.round(total * 1.15)} ريال</span>
                        </span>
                      </div>
                      
                      {appliedPromo && (
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                            <Percent className="w-3 h-3" />
                            وفرت {Math.round(discountAmount + discountAmount * 0.15)} ريال
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* أزرار العمل */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`checkout-button w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                      loading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-[#83dcc9] hover:bg-[#6cc9b9] text-gray-900'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        {isFree ? (
                          <>
                            <Check className="w-5 h-5" />
                            تفعيل الحساب المجاني
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            تأكيد الدفع ({Math.round(total * 1.15)} ريال)
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  <Link 
                    to="/pricing"
                    className="block w-full text-center py-2 text-gray-400 hover:text-white transition text-sm"
                  >
                    ← العودة لتعديل الخطة
                  </Link>
                </div>

                {/* ضمانات الأمان */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="space-y-2 text-xs text-gray-400">
                    {!isFree && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>دفع آمن ومشفر</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span>إلغاء في أي وقت</span>
                    </div>
                    {!isFree && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>ضمان استرداد 30 يوم</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* EXIT INTENT MODAL */}
      {showExitIntentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center text-gray-900">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold mb-4">انتظر! عرض خاص لك</h2>
            <p className="text-gray-600 mb-6">احصل على خصم 20% على اشتراكك الأول</p>
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg mb-6">
              <div className="text-2xl font-bold">SAVE20</div>
              <div className="text-sm">استخدم هذا الكود للحصول على الخصم</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExitIntentApply}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                استخدم الخصم
              </button>
              <button
                onClick={handleExitIntentDismiss}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                لا شكراً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}