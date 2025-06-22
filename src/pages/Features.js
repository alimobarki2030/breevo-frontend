import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function FeaturesPage() {
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
      title: "دعم متعدد المنصات",
      description: "يعمل مع جميع منصات التجارة الإلكترونية العربية والعالمية"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-arabic">
      {/* Navigation */}
      <nav className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="/logo2.png" alt="Logo" className="h-8 md:h-12" />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <Link to="/features" className="text-[#83dcc9] font-semibold">المميزات</Link>
          <Link to="/pricing" className="hover:text-[#83dcc9] transition-colors">الأسعار</Link>
          <Link to="/how-it-works" className="hover:text-[#83dcc9] transition-colors">كيف يعمل</Link>
          <Link to="/about" className="hover:text-[#83dcc9] transition-colors">من نحن</Link>
          <Link to="/contact" className="hover:text-[#83dcc9] transition-colors">اتصل بنا</Link>
          <Link to="/login" className="bg-[#83dcc9] text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-[#6cc9b9] transition">
            دخول
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 bg-gray-900 border border-gray-700 rounded-xl mt-2 py-4 px-4 shadow-2xl z-40"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/features" 
                className="text-[#83dcc9] font-semibold py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                المميزات
              </Link>
              <Link 
                to="/pricing" 
                className="hover:text-[#83dcc9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الأسعار
              </Link>
              <Link 
                to="/how-it-works" 
                className="hover:text-[#83dcc9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                كيف يعمل
              </Link>
              <Link 
                to="/about" 
                className="hover:text-[#83dcc9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-[#83dcc9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              <Link 
                to="/login" 
                className="bg-[#83dcc9] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-[#6cc9b9] transition text-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                دخول
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="w-full px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              مميزات تجعل منتجاتك تتفوق على المنافسين
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              أدوات متطورة وذكاء اصطناعي متخصص لتحسين ظهور منتجاتك في محركات البحث
            </p>
            <div className="bg-[#83dcc9]/10 border border-[#83dcc9]/30 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#83dcc9]">
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#83dcc9] mb-2">
                      {feature.title}
                    </h2>
                    <p className="text-lg text-gray-400 mb-4">{feature.subtitle}</p>
                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <div className="bg-[#83dcc9]/10 border border-[#83dcc9]/30 rounded-xl p-4">
                    <p className="text-[#83dcc9] font-semibold">✨ {feature.highlight}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                        <span className="text-[#83dcc9] text-lg">✓</span>
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-md h-80 bg-gradient-to-tr from-[#83dcc9]/20 to-transparent rounded-3xl shadow-[0_20px_60px_rgba(131,220,201,0.15)] flex items-center justify-center border border-[#83dcc9]/20">
                    <div className="text-center">
                      <div className="text-8xl opacity-60 mb-4">{feature.icon}</div>
                      <div className="text-sm text-gray-400">معاينة الميزة</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">مميزات إضافية قوية</h2>
            <p className="text-xl text-gray-300">أدوات متطورة لتعزيز أداء متجرك</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#83dcc9]">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">الطريقة التقليدية مقابل منصتنا</h2>
            <p className="text-xl text-gray-300">اكتشف كيف نوفر عليك الوقت والجهد</p>
          </motion.div>

          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-700 p-4 text-center font-bold">
              <div></div>
              <div className="text-gray-300">الطريقة التقليدية</div>
              <div className="text-[#83dcc9]">منصتنا</div>
            </div>
            
            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 p-4 border-b border-gray-700 last:border-b-0"
              >
                <div className="font-semibold text-gray-300 text-right pr-4">{item.aspect}</div>
                <div className="text-gray-400 text-center">{item.manual}</div>
                <div className="text-[#83dcc9] text-center font-medium">{item.platform}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#83dcc9]/20 to-transparent border border-[#83dcc9]/30 rounded-2xl p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جرب جميع المميزات مجاناً
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              ابدأ بـ 3 منتجات مجانية واختبر قوة منصتنا بنفسك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/login?plan=free" className="w-full sm:w-auto">
                <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg">
                  ابدأ التجربة المجانية
                </button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition text-lg">
                  شاهد كيف يعمل
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-gray-700 bg-gray-900">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm mb-6 sm:mb-8">
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">المنصة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/features" className="block text-[#83dcc9] font-semibold">المميزات</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition">الأسعار</Link>
                <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition">كيف يعمل</Link>
                <Link to="/demo" className="block text-gray-400 hover:text-white transition">تجربة تفاعلية</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">الشركة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition">من نحن</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition">اتصل بنا</Link>
                <Link to="/careers" className="block text-gray-400 hover:text-white transition">الوظائف</Link>
                <Link to="/blog" className="block text-gray-400 hover:text-white transition">المدونة</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">الدعم</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/faq" className="block text-gray-400 hover:text-white transition">الأسئلة الشائعة</Link>
                <Link to="/help" className="block text-gray-400 hover:text-white transition">مركز المساعدة</Link>
                <Link to="/tutorials" className="block text-gray-400 hover:text-white transition">الدروس التعليمية</Link>
                <Link to="/support" className="block text-gray-400 hover:text-white transition">الدعم الفني</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">قانوني</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition">سياسة الخصوصية</Link>
                <Link to="/terms" className="block text-gray-400 hover:text-white transition">شروط الخدمة</Link>
                <Link to="/cookies" className="block text-gray-400 hover:text-white transition">سياسة ملفات تعريف الارتباط</Link>
                <Link to="/refund" className="block text-gray-400 hover:text-white transition">سياسة الاسترداد</Link>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-700 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <img src="/logo2.png" alt="Logo" className="h-6 sm:h-8" />
              <span className="text-gray-400 text-xs text-center sm:text-right">© 2025 مشروع السيو الذكي. جميع الحقوق محفوظة.</span>
            </div>
            <div className="flex space-x-3 sm:space-x-4 space-x-reverse">
              <Link to="/social/twitter" className="text-gray-400 hover:text-[#83dcc9] transition text-xs sm:text-sm">تويتر</Link>
              <Link to="/social/linkedin" className="text-gray-400 hover:text-[#83dcc9] transition text-xs sm:text-sm">لينكد إن</Link>
              <Link to="/social/instagram" className="text-gray-400 hover:text-[#83dcc9] transition text-xs sm:text-sm">إنستجرام</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}