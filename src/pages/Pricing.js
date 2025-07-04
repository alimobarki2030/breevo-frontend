import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNavbar from '../components/navbars/PublicNavbar';
import { useTheme } from '../contexts/ThemeContext';

export default function PricingPage() {
  // ✅ استخدام useTheme
  const { theme, isDark } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual

  const plans = [
    {
      id: 'free',
      name: 'المجانية',
      subtitle: 'للتجربة والاستكشاف',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: '',
      description: 'ابدأ رحلتك مع SEO مجاناً',
      features: [
        'توليد 3 منتجات شهرياً',
        'جميع مميزات المنصة',
        'توليد أوصاف محسّنة بالذكاء الاصطناعي',
        'تحليل SEO فوري لكل منتج',
        'اختيار الكلمات المفتاحية المناسبة',
        'معاينة Google للمنتجات',
        'محتوى باللغة العربية والإنجليزية',
        'دعم عبر البريد الإلكتروني'
      ],
      limitations: [],
      cta: 'ابدأ مجاناً',
      ctaLink: '/checkout?plan=free',
      popular: false
    },
    {
      id: 'pro',
      name: 'الاحترافية',
      subtitle: 'للمتاجر الجادة في النمو',
      monthlyPrice: 49,
      annualPrice: 39,
      badge: 'الأكثر شعبية',
      description: 'نفس المميزات مع حد أعلى للمنتجات',
      features: [
        'توليد 30 منتج شهرياً',
        'جميع مميزات المنصة',
        'توليد أوصاف محسّنة بالذكاء الاصطناعي',
        'تحليل SEO فوري لكل منتج',
        'اختيار الكلمات المفتاحية المناسبة',
        'معاينة Google للمنتجات',
        'محتوى باللغة العربية والإنجليزية',
        'دعم فني ذو أولوية (24 ساعة)',
        'إشعارات التحديثات والمميزات الجديدة'
      ],
      limitations: [],
      cta: 'اشترك الآن',
      ctaLink: '/checkout?plan=pro',
      popular: true
    },
    {
      id: 'business',
      name: 'الأعمال',
      subtitle: 'للشركات والوكالات',
      monthlyPrice: 129,
      annualPrice: 99,
      badge: 'للمؤسسات',
      description: 'نفس المميزات بدون حدود',
      features: [
        'توليد غير محدود للمنتجات',
        'جميع مميزات المنصة',
        'توليد أوصاف محسّنة بالذكاء الاصطناعي',
        'تحليل SEO فوري لكل منتج',
        'اختيار الكلمات المفتاحية المناسبة',
        'معاينة Google للمنتجات',
        'محتوى باللغة العربية والإنجليزية',
        'دعم مخصص ومتابعة شخصية',
        'أولوية في الدعم الفني (4 ساعات)',
        'إشعارات مبكرة بالمميزات الجديدة',
        'مناسب لإدارة عدة متاجر'
      ],
      limitations: [],
      cta: 'للشركات',
      ctaLink: '/checkout?plan=business',
      popular: false
    }
  ];

  const featureComparison = [
    {
      category: 'المميزات الأساسية',
      features: [
        { name: 'عدد المنتجات شهرياً', free: '3', pro: '30', business: 'غير محدود' },
        { name: 'توليد المحتوى بالذكاء الاصطناعي', free: '✅', pro: '✅', business: '✅' },
        { name: 'تحليل SEO فوري', free: '✅', pro: '✅', business: '✅' },
        { name: 'اختيار الكلمات المفتاحية', free: '✅', pro: '✅', business: '✅' },
        { name: 'معاينة Google', free: '✅', pro: '✅', business: '✅' },
        { name: 'محتوى عربي وإنجليزي', free: '✅', pro: '✅', business: '✅' }
      ]
    },
    {
      category: 'الدعم والخدمات',
      features: [
        { name: 'دعم عبر البريد الإلكتروني', free: '✅', pro: '✅', business: '✅' },
        { name: 'وقت الاستجابة', free: '48 ساعة', pro: '24 ساعة', business: '4 ساعات' },
        { name: 'دعم ذو أولوية', free: '❌', pro: '✅', business: '✅ متقدم' },
        { name: 'متابعة شخصية', free: '❌', pro: '❌', business: '✅' }
      ]
    },
    {
      category: 'التحديثات والمميزات الجديدة',
      features: [
        { name: 'إشعارات التحديثات', free: 'عادية', pro: 'أولوية', business: 'مبكرة' },
        { name: 'الوصول للمميزات الجديدة', free: 'عند الإطلاق', pro: 'عند الإطلاق', business: 'وصول مبكر' },
        { name: 'طلب مميزات مخصصة', free: '❌', pro: '❌', business: '✅' },
        { name: 'إدارة عدة متاجر', free: 'محدود', pro: 'محدود', business: 'مناسب' }
      ]
    }
  ];

  const pricingFAQs = [
    {
      question: 'هل يمكنني تغيير خطتي في أي وقت؟',
      answer: 'نعم، يمكنك الترقية أو التخفيض في أي وقت. عند الترقية ستدفع الفرق المتبقي للشهر الحالي، وعند التخفيض سيطبق التغيير في الدورة القادمة.'
    },
    {
      question: 'ما الفرق بين الدفع الشهري والسنوي؟',
      answer: 'الدفع السنوي يوفر خصم 20-23% على إجمالي التكلفة. مثلاً الباقة الاحترافية تصبح 39 ريال شهرياً بدلاً من 49 ريال عند الدفع السنوي.'
    },
    {
      question: 'هل جميع الخطط تحصل على نفس المميزات؟',
      answer: 'نعم، جميع الخطط تحصل على نفس مميزات المنصة تماماً. الفرق الوحيد هو عدد المنتجات شهرياً ومستوى الدعم الفني المقدم.'
    },
    {
      question: 'ماذا يحدث إذا تجاوزت حد المنتجات؟',
      answer: 'في الباقة المجانية ستحتاج للترقية. في الباقات المدفوعة، سنتواصل معك لمناقشة الترقية أو إضافة منتجات إضافية بسعر مخفض.'
    },
    {
      question: 'متى سأحصل على المميزات الجديدة؟',
      answer: 'جميع العملاء يحصلون على المميزات الجديدة عند إطلاقها. عملاء الأعمال قد يحصلون على وصول مبكر لبعض المميزات قبل الإطلاق العام.'
    }
  ];

  const getCurrentPrice = (plan) => {
    return billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavingPercentage = (plan) => {
    if (plan.monthlyPrice === 0) return 0;
    return Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100);
  };

  return (
    <div className={`min-h-screen font-arabic transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      
      {/* استخدام النافبار الموحد */}
      <PublicNavbar />
      
      {/* مساحة للنافبار الثابت */}
      <div className="pt-20">
        
        {/* Hero Section */}
        <section className="w-full px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                اختر الباقة المناسبة لطموحك
              </h1>
              <p className={`text-xl mb-8 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                خطط مرنة تنمو معك، من التجربة المجانية إلى الحلول المؤسسية الشاملة
              </p>
              <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
                isDark 
                  ? 'bg-[#83dcc9]/10 border-[#83dcc9]/30' 
                  : 'bg-[#83dcc9]/5 border-[#83dcc9]/20'
              }`}>
                <div className="flex items-center justify-center space-x-4 space-x-reverse text-[#83dcc9]">
                  <span className="text-2xl">💰</span>
                  <p className="text-lg font-semibold">
                    ضمان استرداد كامل خلال 30 يوم - جرب بدون مخاطر
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Billing Toggle */}
        <section className="w-full px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className={`p-2 rounded-2xl flex items-center transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-[#83dcc9] text-gray-900'
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  شهري
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                    billingCycle === 'annual'
                      ? 'bg-[#83dcc9] text-gray-900'
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  سنوي
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    وفر 20%
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl border-2 transition-all hover:shadow-2xl ${
                    plan.popular
                      ? 'bg-[#83dcc9] text-gray-900 border-white scale-105'
                      : isDark 
                        ? 'bg-gray-800 border-gray-700 hover:border-[#83dcc9]/50'
                        : 'bg-white border-gray-200 hover:border-[#83dcc9]/50 shadow-lg'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        plan.popular ? 'bg-orange-500 text-white' : 'bg-[#83dcc9] text-gray-900'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className={`text-sm mb-4 ${
                      plan.popular 
                        ? 'text-gray-700' 
                        : isDark 
                          ? 'text-gray-400' 
                          : 'text-gray-600'
                    }`}>
                      {plan.subtitle}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-extrabold">
                        {getCurrentPrice(plan)} ريال
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <>
                          <span className={`text-lg ${
                            plan.popular 
                              ? 'text-gray-700' 
                              : isDark 
                                ? 'text-gray-400' 
                                : 'text-gray-600'
                          }`}>
                            /شهرياً
                          </span>
                          {billingCycle === 'annual' && getSavingPercentage(plan) > 0 && (
                            <div className="mt-2">
                              <span className={`text-sm line-through ${
                                plan.popular 
                                  ? 'text-gray-600' 
                                  : isDark 
                                    ? 'text-gray-500' 
                                    : 'text-gray-500'
                              }`}>
                                {plan.monthlyPrice} ريال/شهرياً
                              </span>
                              <span className="text-sm text-green-500 font-semibold mr-2">
                                وفر {getSavingPercentage(plan)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <p className={`text-sm ${
                      plan.popular 
                        ? 'text-gray-700' 
                        : isDark 
                          ? 'text-gray-400' 
                          : 'text-gray-600'
                    }`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                        <span className={`text-lg ${
                          plan.popular 
                            ? 'text-gray-900' 
                            : 'text-[#83dcc9]'
                        }`}>
                          ✓
                        </span>
                        <span className={`text-sm ${
                          plan.popular 
                            ? 'text-gray-800' 
                            : isDark 
                              ? 'text-gray-300' 
                              : 'text-gray-700'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                        <span className={`text-lg ${
                          plan.popular 
                            ? 'text-gray-600' 
                            : isDark 
                              ? 'text-gray-600' 
                              : 'text-gray-500'
                        }`}>
                          ❌
                        </span>
                        <span className={`text-sm ${
                          plan.popular 
                            ? 'text-gray-600' 
                            : isDark 
                              ? 'text-gray-500' 
                              : 'text-gray-500'
                        }`}>
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link to={plan.ctaLink} className="block">
                    <button className={`w-full font-bold py-4 px-6 rounded-xl transition-all ${
                      plan.popular
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-[#83dcc9] text-gray-900 hover:bg-[#6cc9b9]'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className={`w-full px-4 py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">مقارنة مفصلة للمميزات</h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                اكتشف الفروق بين الباقات بالتفصيل
              </p>
            </motion.div>

            <div className={`rounded-2xl overflow-hidden transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white shadow-lg'
            }`}>
              {/* Headers */}
              <div className={`grid grid-cols-4 p-4 font-bold text-center sticky top-0 transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div></div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>المجانية</div>
                <div className="text-[#83dcc9]">الاحترافية</div>
                <div className="text-yellow-500 dark:text-yellow-400">الأعمال</div>
              </div>
              
              {featureComparison.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  {/* Category Header */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#83dcc9] text-gray-900 p-4 font-bold text-lg"
                  >
                    {category.category}
                  </motion.div>
                  
                  {/* Features */}
                  {category.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: featureIndex * 0.05 }}
                      viewport={{ once: true }}
                      className={`grid grid-cols-4 p-4 border-b last:border-b-0 text-sm transition-colors duration-300 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className={`font-semibold text-right ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feature.name}
                      </div>
                      <div className={`text-center ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature.free}
                      </div>
                      <div className="text-center text-[#83dcc9] font-medium">{feature.pro}</div>
                      <div className="text-center text-yellow-500 dark:text-yellow-400 font-medium">{feature.business}</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="w-full px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">أسئلة شائعة حول الأسعار</h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                إجابات واضحة لاستفساراتك المالية
              </p>
            </motion.div>

            <div className="space-y-6">
              {pricingFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl transition-colors duration-300 ${
                    isDark ? 'bg-gray-800' : 'bg-white shadow-lg'
                  }`}
                >
                  <h3 className="text-lg font-bold text-[#83dcc9] mb-3">{faq.question}</h3>
                  <p className={`leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Money Back Guarantee */}
        <section className={`w-full px-4 py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`border rounded-2xl p-8 transition-colors duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-green-600/20 to-transparent border-green-500/30'
                  : 'bg-gradient-to-r from-green-50 to-transparent border-green-200'
              }`}
            >
              <div className="text-6xl mb-6">💰</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-500 dark:text-green-400">
                ضمان استرداد كامل لمدة 30 يوم
              </h2>
              <p className={`text-xl mb-6 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                جرب منصتنا بدون أي مخاطر. إذا لم تكن راضياً عن النتائج خلال 30 يوم، 
                سنرد لك كامل المبلغ دون أسئلة أو شروط معقدة.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-green-500 dark:text-green-400 text-2xl">✓</span>
                  <span>استرداد فوري خلال 30 يوم</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-green-500 dark:text-green-400 text-2xl">✓</span>
                  <span>بدون أسئلة أو شروط</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-green-500 dark:text-green-400 text-2xl">✓</span>
                  <span>احتفظ بالمحتوى المولد</span>
                </div>
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
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ابدأ رحلة نجاحك اليوم
              </h2>
              <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                انضم لآلاف التجار الذين حققوا نتائج استثنائية مع منصتنا
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                  <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                    جرب مجاناً الآن
                  </button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <button className="w-full border-2 border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition text-lg">
                    تحدث مع المبيعات
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 sm:py-12 px-4 sm:px-6 border-t transition-colors duration-300 ${
          isDark 
            ? 'border-gray-700 bg-gray-900' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm mb-6 sm:mb-8">
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">المنصة</h4>
                <div className="space-y-1 sm:space-y-2">
                  <Link to="/features" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>المميزات</Link>
                  <Link to="/pricing" className="block text-[#83dcc9] font-semibold">الأسعار</Link>
                  <Link to="/how-it-works" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>كيف يعمل</Link>
                  <Link to="/demo" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>تجربة تفاعلية</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">الشركة</h4>
                <div className="space-y-1 sm:space-y-2">
                  <Link to="/about" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>من نحن</Link>
                  <Link to="/contact" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>اتصل بنا</Link>
                  <Link to="/careers" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الوظائف</Link>
                  <Link to="/blog" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>المدونة</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">الدعم</h4>
                <div className="space-y-1 sm:space-y-2">
                  <Link to="/faq" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الأسئلة الشائعة</Link>
                  <Link to="/help" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>مركز المساعدة</Link>
                  <Link to="/tutorials" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الدروس التعليمية</Link>
                  <Link to="/support" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الدعم الفني</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#83dcc9]">قانوني</h4>
                <div className="space-y-1 sm:space-y-2">
                  <Link to="/privacy" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>سياسة الخصوصية</Link>
                  <Link to="/terms" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>شروط الخدمة</Link>
                  <Link to="/cookies" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>سياسة ملفات تعريف الارتباط</Link>
                  <Link to="/refund" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>سياسة الاسترداد</Link>
                </div>
              </div>
            </div>
            
            <div className={`flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t space-y-4 sm:space-y-0 transition-colors duration-300 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                <img 
                  src={isDark ? "/logo1.png" : "/logo3.png"} 
                  alt="Logo" 
                  className="h-6 sm:h-8 transition-opacity duration-300" 
                />
                <span className={`text-xs text-center sm:text-right transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  © 2025 مشروع السيو الذكي. جميع الحقوق محفوظة.
                </span>
              </div>
              <div className="flex space-x-3 sm:space-x-4 space-x-reverse">
                <Link to="/social/twitter" className={`transition text-xs sm:text-sm ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#83dcc9]' 
                    : 'text-gray-500 hover:text-[#83dcc9]'
                }`}>تويتر</Link>
                <Link to="/social/linkedin" className={`transition text-xs sm:text-sm ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#83dcc9]' 
                    : 'text-gray-500 hover:text-[#83dcc9]'
                }`}>لينكد إن</Link>
                <Link to="/social/instagram" className={`transition text-xs sm:text-sm ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#83dcc9]' 
                    : 'text-gray-500 hover:text-[#83dcc9]'
                }`}>إنستجرام</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}