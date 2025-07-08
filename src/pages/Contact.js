import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "البريد الإلكتروني",
      description: "للاستفسارات العامة والدعم التقني",
      contact: "support@seo-platform.com",
      responseTime: "نرد خلال 24 ساعة"
    },
    {
      icon: "💬",
      title: "الدردشة المباشرة",
      description: "للحصول على مساعدة فورية",
      contact: "متاح في المنصة",
      responseTime: "رد فوري أثناء ساعات العمل"
    },
    {
      icon: "📱",
      title: "واتساب",
      description: "للدعم السريع والاستشارات",
      contact: "+966 50 123 4567",
      responseTime: "نرد خلال ساعة واحدة"
    }
  ];

  const supportTypes = [
    {
      icon: "🚀",
      title: "بدء استخدام المنصة",
      description: "مساعدة في إعداد حسابك والخطوات الأولى"
    },
    {
      icon: "🔧",
      title: "مشاكل تقنية",
      description: "حل المشاكل والأخطاء التقنية"
    },
    {
      icon: "💰",
      title: "الفواتير والاشتراكات",
      description: "استفسارات حول الدفع والباقات"
    },
    {
      icon: "💡",
      title: "اقتراحات وتطوير",
      description: "أفكارك لتحسين المنصة"
    }
  ];

  const faqs = [
    {
      question: "كم من الوقت يستغرق توليد المحتوى؟",
      answer: "عادة أقل من دقيقة واحدة لكل منتج"
    },
    {
      question: "هل يمكنني تجربة المنصة مجاناً؟",
      answer: "نعم، نوفر 3 منتجات مجانية للتجربة"
    },
    {
      question: "هل تدعمون منصة متجري؟",
      answer: "ندعم جميع المنصات عبر النسخ واللصق، والتكامل المباشر قريباً"
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
          <Link to="/how-it-works" className="hover:text-[#4BB8A9] transition-colors">كيف يعمل</Link>
          <Link to="/about" className="hover:text-[#4BB8A9] transition-colors">من نحن</Link>
          <Link to="/contact" className="text-[#4BB8A9] font-semibold">اتصل بنا</Link>
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
                className="hover:text-[#4BB8A9] transition-colors py-2 border-b border-gray-700"
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
                className="text-[#4BB8A9] font-semibold py-2 border-b border-gray-700"
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
      <section className="w-full px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              نحن هنا لمساعدتك في النجاح
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              فريق دعم متخصص جاهز للإجابة على استفساراتك ومساعدتك في تحقيق أهدافك
            </p>
            <div className="bg-[#4BB8A9]/10 border border-[#4BB8A9]/30 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#4BB8A9]">
                <span className="text-2xl">⚡</span>
                <p className="text-lg font-semibold">
                  نرد على جميع الاستفسارات خلال 24 ساعة
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">طرق التواصل</h2>
            <p className="text-xl text-gray-300">اختر الطريقة الأنسب لك</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-8 rounded-2xl text-center hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#4BB8A9]">{method.title}</h3>
                <p className="text-gray-400 mb-4">{method.description}</p>
                <p className="text-lg font-semibold mb-2">{method.contact}</p>
                <p className="text-sm text-[#4BB8A9]">{method.responseTime}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">أرسل لنا رسالة</h2>
            <p className="text-xl text-gray-300">نحب أن نسمع منك ونساعدك في رحلتك</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-gray-800 p-8 rounded-2xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#4BB8A9]">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#4BB8A9] focus:outline-none transition"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#4BB8A9]">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#4BB8A9] focus:outline-none transition"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#4BB8A9]">
                نوع الاستفسار
              </label>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#4BB8A9] focus:outline-none transition"
              >
                <option value="general">استفسار عام</option>
                <option value="technical">مشكلة تقنية</option>
                <option value="billing">الفواتير والاشتراكات</option>
                <option value="feature">طلب ميزة جديدة</option>
                <option value="partnership">شراكة أو تعاون</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#4BB8A9]">
                الموضوع *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#4BB8A9] focus:outline-none transition"
                placeholder="موضوع رسالتك"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#4BB8A9]">
                الرسالة *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#4BB8A9] focus:outline-none transition resize-none"
                placeholder="اكتب رسالتك هنا..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#4BB8A9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg"
              >
                إرسال الرسالة
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Support Types */}
      <section className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">كيف يمكننا مساعدتك؟</h2>
            <p className="text-xl text-gray-300">نوفر دعم شامل لجميع احتياجاتك</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportTypes.map((support, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-2xl hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="text-4xl">{support.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4BB8A9] mb-2">{support.title}</h3>
                    <p className="text-gray-300">{support.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQs */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">أسئلة شائعة</h2>
            <p className="text-xl text-gray-300">إجابات سريعة لأكثر الأسئلة شيوعاً</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-xl"
              >
                <h3 className="text-lg font-bold text-[#4BB8A9] mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/faq">
              <button className="border border-[#4BB8A9] text-[#4BB8A9] font-bold py-3 px-6 rounded-xl hover:bg-[#4BB8A9] hover:text-gray-900 transition">
                عرض جميع الأسئلة الشائعة
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#4BB8A9]/20 to-transparent border border-[#4BB8A9]/30 rounded-2xl p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">ساعات العمل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
              <div>
                <h3 className="font-bold text-[#4BB8A9] mb-2">الدعم الفني</h3>
                <p className="text-gray-300">الأحد - الخميس: 9:00 ص - 6:00 م</p>
                <p className="text-gray-300">الجمعة - السبت: 10:00 ص - 4:00 م</p>
              </div>
              <div>
                <h3 className="font-bold text-[#4BB8A9] mb-2">الرد على الإيميل</h3>
                <p className="text-gray-300">24/7 - نرد خلال 24 ساعة</p>
                <p className="text-gray-300">طوارئ: استجابة فورية</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              جميع الأوقات بتوقيت المملكة العربية السعودية (UTC+3)
            </p>
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
                <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition">كيف يعمل</Link>
                <Link to="/demo" className="block text-gray-400 hover:text-white transition">تجربة تفاعلية</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الشركة</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition">من نحن</Link>
                <Link to="/contact" className="block text-[#4BB8A9] font-semibold">اتصل بنا</Link>
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