import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// استيراد النافبارات والـ Contexts
import PublicNavbar from '../components/navbars/PublicNavbar';
import UserNavbar from '../components/navbars/UserNavbar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = user || localStorage.getItem('user') || localStorage.getItem('clientName');

  // طباعة حالة الثيم للتطوير
  console.log('LandingPage theme:', theme, 'isDark:', isDark);

  return (
    <div className={`min-h-screen font-arabic transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      
      {/* عرض النافبار المناسب حسب حالة تسجيل الدخول */}
      {isLoggedIn ? <UserNavbar /> : <PublicNavbar />}
      
      {/* إضافة مساحة للنافبار الثابت */}
      <div className="pt-20">

        {/* Hero Section */}
        <header className="w-full px-4 py-12 lg:py-16">
          <div className="max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* النص الرئيسي */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="space-y-8 text-center lg:text-right w-full lg:max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark 
                    ? 'from-white to-gray-200' 
                    : 'from-gray-900 to-gray-700'
                }`}>
                  حوّل منتجاتك إلى صدارة
                </span>
                <br />
                <span className="text-[#83dcc9]">Google</span>
              </h1>
              
              <p className={`text-xl lg:text-2xl leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                تحليل سيو ذكي، توليد تلقائي، أداء حقيقي. منصة صممت لتجعل متجرك يتألق.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* عرض أزرار مختلفة حسب حالة تسجيل الدخول */}
                {isLoggedIn ? (
                  <>
                    <Link to="/products" className="w-full sm:w-auto">
                      <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        عرض منتجاتي
                      </button>
                    </Link>
                    <Link to="/pricing" className="w-full sm:w-auto">
                      <button className="w-full border-2 border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition-all duration-300">
                        ترقية الباقة
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                      <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        ابدأ الآن مجانًا
                      </button>
                    </Link>
                    <Link to="/how-it-works" className="w-full sm:w-auto">
                      <button className="w-full border-2 border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition-all duration-300">
                        شاهد كيف يعمل
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* الصورة التفاعلية */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full max-w-lg lg:w-[520px] h-[320px] lg:h-[380px] relative"
            >
              <div className={`absolute inset-0 rounded-3xl backdrop-blur-sm border shadow-[0_20px_60px_rgba(131,220,201,0.15)] ${
                isDark 
                  ? 'bg-gradient-to-tr from-[#83dcc9]/30 via-[#83dcc9]/20 to-transparent border-[#83dcc9]/30 shadow-[0_20px_60px_rgba(131,220,201,0.25)]'
                  : 'bg-gradient-to-tr from-[#83dcc9]/20 via-[#83dcc9]/10 to-transparent border-[#83dcc9]/20'
              }`}>
                
                {/* عناصر تفاعلية داخل البطاقة */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-[#83dcc9]/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-[#83dcc9]/20 to-blue-500/20 rounded-2xl animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-[#83dcc9]/10 to-purple-500/10 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
                
                {/* محتوى نصي داخل البطاقة */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="text-4xl lg:text-5xl font-bold text-[#83dcc9] mb-4">SEO</div>
                  <div className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>تحليل ذكي</div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Features Section */}
        <section className={`py-16 lg:py-24 px-4 sm:px-6 transition-all duration-500 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            
            {/* عنوان القسم */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">مميزات المنصة</h2>
              <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                حل متكامل لتحسين ظهور منتجاتك وتحقيق أداء استثنائي
              </p>
              <Link to="/features" className="inline-flex items-center text-[#83dcc9] hover:text-[#6cc9b9] transition-colors font-semibold">
                اكتشف جميع المميزات 
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>

            {/* البطاقات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* البطاقة الأولى */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group hover:border-[#83dcc9]/30 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  توليد تلقائي للمحتوى
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  دع الذكاء الاصطناعي يكتب أوصاف منتجاتك ويختار الكلمات المفتاحية الأمثل بدقة عالية.
                </p>
              </motion.div>

              {/* البطاقة الثانية */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group hover:border-[#83dcc9]/30 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📊</div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  مؤشرات SEO فورية
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  تحليل حيّ لكل منتج مع اقتراحات مباشرة لتحسين الظهور في محركات البحث.
                </p>
              </motion.div>

              {/* البطاقة الثالثة */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group hover:border-[#83dcc9]/30 md:col-span-2 lg:col-span-1 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📈</div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  لوحة تحكم متقدمة
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  تابع أداء منتجاتك لحظة بلحظة من خلال لوحة مخصصة وسهلة الاستخدام.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEO Statistics Section */}
        <section className={`py-16 lg:py-24 px-4 sm:px-6 transition-all duration-500 ${
          isDark ? 'bg-gray-950' : 'bg-white'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            
            {/* عنوان القسم */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">لماذا SEO مهم لمتجرك؟</h2>
              <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                حقائق مثبتة عن أهمية تحسين محركات البحث
              </p>
            </div>
            
            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              
              {/* إحصائية 1 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="text-6xl lg:text-7xl font-extrabold text-[#83dcc9] mb-4">68%</div>
                <h3 className="text-xl font-bold mb-2">من التجارب الإلكترونية</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>تبدأ بمحرك البحث Google</p>
              </motion.div>
              
              {/* إحصائية 2 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="text-6xl lg:text-7xl font-extrabold text-[#83dcc9] mb-4">53%</div>
                <h3 className="text-xl font-bold mb-2">من الزيارات</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>تأتي من البحث الطبيعي</p>
              </motion.div>
              
              {/* إحصائية 3 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="text-6xl lg:text-7xl font-extrabold text-[#83dcc9] mb-4">75%</div>
                <h3 className="text-xl font-bold mb-2">من المستخدمين</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>لا يتجاوزون الصفحة الأولى</p>
              </motion.div>
            </div>

            {/* بطاقة الحقيقة */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`p-12 rounded-3xl border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gradient-to-r from-[#83dcc9]/20 via-[#83dcc9]/10 to-transparent border-[#83dcc9]/30'
                  : 'bg-gradient-to-r from-[#83dcc9]/10 via-[#83dcc9]/5 to-transparent border-[#83dcc9]/20'
              }`}>
                <h3 className="text-2xl font-bold mb-8 text-center text-[#83dcc9]">الحقيقة البسيطة</h3>
                <p className={`text-xl text-center leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  إذا لم تظهر منتجاتك في الصفحة الأولى لـ Google، فالعملاء لن يجدوها. 
                  تحسين SEO ليس رفاهية، بل ضرورة لبقاء أي متجر إلكتروني في المنافسة.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className={`py-16 lg:py-24 px-4 sm:px-6 transition-all duration-500 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-5xl mx-auto text-center">
            {isLoggedIn ? (
              // للمستخدمين المسجلين
              <>
                <h2 className="text-3xl lg:text-4xl font-bold mb-8">اكتشف المزيد من المميزات</h2>
                <p className={`text-xl mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  طور من باقتك واستفد من أدوات أكثر تقدماً
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`rounded-3xl p-12 mb-12 backdrop-blur-sm border ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#83dcc9]/20 to-transparent border-[#83dcc9]/30'
                      : 'bg-gradient-to-r from-[#83dcc9]/10 to-transparent border-[#83dcc9]/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-center lg:text-right">
                      <h3 className="text-3xl font-bold mb-4 text-[#83dcc9]">ترقية باقتك الآن</h3>
                      <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        الحصول على مميزات أكثر • أدوات متقدمة • منتجات غير محدودة
                      </p>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-5xl font-bold mb-2">ابدأ من 99 ريال</div>
                      <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>شهرياً</div>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/pricing" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-10 rounded-xl hover:bg-[#6cc9b9] transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                      🚀 ترقية الباقة
                    </button>
                  </Link>
                  <Link to="/products" className="w-full sm:w-auto">
                    <button className="w-full border-2 border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-10 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition-all duration-300 text-xl">
                      عرض منتجاتي
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              // للزوار غير المسجلين
              <>
                <h2 className="text-3xl lg:text-4xl font-bold mb-8">ابدأ رحلتك نحو النجاح</h2>
                <p className={`text-xl mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  خطط مرنة تناسب كل الأحجام، من التجربة المجانية إلى الحلول المؤسسية
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`rounded-3xl p-12 mb-12 backdrop-blur-sm border ${
                    isDark 
                      ? 'bg-gradient-to-r from-[#83dcc9]/20 to-transparent border-[#83dcc9]/30'
                      : 'bg-gradient-to-r from-[#83dcc9]/10 to-transparent border-[#83dcc9]/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-center lg:text-right">
                      <h3 className="text-3xl font-bold mb-4 text-[#83dcc9]">ابدأ مجاناً اليوم</h3>
                      <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        3 منتجات مجانية • بدون بطاقة ائتمانية • إلغاء في أي وقت
                      </p>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-5xl font-bold mb-2">0 ريال</div>
                      <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>للتجربة المجانية</div>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-10 rounded-xl hover:bg-[#6cc9b9] transition-all duration-300 text-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                      🚀 ابدأ مجاناً الآن
                    </button>
                  </Link>
                  <Link to="/pricing" className="w-full sm:w-auto">
                    <button className="w-full border-2 border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-10 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition-all duration-300 text-xl">
                      عرض جميع الباقات
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className={`py-16 lg:py-24 text-center px-4 sm:px-6 transition-all duration-500 ${
          isDark ? 'bg-gray-950' : 'bg-white'
        }`}>
          <div className="max-w-4xl mx-auto">
            {isLoggedIn ? (
              // للمستخدمين المسجلين
              <>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">جاهز لإضافة منتجات جديدة؟</h2>
                <p className={`text-xl mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  اذهب إلى لوحة التحكم وابدأ بتحليل منتجاتك الآن
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/products" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      إدارة منتجاتي
                    </button>
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto">
                    <button className={`w-full border-2 font-bold py-4 px-8 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:border-[#83dcc9] hover:text-[#83dcc9]'
                        : 'border-gray-300 text-gray-700 hover:border-[#83dcc9] hover:text-[#83dcc9]'
                    }`}>
                      تحدث مع فريقنا
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              // للزوار غير المسجلين
              <>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">جاهز تبدأ تحسين متجرك؟</h2>
                <p className={`text-xl mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  ابدأ الآن مجانًا وبدون بطاقة ائتمانية
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      جرب المنصة مجانًا
                    </button>
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto">
                    <button className={`w-full border-2 font-bold py-4 px-8 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:border-[#83dcc9] hover:text-[#83dcc9]'
                        : 'border-gray-300 text-gray-700 hover:border-[#83dcc9] hover:text-[#83dcc9]'
                    }`}>
                      تحدث مع فريقنا
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-12 lg:py-16 px-4 sm:px-6 border-t transition-all duration-500 ${
          isDark 
            ? 'border-gray-700 bg-gray-900' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="max-w-screen-xl mx-auto">
            
            {/* روابط Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="font-bold mb-6 text-[#83dcc9] text-lg">المنصة</h4>
                <div className="space-y-3">
                  <Link to="/features" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>المميزات</Link>
                  <Link to="/pricing" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الأسعار</Link>
                  <Link to="/how-it-works" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>كيف يعمل</Link>
                  <Link to="/demo" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>تجربة تفاعلية</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-[#83dcc9] text-lg">الشركة</h4>
                <div className="space-y-3">
                  <Link to="/about" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>من نحن</Link>
                  <Link to="/contact" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>اتصل بنا</Link>
                  <Link to="/careers" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الوظائف</Link>
                  <Link to="/blog" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>المدونة</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-[#83dcc9] text-lg">الدعم</h4>
                <div className="space-y-3">
                  <Link to="/faq" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الأسئلة الشائعة</Link>
                  <Link to="/help" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>مركز المساعدة</Link>
                  <Link to="/tutorials" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الدروس التعليمية</Link>
                  <Link to="/support" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>الدعم الفني</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-[#83dcc9] text-lg">قانوني</h4>
                <div className="space-y-3">
                  <Link to="/privacy" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>سياسة الخصوصية</Link>
                  <Link to="/terms" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>شروط الخدمة</Link>
                  <Link to="/cookies" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>سياسة ملفات تعريف الارتباط</Link>
                  <Link to="/refund" className={`block transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>سياسة الاسترداد</Link>
                </div>
              </div>
            </div>
            
            {/* معلومات الشركة */}
            <div className={`flex flex-col lg:flex-row justify-between items-center pt-8 border-t space-y-6 lg:space-y-0 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 lg:space-x-reverse">
                <img src="/logo3.png" alt="Logo" className="h-10" />
                <span className={`text-center lg:text-right ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>© 2025 مشروع السيو الذكي. جميع الحقوق محفوظة.</span>
              </div>
              <div className="flex space-x-6 space-x-reverse">
                <Link to="/social/twitter" className={`transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#83dcc9]' 
                    : 'text-gray-500 hover:text-[#83dcc9]'
                }`}>تويتر</Link>
                <Link to="/social/linkedin" className={`transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-[#83dcc9]' 
                    : 'text-gray-500 hover:text-[#83dcc9]'
                }`}>لينكد إن</Link>
                <Link to="/social/instagram" className={`transition-colors ${
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