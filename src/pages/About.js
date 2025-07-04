import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const teamValues = [
    {
      icon: "🎯",
      title: "التخصص في السوق العربي",
      description: "نحن نفهم السوق العربي والمحتوى المحلي. منصتنا مصممة خصيصاً للتجار العرب ومحسّنة للكلمات المفتاحية باللغة العربية."
    },
    {
      icon: "🚀",
      title: "الابتكار التقني",
      description: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى SEO محسّن يتفوق على المنافسين ويحقق نتائج حقيقية."
    },
    {
      icon: "💡",
      title: "البساطة والفعالية",
      description: "نؤمن بأن الأدوات القوية يجب أن تكون سهلة الاستخدام. لا تحتاج خبرة تقنية لتحقيق نتائج احترافية."
    },
    {
      icon: "📈",
      title: "النتائج الملموسة",
      description: "هدفنا زيادة مبيعاتك الفعلية. كل ميزة نطورها مصممة لتحسين ترتيبك في Google وزيادة الزيارات المؤهلة."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "بداية الرؤية",
      description: "انطلقت فكرة المنصة من تحدي حقيقي واجهه التجار العرب في تحسين ظهور منتجاتهم"
    },
    {
      year: "2025",
      title: "إطلاق المنصة",
      description: "إطلاق النسخة الأولى بميزات توليد المحتوى الذكي والتحليل المتقدم"
    },
    {
      year: "قريباً",
      title: "التكامل التلقائي",
      description: "تطوير التكامل المباشر مع جميع منصات التجارة الإلكترونية الرئيسية"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-arabic">
      {/* Navigation */}
      <nav className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="/logo22.png" alt="Logo" className="h-8 md:h-12" />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <Link to="/features" className="hover:text-[#83dcc9] transition-colors">المميزات</Link>
          <Link to="/pricing" className="hover:text-[#83dcc9] transition-colors">الأسعار</Link>
          <Link to="/how-it-works" className="hover:text-[#83dcc9] transition-colors">كيف يعمل</Link>
          <Link to="/about" className="text-[#83dcc9] font-semibold">من نحن</Link>
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
                className="hover:text-[#83dcc9] transition-colors py-2 border-b border-gray-700"
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
                className="text-[#83dcc9] font-semibold py-2 border-b border-gray-700"
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
              نحن نؤمن بقوة التجارة العربية
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              منصة متخصصة في تحسين ظهور المنتجات العربية في محركات البحث. نساعد التجار على تحقيق أحلامهم وبناء أعمال مستدامة ومربحة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-right"
            >
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#83dcc9]">رسالتنا</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                تمكين التجار العرب من الوصول إلى صدارة Google وتحقيق مبيعات استثنائية من خلال تقنيات الذكاء الاصطناعي المتطورة وفهم عميق للسوق المحلي.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-right"
            >
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#83dcc9]">رؤيتنا</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                أن نكون المنصة الرائدة في المنطقة العربية لتحسين التجارة الإلكترونية، ونساهم في بناء اقتصاد رقمي عربي قوي ومزدهر.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">قيمنا ومبادئنا</h2>
            <p className="text-xl text-gray-300">المبادئ التي توجه عملنا وتطوير منصتنا</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-8 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-[#83dcc9]">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">رحلتنا</h2>
            <p className="text-xl text-gray-300">من الفكرة إلى المنصة الرائدة</p>
          </motion.div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 text-center md:text-right">
                  <div className="text-4xl font-bold text-[#83dcc9] mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
                </div>
                <div className="w-4 h-4 bg-[#83dcc9] rounded-full flex-shrink-0"></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Leader Section */}
      <section className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">فريق العمل</h2>
            
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-2xl">
              <div className="w-24 h-24 bg-gradient-to-r from-[#83dcc9] to-[#6cc9b9] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl text-gray-900 font-bold">ع</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#83dcc9]">علي مبارك</h3>
              <p className="text-lg text-gray-300 mb-4">مؤسس ومطور المنصة</p>
              <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                متخصص في نمو المتاجر الإلكترونية مع خبرة واسعة في التسويق الرقمي وتحسين محركات البحث. 
                يقود فريق تطوير المنصة بشغف لمساعدة التجار العرب على تحقيق النجاح.
              </p>
            </div>
          </motion.div>
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
              انضم إلى رحلة النجاح
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              كن جزءاً من مجتمع التجار الذين يحققون نتائج استثنائية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/login?plan=free" className="w-full sm:w-auto">
                <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg">
                  ابدأ رحلتك مجاناً
                </button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition text-lg">
                  تواصل معنا
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
                <Link to="/features" className="block text-gray-400 hover:text-white transition">المميزات</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition">الأسعار</Link>
                <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition">كيف يعمل</Link>
                <Link to="/demo" className="block text-gray-400 hover:text-white transition">تجربة تفاعلية</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">الشركة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/about" className="block text-[#83dcc9] font-semibold">من نحن</Link>
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