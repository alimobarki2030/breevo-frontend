import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNavbar from '../components/navbars/PublicNavbar';

export default function FAQPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  <PublicNavbar />

  const toggleQuestion = (questionId) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'البداية واستخدام المنصة',
      icon: '🚀',
      questions: [
        {
          id: 'q1',
          question: 'كيف أبدأ استخدام المنصة؟',
          answer: 'بعد التسجيل، يمكنك البدء فوراً بإدخال تفاصيل منتجك الأول. ستحصل على 3 منتجات مجانية للتجربة. ما عليك سوى كتابة اسم المنتج والوصف الحالي، وسنولد لك محتوى محسّن خلال ثوانٍ.'
        },
        {
          id: 'q2',
          question: 'ما المعلومات التي أحتاج لإدخالها عن منتجي؟',
          answer: 'تحتاج إلى: اسم المنتج، الوصف الحالي (إن وجد)، فئة المنتج، والكلمات المفتاحية المستهدفة (اختيارية). كلما كانت المعلومات أكثر تفصيلاً، كان المحتوى المولد أفضل وأكثر دقة.'
        },
        {
          id: 'q3',
          question: 'كم من الوقت يستغرق توليد المحتوى؟',
          answer: 'عادة أقل من دقيقة واحدة لكل منتج. قد يستغرق وقتاً أطول قليلاً للمنتجات المعقدة أو التي تتطلب بحث متعمق عن الكلمات المفتاحية.'
        },
        {
          id: 'q4',
          question: 'هل يمكنني تعديل المحتوى المولد؟',
          answer: 'نعم بالطبع! المحتوى المولد هو نقطة انطلاق ممتازة، ويمكنك تعديله وتخصيصه حسب احتياجاتك. ننصح بمراجعة المحتوى وإضافة لمستك الشخصية قبل نشره.'
        }
      ]
    },
    {
      id: 'pricing-billing',
      title: 'الأسعار والفواتير',
      icon: '💰',
      questions: [
        {
          id: 'q5',
          question: 'هل التجربة المجانية تتطلب بطاقة ائتمانية؟',
          answer: 'لا، التجربة المجانية لا تتطلب بطاقة ائتمانية. يمكنك تجربة المنصة بـ 3 منتجات مجانية دون أي التزام مالي.'
        },
        {
          id: 'q6',
          question: 'متى يتم تجديد الاشتراك؟',
          answer: 'يتم تجديد الاشتراك تلقائياً كل شهر في نفس تاريخ بداية الاشتراك. ستحصل على تذكير قبل التجديد بـ 3 أيام، ويمكنك إلغاء الاشتراك في أي وقت.'
        },
        {
          id: 'q7',
          question: 'هل يمكنني ترقية أو تخفيض باقتي؟',
          answer: 'نعم، يمكنك تغيير باقتك في أي وقت. عند الترقية، ستدفع الفرق لباقي الشهر الحالي. عند التخفيض، سيطبق التغيير في الدورة التالية.'
        },
        {
          id: 'q8',
          question: 'ما هي سياسة الاسترداد؟',
          answer: 'نوفر ضمان استرداد كامل خلال 30 يوم من بداية الاشتراك المدفوع إذا لم تكن راضياً عن الخدمة. لا توجد أسئلة أو شروط معقدة.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'الأسئلة التقنية',
      icon: '🔧',
      questions: [
        {
          id: 'q9',
          question: 'مع أي منصات تجارة إلكترونية تتكامل المنصة؟',
          answer: 'حالياً نعمل مع جميع المنصات من خلال النسخ واللصق. ندعم Shopify، Salla، Zid، WooCommerce، Magento، وجميع المنصات الأخرى. التكامل المباشر قريباً!'
        },
        {
          id: 'q10',
          question: 'هل تدعمون اللغة العربية فقط؟',
          answer: 'المنصة مصممة أساساً للسوق العربي وتتخصص في اللغة العربية. ومع ذلك، يمكنها أيضاً توليد محتوى باللغة الإنجليزية للمتاجر التي تستهدف العملاء الدوليين.'
        },
        {
          id: 'q11',
          question: 'كيف تضمنون أمان بياناتي؟',
          answer: 'نستخدم تشفير SSL من الدرجة المصرفية، ولا نحتفظ ببياناتك الحساسة. جميع المعلومات محمية ومشفرة، ولا نشارك بياناتك مع أي طرف ثالث.'
        },
        {
          id: 'q12',
          question: 'ماذا لو واجهت مشكلة تقنية؟',
          answer: 'فريق الدعم التقني متاح لمساعدتك. يمكنك التواصل معنا عبر البريد الإلكتروني أو الدردشة المباشرة، وسنحل المشكلة في أسرع وقت ممكن.'
        }
      ]
    },
    {
      id: 'features',
      title: 'مميزات المنصة',
      icon: '✨',
      questions: [
        {
          id: 'q13',
          question: 'كيف يختار الذكاء الاصطناعي الكلمات المفتاحية؟',
          answer: 'يحلل الذكاء الاصطناعي منتجك، فئته، السوق المستهدف، والمنافسين لاختيار أفضل الكلمات المفتاحية. نستخدم بيانات بحث محدثة ونركز على الكلمات عالية التحويل قليلة المنافسة.'
        },
        {
          id: 'q14',
          question: 'هل يمكنني رؤية تحليل المنافسين؟',
          answer: 'نعم، المنصة تحلل المنافسين تلقائياً وتظهر لك ما يستخدمونه من كلمات مفتاحية واستراتيجيات. هذا يساعدك في اكتشاف الفرص وتحسين موقعك التنافسي.'
        },
        {
          id: 'q15',
          question: 'كيف أتابع أداء منتجاتي بعد التحسين؟',
          answer: 'لوحة التحكم تعرض تقارير مفصلة عن ترتيب منتجاتك، زيارات الموقع، معدل التحويل، والكلمات المفتاحية. ستحصل على توصيات مستمرة للتحسين.'
        },
        {
          id: 'q16',
          question: 'هل يمكن للمنصة كتابة أوصاف لأي نوع منتج؟',
          answer: 'نعم، المنصة تدعم جميع أنواع المنتجات - إلكترونيات، ملابس، مجوهرات، كتب، خدمات، وغيرها. الذكاء الاصطناعي مدرب على فهم خصائص كل فئة والكتابة المناسبة لها.'
        }
      ]
    },
    {
      id: 'results',
      title: 'النتائج والتوقعات',
      icon: '📈',
      questions: [
        {
          id: 'q17',
          question: 'متى سأرى نتائج تحسن في ترتيب Google؟',
          answer: 'عادة تبدأ النتائج في الظهور خلال 2-4 أسابيع من تطبيق التحسينات. النتائج تعتمد على عوامل مثل المنافسة، عمر الموقع، وجودة المحتوى المطبق.'
        },
        {
          id: 'q18',
          question: 'ما مقدار التحسن المتوقع في المبيعات؟',
          answer: 'العملاء يشهدون في المتوسط تحسن 25-60% في الزيارات و15-40% في المبيعات خلال الشهرين الأولين. النتائج تختلف حسب المنتج والسوق والتطبيق الصحيح للتحسينات.'
        },
        {
          id: 'q19',
          question: 'هل النتائج مضمونة؟',
          answer: 'نضمن جودة المحتوى وتحسينات SEO وفقاً لأفضل الممارسات. لكن ترتيب Google يعتمد على عوامل كثيرة خارج المحتوى. نوفر ضمان استرداد إذا لم تكن راضياً عن جودة الخدمة.'
        },
        {
          id: 'q20',
          question: 'كم مرة يجب تحديث محتوى المنتجات؟',
          answer: 'ننصح بمراجعة وتحديث المحتوى كل 3-6 أشهر، أو عند إضافة منتجات جديدة. المحتوى الطازج والمحدث يساعد في الحفاظ على ترتيب جيد في محركات البحث.'
        }
      ]
    },
    {
      id: 'account',
      title: 'إدارة الحساب',
      icon: '👤',
      questions: [
        {
          id: 'q21',
          question: 'كيف أغير كلمة المرور؟',
          answer: 'اذهب إلى إعدادات الحساب وانقر على "تغيير كلمة المرور". ستحتاج إلى إدخال كلمة المرور الحالية ثم الجديدة. ستصلك رسالة تأكيد على البريد الإلكتروني.'
        },
        {
          id: 'q22',
          question: 'هل يمكنني إضافة أعضاء فريق لحسابي؟',
          answer: 'نعم، في الباقات المدفوعة يمكنك دعوة أعضاء فريق مع صلاحيات محددة. هذا مفيد للوكالات والشركات التي تدير عدة متاجر أو لديها فريق تسويق.'
        },
        {
          id: 'q23',
          question: 'كيف أحذف حسابي؟',
          answer: 'يمكنك حذف حسابك من إعدادات الحساب. سيتم حذف جميع بياناتك نهائياً خلال 30 يوم. تأكد من تحميل أي محتوى تريد الاحتفاظ به قبل الحذف.'
        },
        {
          id: 'q24',
          question: 'هل يمكنني استخدام حساب واحد لعدة متاجر؟',
          answer: 'نعم، يمكنك إدارة منتجات عدة متاجر من حساب واحد. ننصح بتنظيم المنتجات في مجلدات أو استخدام العلامات لسهولة الإدارة.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-arabic">
      {/* Navigation */}
      <nav className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img src="/logo2.png" alt="Logo" className="h-8 md:h-12" />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <Link to="/features" className="hover:text-[#83dcc9] transition-colors">المميزات</Link>
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
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              إجابات شاملة لجميع استفساراتك حول المنصة وكيفية استخدامها
            </p>
            <div className="bg-[#83dcc9]/10 border border-[#83dcc9]/30 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#83dcc9]">
                <span className="text-2xl">💡</span>
                <p className="text-lg font-semibold">
                  لم تجد إجابة لسؤالك؟ تواصل معنا وسنساعدك فوراً
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-2xl overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-6 text-right hover:bg-gray-700 transition-colors focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <span className="text-3xl">{category.icon}</span>
                      <h2 className="text-xl md:text-2xl font-bold text-[#83dcc9]">
                        {category.title}
                      </h2>
                    </div>
                    <svg
                      className={`w-6 h-6 transition-transform ${
                        openCategories[category.id] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Questions */}
                {openCategories[category.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-700"
                  >
                    {category.questions.map((qa, questionIndex) => (
                      <div key={qa.id} className="border-b border-gray-700 last:border-b-0">
                        <button
                          onClick={() => toggleQuestion(qa.id)}
                          className="w-full p-6 text-right hover:bg-gray-700 transition-colors focus:outline-none"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                              {qa.question}
                            </h3>
                            <svg
                              className={`w-5 h-5 transition-transform flex-shrink-0 mr-4 ${
                                openQuestions[qa.id] ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </button>

                        {openQuestions[qa.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-6"
                          >
                            <p className="text-gray-300 leading-relaxed">
                              {qa.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full px-4 py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">هل تحتاج مساعدة إضافية؟</h2>
            <p className="text-xl text-gray-300 mb-8">
              فريقنا جاهز لمساعدتك في أي وقت
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link to="/contact" className="bg-gray-800 p-6 rounded-xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-lg font-bold text-[#83dcc9] mb-2">راسلنا</h3>
                <p className="text-gray-400 text-sm">نرد خلال 24 ساعة</p>
              </Link>
              
              <Link to="/how-it-works" className="bg-gray-800 p-6 rounded-xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-bold text-[#83dcc9] mb-2">دليل الاستخدام</h3>
                <p className="text-gray-400 text-sm">تعلم كيف تستخدم المنصة</p>
              </Link>
              
              <Link to="/login?plan=free" className="bg-gray-800 p-6 rounded-xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-lg font-bold text-[#83dcc9] mb-2">جرب مجاناً</h3>
                <p className="text-gray-400 text-sm">ابدأ بـ 3 منتجات مجانية</p>
              </Link>
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
              جاهز لتحسين منتجاتك؟
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              ابدأ رحلتك نحو صدارة Google اليوم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/login?plan=free" className="w-full sm:w-auto">
                <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg">
                  ابدأ مجاناً الآن
                </button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition text-lg">
                  تحدث مع الخبراء
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
                <Link to="/about" className="block text-gray-400 hover:text-white transition">من نحن</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition">اتصل بنا</Link>
                <Link to="/careers" className="block text-gray-400 hover:text-white transition">الوظائف</Link>
                <Link to="/blog" className="block text-gray-400 hover:text-white transition">المدونة</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">الدعم</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link to="/faq" className="block text-[#83dcc9] font-semibold">الأسئلة الشائعة</Link>
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