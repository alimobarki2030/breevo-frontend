import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNavbar from '../components/navbars/PublicNavbar';
import { useTheme } from '../contexts/ThemeContext';

export default function PricingPage() {
  const { theme, isDark } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'البداية',
      subtitle: 'للمتاجر الناشئة',
      monthlyPrice: 99,
      annualPrice: 79,
      monthlyPoints: 1000,
      badge: '',
      description: 'ابدأ رحلتك مع 1,000 نقطة شهرياً',
      features: [
        '1,000 نقطة شهرياً',
        '7 أيام تجربة مع استرداد 100%',
        'توليد أوصاف بالذكاء الاصطناعي',
        'تحليل SEO أساسي لكل منتج',
        'اختيار الكلمات المفتاحية',
        'معاينة Google للمنتجات',
        'محتوى باللغة العربية والإنجليزية',
        'تقارير شهرية',
        'دعم عبر البريد الإلكتروني (48 ساعة)'
      ],
      cta: 'ابدأ التجربة',
      ctaLink: '/checkout?plan=starter',
      popular: false
    },
    {
      id: 'advanced',
      name: 'المتقدمة',
      subtitle: 'للمتاجر المتوسطة',
      monthlyPrice: 199,
      annualPrice: 159,
      monthlyPoints: 3000,
      badge: 'الأكثر شعبية',
      description: 'قوة أكبر مع 3,000 نقطة شهرياً',
      features: [
        '3,000 نقطة شهرياً',
        '7 أيام تجربة مع استرداد 100%',
        'كل مميزات باقة البداية +',
        'تحليل SEO متقدم بالذكاء الاصطناعي',
        'تحليل المنافسين الأساسي',
        'تحسين جماعي للمنتجات',
        'معاينة Google محسّنة',
        'تقارير أسبوعية مفصلة',
        'دعم ذو أولوية (24 ساعة)',
        'إشعارات التحديثات الجديدة'
      ],
      cta: 'ابدأ التجربة',
      ctaLink: '/checkout?plan=advanced',
      popular: true
    },
    {
      id: 'professional',
      name: 'الاحترافية',
      subtitle: 'للمتاجر الكبيرة والوكالات',
      monthlyPrice: 399,
      annualPrice: 319,
      monthlyPoints: 10000,
      badge: 'للمؤسسات',
      description: 'نقاط غير محدودة لنمو غير محدود',
      features: [
        '10,000 نقطة شهرياً',
        '7 أيام تجربة مع استرداد 100%',
        'كل مميزات الباقة المتقدمة +',
        'خيار النقاط غير المحدودة',
        'تحليل AI متقدم + تحليل المنافسين',
        'API Access للتكامل',
        'تقارير يومية + تقارير مخصصة',
        'مدير حساب مخصص',
        'دعم 24/7 (4 ساعات استجابة)',
        'وصول مبكر للمميزات الجديدة',
        'تدريب الفريق مجاناً'
      ],
      cta: 'ابدأ التجربة',
      ctaLink: '/checkout?plan=professional',
      popular: false
    }
  ];

  const pointsUsage = [
    { service: 'توليد وصف بسيط', points: 10 },
    { service: 'توليد وصف متقدم', points: 30 },
    { service: 'تحليل SEO أساسي', points: 20 },
    { service: 'تحليل SEO عميق', points: 50 },
    { service: 'تحليل المنافسين', points: 75 },
    { service: 'باقة كاملة (وصف + SEO + كلمات)', points: 100 },
    { service: 'توليد صور AI للمنتج', points: 150 }
  ];

  const additionalPoints = [
    { name: 'حزمة صغيرة', points: 500, price: 29 },
    { name: 'حزمة متوسطة', points: 1000, price: 49 },
    { name: 'حزمة كبيرة', points: 3000, price: 99, popular: true },
    { name: 'حزمة ضخمة', points: 10000, price: 299 }
  ];

  const featureComparison = [
    {
      category: 'المميزات الأساسية',
      features: [
        { name: 'عدد النقاط الشهرية', starter: '1,000 نقطة', advanced: '3,000 نقطة', professional: '10,000 نقطة' },
        { name: 'تحليل SEO', starter: 'أساسي', advanced: 'متقدم', professional: 'متقدم + المنافسين' },
        { name: 'توليد المحتوى بـ AI', starter: '✅', advanced: '✅ محسّن', professional: '✅ احترافي' },
        { name: 'تحسين جماعي', starter: '❌', advanced: '✅', professional: '✅ متقدم' },
        { name: 'API Access', starter: '❌', advanced: '❌', professional: '✅' },
        { name: 'اللغات المدعومة', starter: 'عربي + إنجليزي', advanced: 'عربي + إنجليزي', professional: 'عربي + إنجليزي' }
      ]
    },
    {
      category: 'التقارير والتحليلات',
      features: [
        { name: 'تقارير الأداء', starter: 'شهرية', advanced: 'أسبوعية', professional: 'يومية + مخصصة' },
        { name: 'تحليل المنافسين', starter: '❌', advanced: 'أساسي', professional: '✅ متقدم' },
        { name: 'تحليل الكلمات المفتاحية', starter: 'أساسي', advanced: 'متقدم', professional: 'احترافي' },
        { name: 'تصدير التقارير', starter: '❌', advanced: 'PDF', professional: 'PDF + Excel + API' }
      ]
    },
    {
      category: 'الدعم والخدمات',
      features: [
        { name: 'دعم البريد الإلكتروني', starter: '48 ساعة', advanced: '24 ساعة', professional: '4 ساعات' },
        { name: 'دعم الهاتف/واتساب', starter: '❌', advanced: '❌', professional: '✅' },
        { name: 'مدير حساب مخصص', starter: '❌', advanced: '❌', professional: '✅' },
        { name: 'تدريب الفريق', starter: '❌', advanced: 'فيديو', professional: 'جلسات مباشرة' },
        { name: 'وصول للمميزات الجديدة', starter: 'عادي', advanced: 'أولوية', professional: 'وصول مبكر' }
      ]
    }
  ];

  const pricingFAQs = [
    {
      question: 'كيف يعمل نظام النقاط؟',
      answer: 'عند الاشتراك تحصل على رصيد نقاط شهري حسب باقتك. كل خدمة تستهلك عدد معين من النقاط. النقاط غير المستخدمة تنتقل للشهر التالي (بحد أقصى رصيد شهرين). يمكنك شراء نقاط إضافية في أي وقت.'
    },
    {
      question: 'ما هي سياسة الاسترداد؟',
      answer: 'نوفر ضمان استرداد 100% خلال فترة التجربة. للباقات الشهرية 7 أيام، وللباقات السنوية 30 يوم. بدون أي أسئلة أو شروط معقدة. فقط اطلب الاسترداد وسنعيد لك المبلغ كاملاً خلال 24-48 ساعة.'
    },
    {
      question: 'هل يمكنني تغيير الباقة في أي وقت؟',
      answer: 'نعم، يمكنك الترقية في أي وقت وستدفع الفرق المتبقي فقط، مع تحويل نقاطك المتبقية. للتخفيض، سيطبق التغيير من بداية دورة الفوترة التالية.'
    },
    {
      question: 'ماذا يحدث إذا نفدت نقاطي؟',
      answer: 'ستتلقى تنبيهات عند وصول رصيدك لـ 20% و 10%. يمكنك شراء حزم نقاط إضافية فوراً، أو الانتظار لتجديد الباقة الشهرية، أو الترقية لباقة أعلى.'
    },
    {
      question: 'هل النقاط لها صلاحية؟',
      answer: 'النقاط الشهرية صالحة لمدة 90 يوم من تاريخ الحصول عليها. النقاط المشتراة صالحة لمدة 6 أشهر. نرسل تذكيرات قبل انتهاء الصلاحية.'
    },
    {
      question: 'ما الفرق بين الدفع الشهري والسنوي؟',
      answer: 'الدفع السنوي يوفر 20% + فترة تجربة 30 يوم بدلاً من 7 أيام. مثلاً باقة البداية تصبح 79 ريال شهرياً بدلاً من 99 ريال.'
    }
  ];

  const getCurrentPrice = (plan) => {
    return billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavingPercentage = (plan) => {
    return Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100);
  };

  return (
    <div className={`min-h-screen font-arabic transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      
      <PublicNavbar />
      
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
                نظام نقاط مرن يتكيف مع احتياجاتك
              </h1>
              <p className={`text-xl mb-8 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ادفع مقابل ما تستخدمه فقط، مع ضمان استرداد كامل خلال فترة التجربة
              </p>
              <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
                isDark 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-center space-x-4 space-x-reverse text-green-500 dark:text-green-400">
                  <span className="text-3xl">💯</span>
                  <p className="text-lg font-semibold">
                    ضمان استرداد 100% خلال فترة التجربة - جرب بدون أي مخاطر
                  </p>
                </div>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  7 أيام للباقات الشهرية | 30 يوم للباقات السنوية
                </p>
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
                      ? 'bg-[#4BB8A9] text-gray-900'
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  شهري
                  <span className="block text-xs mt-1">تجربة 7 أيام</span>
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                    billingCycle === 'annual'
                      ? 'bg-[#4BB8A9] text-gray-900'
                      : isDark 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  سنوي
                  <span className="block text-xs mt-1">تجربة 30 يوم</span>
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
                      ? 'bg-[#4BB8A9] text-gray-900 border-white scale-105 shadow-xl'
                      : isDark 
                        ? 'bg-gray-800 border-gray-700 hover:border-[#4BB8A9]/50'
                        : 'bg-white border-gray-200 hover:border-[#4BB8A9]/50 shadow-lg'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        plan.popular ? 'bg-orange-500 text-white' : 'bg-[#4BB8A9] text-gray-900'
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
                    
                    {/* Points Display */}
                    <div className={`mb-4 p-3 rounded-lg ${
                      plan.popular 
                        ? 'bg-gray-800/10' 
                        : isDark 
                          ? 'bg-gray-700' 
                          : 'bg-gray-100'
                    }`}>
                      <span className="text-3xl font-bold">
                        {plan.monthlyPoints.toLocaleString()}
                      </span>
                      <span className={`text-lg ${
                        plan.popular 
                          ? 'text-gray-700' 
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-600'
                      }`}>
                        {' '}نقطة/شهرياً
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-4xl font-extrabold">
                        {getCurrentPrice(plan)}
                      </span>
                      <span className={`text-lg ${
                        plan.popular 
                          ? 'text-gray-700' 
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-600'
                      }`}>
                        {' '}ريال/شهر
                      </span>
                    </div>

                    {billingCycle === 'annual' && getSavingPercentage(plan) > 0 && (
                      <div className="mt-2">
                        <span className={`text-sm line-through ${
                          plan.popular 
                            ? 'text-gray-600' 
                            : isDark 
                              ? 'text-gray-500' 
                              : 'text-gray-500'
                        }`}>
                          {plan.monthlyPrice} ريال
                        </span>
                        <span className="text-sm text-green-500 font-semibold mr-2">
                          وفر {getSavingPercentage(plan)}%
                        </span>
                      </div>
                    )}
                    
                    <p className={`text-sm mt-2 ${
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
                            : 'text-[#4BB8A9]'
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
                  </div>

                  {/* CTA */}
                  <Link to={plan.ctaLink} className="block">
                    <button className={`w-full font-bold py-4 px-6 rounded-xl transition-all ${
                      plan.popular
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-[#4BB8A9] text-gray-900 hover:bg-[#6cc9b9]'
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Points Usage Section */}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">كيف تُستخدم النقاط؟</h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                كل خدمة تستهلك عدد معين من النقاط حسب مستوى التعقيد
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pointsUsage.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 hover:border-[#4BB8A9]' 
                      : 'bg-white border-gray-200 hover:border-[#4BB8A9]'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">{item.service}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#4BB8A9]">{item.points}</span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>نقطة</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Points Packages */}
        <section className="w-full px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">تحتاج نقاط إضافية؟</h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                اشترِ حزم نقاط إضافية في أي وقت
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalPoints.map((pack, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                    pack.popular 
                      ? isDark 
                        ? 'bg-gray-800 border-[#4BB8A9] scale-105' 
                        : 'bg-white border-[#4BB8A9] shadow-lg scale-105'
                      : isDark 
                        ? 'bg-gray-800 border-gray-700 hover:border-[#4BB8A9]/50' 
                        : 'bg-white border-gray-200 hover:border-[#4BB8A9]/50'
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      الأكثر توفيراً
                    </span>
                  )}
                  <h3 className="font-bold text-lg mb-4 text-center">{pack.name}</h3>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-[#4BB8A9]">{pack.points.toLocaleString()}</span>
                    <span className={`block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>نقطة</span>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold">{pack.price}</span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}> ريال</span>
                  </div>
                  <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    pack.popular 
                      ? 'bg-[#4BB8A9] text-gray-900 hover:bg-[#6cc9b9]' 
                      : isDark 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    شراء
                  </button>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">مقارنة تفصيلية بين الباقات</h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                اختر الباقة المناسبة لاحتياجاتك
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
                <div>البداية</div>
                <div className="text-[#4BB8A9]">المتقدمة</div>
                <div className="text-yellow-500 dark:text-yellow-400">الاحترافية</div>
              </div>
              
              {featureComparison.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  {/* Category Header */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#4BB8A9] text-gray-900 p-4 font-bold text-lg"
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
                        {feature.starter}
                      </div>
                      <div className="text-center text-[#4BB8A9] font-medium">{feature.advanced}</div>
                      <div className="text-center text-yellow-500 dark:text-yellow-400 font-medium">{feature.professional}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">أسئلة شائعة</h2>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                كل ما تحتاج معرفته عن نظام النقاط والأسعار
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
                  <h3 className="text-lg font-bold text-[#4BB8A9] mb-3">{faq.question}</h3>
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
              <div className="text-6xl mb-6">🛡️</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-500 dark:text-green-400">
                ضمان استرداد 100% خلال فترة التجربة
              </h2>
              <p className={`text-xl mb-6 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                نثق في جودة خدماتنا. جرب أي باقة واحصل على كامل مميزاتها،
                وإذا لم تكن راضياً تماماً، سنرد لك المبلغ كاملاً بدون أي أسئلة.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center space-x-3 space-x-reverse">
                  <span className="text-green-500 dark:text-green-400 text-2xl">✓</span>
                  <span>7 أيام للباقات الشهرية</span>
                </div>
                <div className="flex items-center justify-center space-x-3 space-x-reverse">
                  <span className="text-green-500 dark:text-green-400 text-2xl">✓</span>
                  <span>30 يوم للباقات السنوية</span>
                </div>
                <div className="flex items-center justify-center space-x-3 space-x-reverse">
                  <span className="text-green-500 dark:text-green-400 text-2xl">✓</span>
                  <span>استرداد خلال 24-48 ساعة</span>
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
                ابدأ تجربتك اليوم
              </h2>
              <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                انضم لآلاف التجار الذين يحققون نتائج استثنائية مع منصتنا
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link to="/checkout?plan=starter" className="w-full sm:w-auto">
                  <button className="w-full bg-[#4BB8A9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                    ابدأ التجربة - 99 ريال/شهر
                  </button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <button className="w-full border-2 border-[#4BB8A9] text-[#4BB8A9] font-bold py-4 px-8 rounded-xl hover:bg-[#4BB8A9] hover:text-gray-900 transition text-lg">
                    تحدث مع المبيعات
                  </button>
                </Link>
              </div>
              <p className={`text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                ضمان استرداد 100% • دفع آمن • إلغاء في أي وقت
              </p>
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
                <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">المنصة</h4>
                <div className="space-y-1 sm:space-y-2">
                  <Link to="/features" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>المميزات</Link>
                  <Link to="/pricing" className="block text-[#4BB8A9] font-semibold">الأسعار</Link>
                  <Link to="/how-it-works" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>كيف يعمل</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الشركة</h4>
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
                  <Link to="/blog" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>المدونة</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">الدعم</h4>
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
                  <Link to="/support" className={`block transition ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الدعم الفني</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 sm:mb-4 text-[#4BB8A9]">قانوني</h4>
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
                <span className={`text-xs text-center sm:text-right transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  © 2025 SEO Raysa. جميع الحقوق محفوظة.
                </span>
              </div>
              <div className="flex space-x-3 sm:space-x-4 space-x-reverse">
                <a href="https://twitter.com/seoraysa" className={`transition text-xs sm:text-sm ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#4BB8A9]' 
                    : 'text-gray-500 hover:text-[#4BB8A9]'
                }`}>تويتر</a>
                <a href="https://linkedin.com/company/seoraysa" className={`transition text-xs sm:text-sm ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#4BB8A9]' 
                    : 'text-gray-500 hover:text-[#4BB8A9]'
                }`}>لينكد إن</a>
                <a href="https://instagram.com/seoraysa" className={`transition text-xs sm:text-sm ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#4BB8A9]' 
                    : 'text-gray-500 hover:text-[#4BB8A9]'
                }`}>إنستجرام</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}