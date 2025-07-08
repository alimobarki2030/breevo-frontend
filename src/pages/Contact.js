import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from '../contexts/ThemeContext';
import PublicNavbar from '../components/navbars/PublicNavbar';

export default function ContactPage() {
  const { theme, isDark } = useTheme();
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
      icon: (
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "البريد الإلكتروني",
      description: "للاستفسارات المفصلة والدعم الشامل",
      contact: "support@seoraysa.com",
      responseTime: "دعم متواصل 24/7"
    },
    {
      icon: (
        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      title: "واتساب",
      description: "للدعم السريع والاستشارات الفورية",
      contact: "+966555736427",
      responseTime: "متاح 24/7 - رد فوري"
    }
  ];

  const supportTypes = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "بدء استخدام المنصة",
      description: "مساعدة في إعداد حسابك والخطوات الأولى"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "مشاكل تقنية",
      description: "حل المشاكل والأخطاء التقنية"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "الفواتير والاشتراكات",
      description: "استفسارات حول الدفع والباقات"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "اقتراحات وتطوير",
      description: "أفكارك لتحسين المنصة"
    }
  ];

  const faqs = [
    {
      question: "كم من الوقت يستغرق توليد المحتوى؟",
      answer: "عادة أقل من 30 ثانية لكل منتج مع تحليل SEO كامل"
    },
    {
      question: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
      answer: "نعم، يمكنك إلغاء الاشتراك في أي وقت بدون أي رسوم إضافية"
    },
    {
      question: "هل تدعمون جميع منصات التجارة الإلكترونية؟",
      answer: "نتكامل مباشرة مع منصة سلة، وباقي المنصات عبر التصدير والاستيراد"
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
              نحن هنا لمساعدتك في النجاح
            </h1>
            <p className={`text-xl mb-8 leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              فريق دعم متخصص جاهز للإجابة على استفساراتك ومساعدتك في تحقيق أهدافك
            </p>
            <div className={`rounded-2xl p-6 ${
              isDark 
                ? 'bg-[#4BB8A9]/10 border border-[#4BB8A9]/30' 
                : 'bg-[#4BB8A9]/10 border border-[#4BB8A9]/40'
            }`}>
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#4BB8A9]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-semibold">
                  دعم متاح 24/7 - نحن دائماً هنا لمساعدتك
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
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
            }`}>طرق التواصل</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              اختر الطريقة الأنسب لك - نحن متاحون دائماً
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl text-center hover:shadow-xl transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="text-[#4BB8A9] mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#4BB8A9]">{method.title}</h3>
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {method.description}
                </p>
                <p className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{method.contact}</p>
                <p className="text-sm text-[#4BB8A9]">{method.responseTime}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>أرسل لنا رسالة</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              نحب أن نسمع منك ونساعدك في رحلتك
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className={`p-8 rounded-2xl space-y-6 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'
            }`}
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
                  className={`w-full p-3 rounded-lg focus:border-[#4BB8A9] focus:outline-none transition ${
                    isDark 
                      ? 'bg-gray-700 border border-gray-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
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
                  className={`w-full p-3 rounded-lg focus:border-[#4BB8A9] focus:outline-none transition ${
                    isDark 
                      ? 'bg-gray-700 border border-gray-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
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
                className={`w-full p-3 rounded-lg focus:border-[#4BB8A9] focus:outline-none transition ${
                  isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-900'
                }`}
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
                className={`w-full p-3 rounded-lg focus:border-[#4BB8A9] focus:outline-none transition ${
                  isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-900'
                }`}
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
                className={`w-full p-3 rounded-lg focus:border-[#4BB8A9] focus:outline-none transition resize-none ${
                  isDark 
                    ? 'bg-gray-700 border border-gray-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-900'
                }`}
                placeholder="اكتب رسالتك هنا..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#4BB8A9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                إرسال الرسالة
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Support Types */}
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
            }`}>كيف يمكننا مساعدتك؟</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              نوفر دعم شامل لجميع احتياجاتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportTypes.map((support, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl hover:shadow-xl transition-all ${
                  isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="text-[#4BB8A9]">{support.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#4BB8A9] mb-2">{support.title}</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {support.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQs */}
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
            }`}>أسئلة شائعة</h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              إجابات سريعة لأكثر الأسئلة شيوعاً
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <h3 className="text-lg font-bold text-[#4BB8A9] mb-3">{faq.question}</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/faq">
              <button className={`border-2 border-[#4BB8A9] font-bold py-3 px-6 rounded-xl transition ${
                isDark 
                  ? 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-gray-900' 
                  : 'text-[#4BB8A9] hover:bg-[#4BB8A9] hover:text-white'
              }`}>
                عرض جميع الأسئلة الشائعة
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 24/7 Support Section */}
      <section className={`w-full px-4 py-16 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
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
            }`}>التزامنا بدعمك</h2>
            
          

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <svg className="w-12 h-12 mx-auto mb-3 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold mb-2 text-[#4BB8A9]">متاحون دائماً</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  نسعى للرد بأسرع وقت ممكن
                </p>
              </div>
              <div className="p-4">
                <svg className="w-12 h-12 mx-auto mb-3 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="font-bold mb-2 text-[#4BB8A9]">نهتم بنجاحك</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  نجاحك هو نجاحنا ونعمل من أجل ذلك
                </p>
              </div>
              <div className="p-4">
                <svg className="w-12 h-12 mx-auto mb-3 text-[#4BB8A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-bold mb-2 text-[#4BB8A9]">تطوير مستمر</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  نحسن المنصة بناءً على احتياجاتك
                </p>
              </div>
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
                <Link to="/about" className={`block transition ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>من نحن</Link>
                <Link to="/contact" className="block text-[#4BB8A9] font-semibold">اتصل بنا</Link>
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