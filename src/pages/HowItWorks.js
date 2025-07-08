import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const steps = [
    {
      number: "01",
      title: "أدخل عنوان منتجك",
      description: "ارفع أو أدخل تفاصيل منتجاتك في منصتنا",
      details: "أدخل اسم المنتج، الوصف الحالي، الصور، والكلمات المفتاحية المستهدفة. يمكنك رفع منتج واحد أو عدة منتجات دفعة واحدة.",
      icon: "📝",
      features: ["إدخال سريع وسهل", "رفع متعدد للمنتجات", "حفظ تلقائي للبيانات"]
    },
    {
      number: "02", 
      title: "تحليل ذكي فوري",
      description: "ذكاءنا الاصطناعي يحلل منتجاتك ويحدد نقاط التحسين",
      details: "نحلل المحتوى الحالي، نبحث عن أفضل الكلمات المفتاحية لمجالك، ونحدد الفرص المفقودة لتحسين ظهورك في Google.",
      icon: "🧠",
      features: ["تحليل شامل للمحتوى", "بحث كلمات مفتاحية متقدم", "تقييم SEO مفصل"]
    },
    {
      number: "03",
      title: "توليد محتوى محسّن",
      description: "إنشاء أوصاف وعناوين محسّنة لمحركات البحث تلقائياً",
      details: "نولد أوصاف منتجات احترافية، عناوين جذابة، وكلمات مفتاحية مدروسة. كل المحتوى مصمم ليرفع ترتيبك في نتائج البحث.",
      icon: "✨",
      features: ["محتوى بالذكاء الاصطناعي", "عناوين محسّنة للـ SEO", "أوصاف تسويقية فعالة"]
    },
    {
      number: "04",
      title: "انسخ وطبق على موقعك",
      description: "انسخ المحتوى المحسّن وطبقه على متجرك الإلكتروني",
      details: "احصل على المحتوى الجاهز بتنسيق سهل النسخ. طبقه على منصة متجرك (Shopify، Salla، WooCommerce، أو أي منصة أخرى) واستمتع بالنتائج.",
      icon: "📋",
      features: ["نسخ بضغطة واحدة", "تنسيق جاهز للتطبيق", "دعم جميع المنصات"]
    },
    {
      number: "05",
      title: "تتبع وتحسين مستمر",
      description: "راقب أداء منتجاتك وحسّن النتائج باستمرار",
      details: "تابع ترتيب منتجاتك في Google، احصل على توصيات للتحسين المستمر، وولّد محتوى جديد كلما احتجت.",
      icon: "📈",
      features: ["لوحة متابعة شاملة", "توصيات مستمرة", "تحديث المحتوى دورياً"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-arabic">
      {/* Navigation */}
      <nav className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="/logo3.png" alt="Logo" className="h-8 md:h-12" />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <Link to="/features" className="hover:text-[#4BB8A9] transition-colors">المميزات</Link>
          <Link to="/pricing" className="hover:text-[#4BB8A9] transition-colors">الأسعار</Link>
          <Link to="/how-it-works" className="text-[#4BB8A9] font-semibold">كيف يعمل</Link>
          <Link to="/about" className="hover:text-[#4BB8A9] transition-colors">من نحن</Link>
          <Link to="/contact" className="hover:text-[#4BB8A9] transition-colors">اتصل بنا</Link>
          <Link to="/login" className="bg-[#4BB8A9] text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-[#6cc9b9] transition">
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
                className="hover:text-[#4BB8A9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                المميزات
              </Link>
              <Link 
                to="/pricing" 
                className="hover:text-[#4BB8A9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الأسعار
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-[#4BB8A9] font-semibold py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                كيف يعمل
              </Link>
              <Link 
                to="/about" 
                className="hover:text-[#4BB8A9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link 
                to="/contact" 
                className="hover:text-[#4BB8A9] transition-colors py-2 border-b border-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              <Link 
                to="/login" 
                className="bg-[#4BB8A9] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-[#6cc9b9] transition text-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                دخول
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="w-full px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              كيف تحوّل منتجاتك إلى صدارة Google؟
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              عملية بسيطة من 5 خطوات تجعل منتجاتك تتصدر نتائج البحث وتزيد مبيعاتك
            </p>
            <div className="bg-[#4BB8A9]/10 border border-[#4BB8A9]/30 rounded-2xl p-6 mb-12">
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#4BB8A9]">
                <span className="text-2xl">⚡</span>
                <p className="text-lg font-semibold">
                  لا يتطلب خبرة تقنية - عملية بسيطة وسريعة
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="text-6xl font-bold text-[#4BB8A9]/30">{step.number}</div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-[#4BB8A9]">
                    {step.title}
                  </h3>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {step.details}
                  </p>
                  
                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                        <span className="text-[#4BB8A9]">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-md h-64 bg-gradient-to-tr from-[#4BB8A9]/20 to-transparent rounded-3xl shadow-[0_20px_60px_rgba(131,220,201,0.15)] flex items-center justify-center">
                    <div className="text-8xl opacity-50">{step.icon}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Coming Soon */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#4BB8A9]/20 to-transparent border border-[#4BB8A9]/30 rounded-2xl p-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#4BB8A9]">
              🚀 التكامل التلقائي قريباً
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              نعمل على تطوير تكامل مباشر مع Shopify، Salla، WooCommerce وجميع المنصات الرئيسية
            </p>
            <p className="text-gray-400">
              حالياً: انسخ والصق المحتوى المحسّن بسهولة | قريباً: تطبيق تلقائي بضغطة واحدة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">لماذا هذه الطريقة فعالة؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-3 text-[#4BB8A9]">مخصص لمنطقتك</h4>
              <p className="text-gray-300 text-sm">
                ذكاء اصطناعي مدرب على السوق العربي والكلمات المفتاحية المحلية
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold mb-3 text-[#4BB8A9]">سرعة مذهلة</h4>
              <p className="text-gray-300 text-sm">
                ما يأخذ أسابيع من العمل اليدوي يتم في دقائق معدودة
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold mb-3 text-[#4BB8A9]">نتائج مثبتة</h4>
              <p className="text-gray-300 text-sm">
                تحسن ملحوظ في ترتيب Google خلال أسابيع من التطبيق
              </p>
            </motion.div>
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
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز لتحسين منتجاتك؟
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              ابدأ بـ 3 منتجات مجاناً واكتشف الفرق بنفسك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/login?plan=free" className="w-full sm:w-auto">
                <button className="w-full bg-[#4BB8A9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg">
                  ابدأ مجاناً الآن
                </button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <button className="w-full border border-[#4BB8A9] text-[#4BB8A9] font-bold py-4 px-8 rounded-xl hover:bg-[#4BB8A9] hover:text-gray-900 transition text-lg">
                  عرض الأسعار
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
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">المنصة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/features" className="block text-gray-400 hover:text-white transition">المميزات</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition">الأسعار</Link>
                <Link to="/how-it-works" className="block text-[#4BB8A9] font-semibold">كيف يعمل</Link>
                <Link to="/demo" className="block text-gray-400 hover:text-white transition">تجربة تفاعلية</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الشركة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition">من نحن</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition">اتصل بنا</Link>
                <Link to="/careers" className="block text-gray-400 hover:text-white transition">الوظائف</Link>
                <Link to="/blog" className="block text-gray-400 hover:text-white transition">المدونة</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الدعم</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/faq" className="block text-gray-400 hover:text-white transition">الأسئلة الشائعة</Link>
                <Link to="/help" className="block text-gray-400 hover:text-white transition">مركز المساعدة</Link>
                <Link to="/tutorials" className="block text-gray-400 hover:text-white transition">الدروس التعليمية</Link>
                <Link to="/support" className="block text-gray-400 hover:text-white transition">الدعم الفني</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">قانوني</h4>
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
              <img src="/logo3.png" alt="Logo" className="h-6 sm:h-8" />
              <span className="text-gray-400 text-xs text-center sm:text-right">© 2025 مشروع السيو الذكي. جميع الحقوق محفوظة.</span>
            </div>
            <div className="flex space-x-3 sm:space-x-4 space-x-reverse">
              <Link to="/social/twitter" className="text-gray-400 hover:text-[#4BB8A9] transition text-xs sm:text-sm">تويتر</Link>
              <Link to="/social/linkedin" className="text-gray-400 hover:text-[#4BB8A9] transition text-xs sm:text-sm">لينكد إن</Link>
              <Link to="/social/instagram" className="text-gray-400 hover:text-[#4BB8A9] transition text-xs sm:text-sm">إنستجرام</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}