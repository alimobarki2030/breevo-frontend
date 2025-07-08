import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from '../contexts/ThemeContext';
import PublicNavbar from '../components/navbars/PublicNavbar';

export default function FeaturesPage() {
  const { theme, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainFeatures = [
    {
      icon: "⚡",
      title: "توليد تلقائي للمحتوى",
      subtitle: "ذكاء اصطناعي متخصص في السوق العربي",
      description: "اكتب أوصاف منتجات احترافية ومحسّنة لمحركات البحث في ثوان معدودة",
      benefits: [
        "كتابة أوصاف منتجات جذابة وتسويقية",
        "اختيار أفضل الكلمات المفتاحية للسوق العربي",
        "عناوين محسّنة تزيد معدل النقر",
        "محتوى مخصص لكل منتج حسب فئته",
        "لغة عربية سليمة وطبيعية"
      ],
      highlight: "يوفر عليك 90% من وقت كتابة المحتوى"
    },
    {
      icon: "📊",
      title: "مؤشرات SEO فورية",
      subtitle: "تحليل شامل ومفصل لكل منتج",
      description: "احصل على تقييم كامل لأداء SEO منتجاتك مع توصيات للتحسين",
      benefits: [
        "تحليل الكلمات المفتاحية والمنافسة",
        "تقييم جودة العناوين والأوصاف",
        "فحص الصور وتحسين ALT Text",
        "تحليل البنية والتصنيفات",
        "نصائح مخصصة لكل منتج"
      ],
      highlight: "تحسن ترتيبك في Google خلال أسابيع"
    },
    {
      icon: "📈",
      title: "لوحة تحكم متقدمة",
      subtitle: "متابعة شاملة لأداء منتجاتك",
      description: "راقب تقدم منتجاتك وتتبع النتائج من مكان واحد",
      benefits: [
        "إحصائيات مفصلة لكل منتج",
        "متابعة ترتيب الكلمات المفتاحية",
        "تقارير الأداء الدورية",
        "مقارنة مع المنافسين",
        "توصيات التحسين المستمر"
      ],
      highlight: "رؤية واضحة لنمو أعمالك"
    }
  ];

  const additionalFeatures = [
    {
      icon: "🎯",
      title: "بحث الكلمات المفتاحية المتقدم",
      description: "اكتشف أفضل الكلمات المفتاحية لمنتجاتك في السوق العربي"
    },
    {
      icon: "🔍",
      title: "تحليل المنافسين",
      description: "ادرس استراتيجيات منافسيك واكتشف الفرص المفقودة"
    },
    {
      icon: "📝",
      title: "محرر المحتوى الذكي",
      description: "حرر وطور المحتوى المولد حسب احتياجاتك الخاصة"
    },
    {
      icon: "🌐",
      title: "تكامل سلس مع متجرك",
      description: "ربط مباشر وسهل مع متجرك الإلكتروني لتحسين جميع منتجاتك"
    },
    {
      icon: "📱",
      title: "تطبيق موبايل قريباً",
      description: "إدارة منتجاتك وتتبع الأداء من هاتفك المحمول"
    },
    {
      icon: "🤖",
      title: "تحديثات الذكاء الاصطناعي",
      description: "تحسينات مستمرة للخوارزميات وجودة المحتوى المولد"
    }
  ];

  const comparisonData = [
    {
      aspect: "كتابة أوصاف المنتجات",
      manual: "ساعات من العمل اليدوي",
      platform: "ثوان معدودة بالذكاء الاصطناعي"
    },
    {
      aspect: "البحث عن الكلمات المفتاحية",
      manual: "بحث يدوي محدود ومضيع للوقت",
      platform: "بحث متقدم وتحليل شامل"
    },
    {
      aspect: "تحليل المنافسين",
      manual: "صعب ويتطلب خبرة تقنية",
      platform: "تحليل تلقائي ومفصل"
    },
    {
      aspect: "متابعة الأداء",
      manual: "متابعة يدوية غير دقيقة",
      platform: "تتبع تلقائي وتقارير دورية"
    }
  ];

  return (
    <div className={`min-h-screen font-arabic transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="w-full px-4 pt-24 pb-16 lg:pt-32 lg:pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-normal ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              مميزات تجعل منتجاتك 
              <span className="block mt-2">تتفوق على المنافسين</span>
            </h1>
            <p className={`text-xl mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              أدوات متطورة وذكاء اصطناعي متخصص لتحسين ظهور منتجاتك في محركات البحث
            </p>
            <div className={`rounded-2xl p-6 ${
              isDark 
                ? 'bg-[#4BB8A9]/10 border border-[#4BB8A9]/30' 
                : 'bg-[#4BB8A9]/10 border border-[#4BB8A9]/40'
            }`}>
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#4BB8A9]">
                <span className="text-2xl">🚀</span>
                <p className="text-lg font-semibold">
                  جميع الأدوات التي تحتاجها في مكان واحد
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-5xl">{feature.icon}</div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4BB8A9] mb-2">
                      {feature.title}
                    </h2>
                    <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.subtitle}
                    </p>
                    <p className={`text-xl leading-relaxed mb-6 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature.description}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${
                    isDark 
                      ? 'bg-[#4BB8A9]/10 border border-[#4BB8A9]/30' 
                      : 'bg-[#4BB8A9]/10 border border-[#4BB8A9]/40'
                  }`}>
                    <p className="text-[#4BB8A9] font-semibold">✨ {feature.highlight}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                        <span className="text-[#4BB8A9] text-lg">✓</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <div className={`w-full max-w-md h-80 rounded-3xl flex items-center justify-center ${
                    isDark 
                      ? 'bg-gradient-to-tr from-[#4BB8A9]/20 to-transparent shadow-[0_20px_60px_rgba(131,220,201,0.15)] border border-[#4BB8A9]/20' 
                      : 'bg-gradient-to-tr from-[#4BB8A9]/10 to-transparent shadow-lg border border-[#4BB8A9]/30'
                  }`}>
                    <div className="text-center">
                      <div className="text-8xl opacity-60 mb-4">{feature.icon}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        معاينة الميزة
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              مميزات إضافية قوية
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              أدوات متطورة لتعزيز أداء متجرك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#4BB8A9]">{feature.title}</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              الطريقة التقليدية مقابل منصتنا
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              اكتشف كيف نوفر عليك الوقت والجهد
            </p>
          </motion.div>

          <div className={`rounded-2xl overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`grid grid-cols-3 p-4 text-center font-bold ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div></div>
              <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>الطريقة التقليدية</div>
              <div className="text-[#4BB8A9]">منصتنا</div>
            </div>
            
            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid grid-cols-3 p-4 border-b last:border-b-0 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className={`font-semibold text-right pr-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.aspect}
                </div>
                <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.manual}
                </div>
                <div className="text-[#4BB8A9] text-center font-medium">{item.platform}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`w-full px-4 py-16 text-center ${
        isDark ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-8 ${
              isDark 
                ? 'bg-gradient-to-r from-[#4BB8A9]/20 to-transparent border border-[#4BB8A9]/30' 
                : 'bg-gradient-to-r from-[#4BB8A9]/10 to-transparent border border-[#4BB8A9]/40'
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              ابدأ رحلة تحسين SEO لمتجرك
            </h2>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              احصل على جميع المميزات المتقدمة وحسّن ظهور منتجاتك في محركات البحث
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout?plan=starter" className="w-full sm:w-auto">
                <button className="w-full bg-[#4BB8A9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
                  ابدأ الآن - 99 ريال/شهر
                </button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <button className={`w-full border-2 border-[#4BB8A9] font-bold py-3 px-6 rounded-xl transition whitespace-nowrap ${
                  isDark 
                    ? 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-gray-900' 
                    : 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-white'
                }`}>
                  عرض جميع الباقات
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 sm:py-12 px-4 sm:px-6 border-t ${
        isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm mb-6 sm:mb-8">
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">المنصة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/features" className="block text-[#4BB8A9] font-semibold">المميزات</Link>
                <Link to="/pricing" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>الأسعار</Link>
                
                <Link to="/demo" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>تجربة تفاعلية</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الشركة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/about" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>من نحن</Link>
                <Link to="/contact" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>اتصل بنا</Link>
                <Link to="/careers" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>الوظائف</Link>
                <Link to="/blog" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>المدونة</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الدعم</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/faq" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>الأسئلة الشائعة</Link>
                <Link to="/help" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>مركز المساعدة</Link>
                <Link to="/tutorials" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>الدروس التعليمية</Link>
                <Link to="/support" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>الدعم الفني</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">قانوني</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/privacy" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>سياسة الخصوصية</Link>
                <Link to="/terms" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>شروط الخدمة</Link>
                <Link to="/cookies" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>سياسة ملفات تعريف الارتباط</Link>
                <Link to="/refund" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>سياسة الاسترداد</Link>
              </div>
            </div>
          </div>
          
          <div className={`flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t space-y-4 sm:space-y-0 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <img src="/logo3.png" alt="Logo" className="h-6 sm:h-8" />
              <span className={`text-xs text-center sm:text-right ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>© 2025 مشروع السيو الذكي. جميع الحقوق محفوظة.</span>
            </div>
            <div className="flex space-x-3 sm:space-x-4 space-x-reverse">
              <Link to="/social/twitter" className={`transition text-xs sm:text-sm ${
                isDark ? 'text-gray-400 hover:text-[#4BB8A9]' : 'text-gray-600 hover:text-[#4BB8A9]'
              }`}>تويتر</Link>
              <Link to="/social/linkedin" className={`transition text-xs sm:text-sm ${
                isDark ? 'text-gray-400 hover:text-[#4BB8A9]' : 'text-gray-600 hover:text-[#4BB8A9]'
              }`}>لينكد إن</Link>
              <Link to="/social/instagram" className={`transition text-xs sm:text-sm ${
                isDark ? 'text-gray-400 hover:text-[#4BB8A9]' : 'text-gray-600 hover:text-[#4BB8A9]'
              }`}>إنستجرام</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}