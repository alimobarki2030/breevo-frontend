import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PublicNavbar from '../components/navbars/PublicNavbar';
import UserNavbar from '../components/navbars/UserNavbar';

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const isLoggedIn = user || localStorage.getItem('user') || localStorage.getItem('clientName');

  // Set meta tags using useEffect
  useEffect(() => {
    // Update document title
    document.title = "SEO Raysa - منصة تحسين محركات البحث للمتاجر الإلكترونية";

    // Helper function to set meta tags
    const setMetaTag = (name, content, property = false) => {
      let meta = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary Meta Tags
    setMetaTag('description', 'ضاعف مبيعات متجرك الإلكتروني مع SEO Raysa. منصة متخصصة في تحسين ظهور منتجاتك في Google باستخدام الذكاء الاصطناعي. ابدأ بـ 99 ريال/شهر فقط.');
    setMetaTag('keywords', 'SEO, تحسين محركات البحث, متاجر إلكترونية, سيو, تحسين المتاجر, SEO للمتاجر, زيادة المبيعات, Google SEO, تحسين الظهور');
    setMetaTag('robots', 'index, follow');
    setMetaTag('language', 'Arabic');
    setMetaTag('author', 'SEO Raysa');

    // Open Graph / Facebook
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', 'https://seoraysa.com/', true);
    setMetaTag('og:title', 'SEO Raysa - منصة تحسين محركات البحث للمتاجر الإلكترونية', true);
    setMetaTag('og:description', 'ضاعف مبيعات متجرك الإلكتروني مع SEO Raysa. منصة متخصصة في تحسين ظهور منتجاتك في Google باستخدام الذكاء الاصطناعي.', true);
    setMetaTag('og:image', 'https://seoraysa.com/og-image.png', true);
    setMetaTag('og:site_name', 'SEO Raysa', true);
    setMetaTag('og:locale', 'ar_SA', true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', 'https://seoraysa.com/');
    setMetaTag('twitter:title', 'SEO Raysa - منصة تحسين محركات البحث للمتاجر الإلكترونية');
    setMetaTag('twitter:description', 'ضاعف مبيعات متجرك الإلكتروني مع SEO Raysa. منصة متخصصة في تحسين ظهور منتجاتك في Google.');
    setMetaTag('twitter:image', 'https://seoraysa.com/twitter-image.png');
    setMetaTag('twitter:site', '@seoraysa');

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://seoraysa.com');

    // Schema Markup Data
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SEO Raysa",
      "url": "https://seoraysa.com",
      "logo": "https://seoraysa.com/logo.png",
      "description": "منصة SEO احترافية للمتاجر الإلكترونية - تحسين محركات البحث بالذكاء الاصطناعي",
      "email": "support@seoraysa.com",
      "foundingDate": "2024",
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "24.7136",
          "longitude": "46.6753"
        },
        "geoRadius": "5000000"
      },
      "sameAs": [
        "https://twitter.com/seoraysa",
        "https://linkedin.com/company/seoraysa",
        "https://instagram.com/seoraysa"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://seoraysa.com",
      "name": "SEO Raysa",
      "description": "منصة تحسين محركات البحث للمتاجر الإلكترونية",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://seoraysa.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "SEO Raysa - منصة تحسين محركات البحث",
      "description": "منصة متخصصة في تحسين SEO للمتاجر الإلكترونية باستخدام الذكاء الاصطناعي",
      "brand": {
        "@type": "Brand",
        "name": "SEO Raysa"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "الباقة الأساسية",
          "price": "99",
          "priceCurrency": "SAR",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31",
          "url": "https://seoraysa.com/checkout?plan=starter"
        },
        {
          "@type": "Offer",
          "name": "الباقة المتقدمة",
          "price": "199",
          "priceCurrency": "SAR",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31",
          "url": "https://seoraysa.com/checkout?plan=advanced"
        },
        {
          "@type": "Offer",
          "name": "الباقة الاحترافية",
          "price": "399",
          "priceCurrency": "SAR",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31",
          "url": "https://seoraysa.com/checkout?plan=professional"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "156"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "هل أحتاج لخبرة تقنية لاستخدام SEO Raysa؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "لا، المنصة مصممة لتكون سهلة الاستخدام. كل ما تحتاجه هو ربط متجرك والنظام سيتولى الباقي مع توصيات واضحة وسهلة التطبيق."
          }
        },
        {
          "@type": "Question",
          "name": "كم من الوقت أحتاج لرؤية النتائج؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "التحسينات تظهر فوراً على متجرك، لكن نتائج SEO في محركات البحث تحتاج عادة 2-4 أسابيع لتظهر بشكل ملحوظ حسب المنافسة في مجالك."
          }
        },
        {
          "@type": "Question",
          "name": "هل يمكنني تغيير الباقة في أي وقت؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، يمكنك الترقية أو التخفيض في أي وقت. التغييرات تصبح سارية من بداية دورة الفوترة التالية."
          }
        },
        {
          "@type": "Question",
          "name": "ماذا يحدث لبياناتي إذا ألغيت الاشتراك؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "بياناتك تبقى آمنة ومحفوظة لمدة 30 يوماً بعد الإلغاء. يمكنك استعادة حسابك في أي وقت خلال هذه الفترة."
          }
        }
      ]
    };

    // Schema Markup injection
    const addSchemaScript = (schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    };

    // Add all schema scripts
    const scripts = [
      addSchemaScript(organizationSchema),
      addSchemaScript(websiteSchema),
      addSchemaScript(productSchema),
      addSchemaScript(faqSchema)
    ];

    // Cleanup function
    return () => {
      scripts.forEach(script => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div className={`min-h-screen font-arabic transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      
      {isLoggedIn ? <UserNavbar /> : <PublicNavbar />}
      
      {/* Hero Section - Professional & Clean */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234BB8A9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#4BB8A9]/10 text-[#4BB8A9] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>منصة SEO احترافية للمتاجر الإلكترونية</span>
              </div>

              <h1 className={`text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                ضاعف مبيعاتك بقوة
                <span className="block text-[#4BB8A9] mt-2">تحسين محركات البحث</span>
              </h1>

              <p className={`text-lg md:text-xl leading-relaxed mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                حسّن ظهور منتجاتك في Google بذكاء اصطناعي متقدم. 
                تحليل فوري، توصيات دقيقة، ونتائج مضمونة لمتجرك الإلكتروني.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/checkout?plan=starter" className="group">
                  <button className="w-full sm:w-auto bg-[#4BB8A9] text-gray-900 font-bold py-4 px-8 rounded-lg hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                    <span>ابدأ الآن - 99 ريال/شهر</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
                <Link to="/pricing" className="group">
                  <button className={`w-full sm:w-auto border-2 border-[#4BB8A9] font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isDark 
                      ? 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-gray-900' 
                      : 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-white'
                  }`}>
                    <span>عرض جميع الباقات</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </div>

              {/* Trust Elements */}
              <div className="flex items-center gap-8 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ضمان 7 أيام</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>إعداد فوري</span>
                </div>
              </div>
            </motion.div>

             {/* Visual Element - Professional Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              {/* Main Dashboard Preview */}
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl border ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className={`${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                  {/* Dashboard Header */}
                  <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#4BB8A9] rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>لوحة تحكم SEO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>آخر تحديث: منذ دقيقة</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6 space-y-6">
                    {/* SEO Performance Overview */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Score Card */}
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>نقاط SEO</span>
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold text-[#4BB8A9]">92/100</div>
                        <div className="mt-2 flex items-center gap-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-[#4BB8A9] h-2 rounded-full transition-all duration-500" style={{width: '92%'}}></div>
                          </div>
                        </div>
                      </div>

                      {/* Products Optimized */}
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>منتجات محسّنة</span>
                          <svg className="w-4 h-4 text-[#4BB8A9]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold">47/50</div>
                        <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>94% مكتمل</div>
                      </div>

                      {/* Weekly Traffic */}
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>الزيارات الأسبوعية</span>
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold">+23%</div>
                        <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>مقارنة بالأسبوع الماضي</div>
                      </div>
                    </div>

                    {/* Recent Products */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>أحدث المنتجات المحسّنة</h3>
                      <div className="space-y-2">
                        {/* Product 1 */}
                        <div className={`p-3 rounded-lg flex items-center justify-between ${
                          isDark ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <div>
                              <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>ساعة ذكية رياضية</div>
                              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>تم التحسين منذ 5 دقائق</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+15 نقطة</span>
                          </div>
                        </div>

                        {/* Product 2 */}
                        <div className={`p-3 rounded-lg flex items-center justify-between ${
                          isDark ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>هاتف ذكي 256GB</div>
                              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>تم التحسين منذ 12 دقيقة</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+22 نقطة</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Analytics Card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">معدل النمو</div>
                    <div className="text-sm font-bold text-gray-900">+42%</div>
                  </div>
                </div>
              </div>

              {/* Floating Notification */}
              <div className="absolute -bottom-4 -left-4 bg-[#4BB8A9] text-white rounded-lg shadow-xl p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <div className="text-sm">
                    <div className="font-semibold">منتج جديد!</div>
                    <div className="text-xs opacity-90">جاهز للتحسين</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why SEO Matters - Real Statistics */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              لماذا تحسين محركات البحث ضروري لمتجرك؟
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              إحصائيات حقيقية من مصادر موثوقة عالمياً
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Stat 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-center p-8 rounded-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="text-5xl font-bold text-[#4BB8A9] mb-4">93%</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                من التجارب الشرائية
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                تبدأ بالبحث في محركات البحث
              </p>
              <div className={`text-sm mt-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                المصدر: BrightEdge Research
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-center p-8 rounded-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="text-5xl font-bold text-[#4BB8A9] mb-4">75%</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                من المستخدمين
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                لا يتجاوزون الصفحة الأولى في Google
              </p>
              <div className={`text-sm mt-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                المصدر: HubSpot
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-center p-8 rounded-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="text-5xl font-bold text-[#4BB8A9] mb-4">70%</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                من النقرات
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                تذهب للنتائج الخمس الأولى
              </p>
              <div className={`text-sm mt-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                المصدر: Backlinko
              </div>
            </motion.div>
          </div>

          {/* Impact Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`max-w-4xl mx-auto text-center p-8 rounded-2xl ${
              isDark ? 'bg-gradient-to-r from-[#4BB8A9]/20 to-transparent' : 'bg-gradient-to-r from-[#4BB8A9]/10 to-transparent'
            }`}
          >
            <h3 className="text-2xl font-bold mb-4 text-[#4BB8A9]">ماذا يعني هذا لمتجرك؟</h3>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              إذا لم تظهر منتجاتك في الصفحة الأولى، فأنت تخسر <strong>75% من العملاء المحتملين</strong>.
              مع SEO Raysa، نضمن لك تحسين ظهور منتجاتك وزيادة فرص وصولها للعملاء المناسبين.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Professional Grid */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              كل ما تحتاجه لتحسين SEO متجرك
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              أدوات قوية ومتكاملة صُممت للمتاجر الإلكترونية الطموحة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                تحليل فوري بالذكاء الاصطناعي
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                تحليل شامل لكل منتج مع توصيات دقيقة لتحسين العناوين والأوصاف والكلمات المفتاحية
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                مزامنة تلقائية مع متجرك
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ربط مباشر مع متجرك الإلكتروني، مزامنة المنتجات تلقائياً، وتحديث البيانات في الوقت الفعلي
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                تقارير الأداء المفصلة
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                متابعة دقيقة لتحسن ترتيب منتجاتك ومعدلات النقر والزيارات مع رسوم بيانية واضحة
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                تحسين جماعي للمنتجات
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                حسّن عشرات أو مئات المنتجات دفعة واحدة بنقرة زر واحدة وبدقة عالية
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                بحث الكلمات المفتاحية
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                اكتشف أفضل الكلمات المفتاحية لمنتجاتك مع بيانات حجم البحث والمنافسة
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="w-12 h-12 bg-[#4BB8A9]/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                إشعارات وتنبيهات ذكية
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                استلم تنبيهات فورية عند إضافة منتجات جديدة أو انخفاض نقاط SEO
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Steps */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              كيف يعمل SEO Raysa؟
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ثلاث خطوات بسيطة لتحسين ظهور متجرك
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#4BB8A9] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    اشترك واختر الباقة المناسبة
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    اختر الباقة التي تناسب حجم متجرك وابدأ رحلة تحسين SEO
                  </p>
                </div>
                
                {/* Connector Line */}
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#4BB8A9] to-transparent"></div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#4BB8A9] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    اربط متجرك وزامن منتجاتك
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ربط سهل وسريع مع متجرك الإلكتروني ومزامنة تلقائية لجميع المنتجات
                  </p>
                </div>
                
                {/* Connector Line */}
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#4BB8A9] to-transparent"></div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#4BB8A9] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    حسّن وراقب النتائج
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    احصل على تحليلات وتوصيات فورية وشاهد تحسن ترتيب منتجاتك
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Platform Integration */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#4BB8A9]/10 text-[#4BB8A9] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>تكامل سلس مع منصات التجارة الإلكترونية</span>
              </div>

              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                متوافق مع منصات التجارة الرائدة
              </h2>

              <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                SEO Raysa مصمم ليتكامل بسلاسة مع أشهر منصات التجارة الإلكترونية في المنطقة، 
                مما يضمن لك تجربة سلسة وفعالة في تحسين SEO لمتجرك.
              </p>

              <div className="space-y-4">
                {/* Integration Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      تثبيت سهل وسريع
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      إعداد بسيط بدون أي تعقيدات تقنية
                    </p>
                  </div>
                </div>

                {/* Integration Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      مزامنة تلقائية للمنتجات
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      جميع منتجاتك تُحمل تلقائياً مع تحديثات فورية
                    </p>
                  </div>
                </div>

                {/* Integration Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      تحديثات لحظية
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      نتلقى التحديثات فوراً عند إضافة أو تعديل المنتجات
                    </p>
                  </div>
                </div>

                {/* Integration Feature 4 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      آمن 100% مع أحدث معايير الحماية
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      نستخدم أحدث تقنيات التشفير والحماية
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link to="/checkout?plan=starter" className="inline-flex items-center gap-2 bg-[#4BB8A9] text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span>ابدأ الآن</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </motion.div>

           
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              خطط أسعار شفافة ومرنة
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              اختر الباقة التي تناسب حجم متجرك وطموحاتك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                البداية
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">99</span>
                <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}> ريال/شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>حتى 50 منتج</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>تحليل SEO أساسي</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>تحديثات شهرية</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>دعم بالإيميل</span>
                </li>
              </ul>
              <Link to="/checkout?plan=starter">
                <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  ابدأ الآن
                </button>
              </Link>
            </motion.div>

            {/* Popular Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#4BB8A9] text-white px-4 py-1 rounded-full text-sm font-semibold">
                الأكثر شعبية
              </div>
              <div className={`p-8 rounded-2xl border-2 border-[#4BB8A9] ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  المتقدمة
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">199</span>
                  <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}> ريال/شهر</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>حتى 200 منتج</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>تحليل AI متقدم</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>تحسين جماعي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>تقارير أسبوعية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>دعم ذو أولوية</span>
                  </li>
                </ul>
                <Link to="/checkout?plan=advanced">
                  <button className="w-full bg-[#4BB8A9] text-gray-900 py-3 rounded-lg font-semibold hover:bg-[#6cc9b9] transition-colors">
                    اشترك الآن
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-8 rounded-2xl border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                الاحترافية
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">399</span>
                <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}> ريال/شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>منتجات غير محدودة</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>تحليل المنافسين</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>API Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>دعم 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>مدير حساب خاص</span>
                </li>
              </ul>
              <Link to="/checkout?plan=professional">
                <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  اشترك الآن
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Annual Discount */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <svg className="w-5 h-5 text-[#4BB8A9]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                وفر 20% مع الاشتراك السنوي
              </span>
            </div>
          </motion.div>

          <div className="text-center mt-8">
            <Link to="/pricing" className="text-[#4BB8A9] hover:text-[#6cc9b9] font-semibold">
              عرض جميع المميزات والمقارنة بين الباقات ←
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              الأسئلة الشائعة
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              إجابات سريعة لأكثر الأسئلة شيوعاً
            </p>
          </motion.div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                هل أحتاج لخبرة تقنية لاستخدام SEO Raysa؟
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                لا، المنصة مصممة لتكون سهلة الاستخدام. كل ما تحتاجه هو ربط متجرك والنظام سيتولى الباقي مع توصيات واضحة وسهلة التطبيق.
              </p>
            </motion.div>

            {/* FAQ 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                كم من الوقت أحتاج لرؤية النتائج؟
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                التحسينات تظهر فوراً على متجرك، لكن نتائج SEO في محركات البحث تحتاج عادة 2-4 أسابيع لتظهر بشكل ملحوظ حسب المنافسة في مجالك.
              </p>
            </motion.div>

            {/* FAQ 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                هل يمكنني تغيير الباقة في أي وقت؟
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                نعم، يمكنك الترقية أو التخفيض في أي وقت. التغييرات تصبح سارية من بداية دورة الفوترة التالية.
              </p>
            </motion.div>

            {/* FAQ 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ماذا يحدث لبياناتي إذا ألغيت الاشتراك؟
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                بياناتك تبقى آمنة ومحفوظة لمدة 30 يوماً بعد الإلغاء. يمكنك استعادة حسابك في أي وقت خلال هذه الفترة.
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="text-[#4BB8A9] hover:text-[#6cc9b9] font-semibold">
              عرض جميع الأسئلة الشائعة ←
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              جاهز لتحسين ظهور متجرك في Google؟
            </h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              انضم لمئات التجار الذين يستخدمون SEO Raysa لزيادة مبيعاتهم
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout?plan=starter" className="group">
                <button className="w-full sm:w-auto bg-[#4BB8A9] text-gray-900 font-bold py-4 px-8 rounded-lg hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                  <span>ابدأ الآن - 99 ريال/شهر</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link to="/contact" className="group">
                <button className={`w-full sm:w-auto border-2 font-bold py-4 px-8 rounded-lg transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:border-[#4BB8A9] hover:text-[#4BB8A9]' 
                    : 'border-gray-300 text-gray-700 hover:border-[#4BB8A9] hover:text-[#4BB8A9]'
                }`}>
                  تحدث مع فريق المبيعات
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>آمن 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>دعم باللغة العربية</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ضمان 7 أيام</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#4BB8A9] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SR</span>
                </div>
                <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  SEO Raysa
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                منصة تحسين محركات البحث المتخصصة للمتاجر الإلكترونية. نساعدك على الوصول لعملائك بسهولة.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                روابط سريعة
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>المميزات</Link>
                </li>
                <li>
                  <Link to="/pricing" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>الأسعار</Link>
                </li>
                <li>
                  <Link to="/blog" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>المدونة</Link>
                </li>
                <li>
                  <Link to="/about" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>من نحن</Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                الدعم
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>مركز المساعدة</Link>
                </li>
                <li>
                  <Link to="/contact" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>تواصل معنا</Link>
                </li>
                <li>
                  <Link to="/faq" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>الأسئلة الشائعة</Link>
                </li>
                <li>
                  <a href="mailto:support@seoraysa.com" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>support@seoraysa.com</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                قانوني
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>سياسة الخصوصية</Link>
                </li>
                <li>
                  <Link to="/terms" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>شروط الاستخدام</Link>
                </li>
                <li>
                  <Link to="/cookies" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>سياسة الكوكيز</Link>
                </li>
                <li>
                  <Link to="/refund" className={`text-sm hover:text-[#4BB8A9] transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>سياسة الاسترداد</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 SEO Raysa. جميع الحقوق محفوظة.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com/seoraysa" className={`hover:text-[#4BB8A9] transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/seoraysa" className={`hover:text-[#4BB8A9] transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/seoraysa" className={`hover:text-[#4BB8A9] transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}