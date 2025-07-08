import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from '../contexts/ThemeContext';
import PublicNavbar from '../components/navbars/PublicNavbar';

export default function About() {
  const { theme, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const teamValues = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: "التخصص في السوق العربي",
      description: "نحن نفهم السوق العربي والمحتوى المحلي. منصتنا مصممة خصيصاً للتجار العرب ومحسّنة للكلمات المفتاحية باللغة العربية."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "الابتكار التقني",
      description: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتوليد محتوى SEO محسّن يتفوق على المنافسين ويحقق نتائج حقيقية."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "البساطة والفعالية",
      description: "نؤمن بأن الأدوات القوية يجب أن تكون سهلة الاستخدام. لا تحتاج خبرة تقنية لتحقيق نتائج احترافية."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
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
            <h1 className={`text-3xl md:text-5xl font-extrabold mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              نحن نؤمن بقوة التجارة العربية
            </h1>
            <p className={`text-xl mb-8 leading-relaxed max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              منصة متخصصة في تحسين ظهور المنتجات العربية في محركات البحث. نساعد التجار على تحقيق أحلامهم وبناء أعمال مستدامة ومربحة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-right"
            >
              <div className="text-6xl mb-6">
                <svg className="w-16 h-16 mx-auto text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4BB8A9]">رسالتنا</h2>
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
              <div className="text-6xl mb-6">
                <svg className="w-16 h-16 mx-auto text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4BB8A9]">رؤيتنا</h2>
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                أن نكون المنصة الرائدة في المنطقة العربية لتحسين التجارة الإلكترونية، ونساهم في بناء اقتصاد رقمي عربي قوي ومزدهر.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
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
            }`}>قيمنا ومبادئنا</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              المبادئ التي توجه عملنا وتطوير منصتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl hover:shadow-xl transition-shadow ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-5xl mb-4 text-[#4BB8A9]">{value.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-[#4BB8A9]">{value.title}</h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
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
            }`}>رحلتنا</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              من الفكرة إلى المنصة الرائدة
            </p>
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
                  <div className="text-4xl font-bold text-[#4BB8A9] mb-2">{milestone.year}</div>
                  <h3 className={`text-xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{milestone.title}</h3>
                  <p className={`leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{milestone.description}</p>
                </div>
                <div className="w-4 h-4 bg-[#4BB8A9] rounded-full flex-shrink-0"></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Leader Section */}
      

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
              انضم إلى رحلة النجاح
            </h2>
            <p className={`text-xl mb-8 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              كن جزءاً من مجتمع التجار الذين يحققون نتائج استثنائية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout?plan=starter" className="w-full sm:w-auto">
                <button className="w-full bg-[#4BB8A9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
                  ابدأ الآن - 99 ريال/شهر
                </button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className={`w-full border-2 border-[#4BB8A9] font-bold py-3 px-6 rounded-xl transition whitespace-nowrap ${
                  isDark 
                    ? 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-gray-900' 
                    : 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-white'
                }`}>
                  تواصل معنا
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
                <Link to="/features" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>المميزات</Link>
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
                <Link to="/about" className="block text-[#4BB8A9] font-semibold">من نحن</Link>
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