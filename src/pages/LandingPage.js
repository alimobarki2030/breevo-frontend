import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// استيراد النافبارات والـ AuthContext
import PublicNavbar from '../components/navbars/PublicNavbar';
import UserNavbar from '../components/navbars/UserNavbar';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = user || localStorage.getItem('user') || localStorage.getItem('clientName');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-arabic">
      
      {/* عرض النافبار المناسب حسب حالة تسجيل الدخول */}
      {isLoggedIn ? <UserNavbar /> : <PublicNavbar />}
      
      {/* إضافة مساحة للنافبار الثابت */}
      <div className="pt-20">

        {/* Hero Section */}
        <header className="w-full px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-screen-xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center md:text-right w-full md:max-w-xl"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              حوّل منتجاتك إلى صدارة Google
            </h1>
            <p className="text-gray-300 text-lg">
              تحليل سيو ذكي، توليد تلقائي، أداء حقيقي. منصة صممت لتجعل متجرك يتألق.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* عرض أزرار مختلفة حسب حالة تسجيل الدخول */}
              {isLoggedIn ? (
                <>
                  <Link to="/products" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition">
                      عرض منتجاتي
                    </button>
                  </Link>
                  <Link to="/pricing" className="w-full sm:w-auto">
                    <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-3 px-6 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition">
                      ترقية الباقة
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition">
                      ابدأ الآن مجانًا
                    </button>
                  </Link>
                  <Link to="/how-it-works" className="w-full sm:w-auto">
                    <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-3 px-6 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition">
                      شاهد كيف يعمل
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            className="w-full max-w-lg md:w-[480px] h-[280px] md:h-[320px] bg-gradient-to-tr from-[#83dcc9]/30 to-transparent rounded-3xl shadow-[0_20px_60px_rgba(131,220,201,0.25)] animate-pulse"
          />
          </div>
        </header>

        

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-900">
          <div className="max-w-screen-xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">مميزات المنصة</h2>
            <p className="text-gray-400 text-sm sm:text-base px-4 sm:px-0">حل متكامل لتحسين ظهور منتجاتك وتحقيق أداء استثنائي.</p>
            <Link to="/features" className="inline-block mt-4 text-[#83dcc9] hover:underline text-sm sm:text-base">
              اكتشف جميع المميزات ←
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-screen-xl mx-auto text-center">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow hover:shadow-xl transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">توليد تلقائي للمحتوى</h3>
              <p className="text-xs sm:text-sm text-gray-300">دع الذكاء الاصطناعي يكتب أوصاف منتجاتك ويختار الكلمات المفتاحية الأمثل.</p>
            </div>
            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow hover:shadow-xl transition">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">مؤشرات SEO فورية</h3>
              <p className="text-xs sm:text-sm text-gray-300">تحليل حيّ لكل منتج مع اقتراحات مباشرة لتحسين الظهور.</p>
            </div>
            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow hover:shadow-xl transition sm:col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📈</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">لوحة تحكم متقدمة</h3>
              <p className="text-xs sm:text-sm text-gray-300">تابع أداء منتجاتك لحظة بلحظة من خلال لوحة مخصصة وسهلة الاستخدام.</p>
            </div>
          </div>
        </section>

        {/* Real SEO Benefits */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-950">
          <div className="max-w-screen-xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">لماذا SEO مهم لمتجرك؟</h2>
            <p className="text-gray-400 text-sm sm:text-base px-4 sm:px-0">حقائق مثبتة عن أهمية تحسين محركات البحث</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
            {/* SEO Fact 1 */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#83dcc9] mb-2">68%</div>
              <h3 className="text-lg font-bold mb-2">من التجارب الإلكترونية</h3>
              <p className="text-gray-400 text-sm">تبدأ بمحرك البحث Google</p>
            </div>
            
            {/* SEO Fact 2 */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#83dcc9] mb-2">53%</div>
              <h3 className="text-lg font-bold mb-2">من الزيارات</h3>
              <p className="text-gray-400 text-sm">تأتي من البحث الطبيعي</p>
            </div>
            
            {/* SEO Fact 3 */}
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#83dcc9] mb-2">75%</div>
              <h3 className="text-lg font-bold mb-2">من المستخدمين</h3>
              <p className="text-gray-400 text-sm">لا يتجاوزون الصفحة الأولى</p>
            </div>
          </div>

          {/* Why SEO Matters */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6 text-center text-[#83dcc9]">الحقيقة البسيطة</h3>
              <p className="text-lg text-gray-300 text-center leading-relaxed">
                إذا لم تظهر منتجاتك في الصفحة الأولى لـ Google، فالعملاء لن يجدوها. 
                تحسين SEO ليس رفاهية، بل ضرورة لبقاء أي متجر إلكتروني في المنافسة.
              </p>
            </div>
          </div>
        </section>

        {/* Simple Pricing Teaser - يختلف حسب حالة تسجيل الدخول */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            {isLoggedIn ? (
              // للمستخدمين المسجلين
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">اكتشف المزيد من المميزات</h2>
                <p className="text-gray-400 text-lg mb-8">طور من باقتك واستفد من أدوات أكثر تقدماً</p>
                
                <div className="bg-gradient-to-r from-[#83dcc9]/20 to-transparent border border-[#83dcc9]/30 rounded-2xl p-8 mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-right">
                      <h3 className="text-2xl font-bold mb-2 text-[#83dcc9]">ترقية باقتك الآن</h3>
                      <p className="text-gray-300">الحصول على مميزات أكثر • أدوات متقدمة • منتجات غير محدودة</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">ابدأ من 99 ريال</div>
                      <div className="text-sm text-gray-400">شهرياً</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/pricing" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg">
                      🚀 ترقية الباقة
                    </button>
                  </Link>
                  <Link to="/products" className="w-full sm:w-auto">
                    <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition text-lg">
                      عرض منتجاتي
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              // للزوار غير المسجلين
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">ابدأ رحلتك نحو النجاح</h2>
                <p className="text-gray-400 text-lg mb-8">خطط مرنة تناسب كل الأحجام، من التجربة المجانية إلى الحلول المؤسسية</p>
                
                <div className="bg-gradient-to-r from-[#83dcc9]/20 to-transparent border border-[#83dcc9]/30 rounded-2xl p-8 mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-right">
                      <h3 className="text-2xl font-bold mb-2 text-[#83dcc9]">ابدأ مجاناً اليوم</h3>
                      <p className="text-gray-300">3 منتجات مجانية • بدون بطاقة ائتمانية • إلغاء في أي وقت</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">0 ريال</div>
                      <div className="text-sm text-gray-400">للتجربة المجانية</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                    <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-4 px-8 rounded-xl hover:bg-[#6cc9b9] transition text-lg">
                      🚀 ابدأ مجاناً الآن
                    </button>
                  </Link>
                  <Link to="/pricing" className="w-full sm:w-auto">
                    <button className="w-full border border-[#83dcc9] text-[#83dcc9] font-bold py-4 px-8 rounded-xl hover:bg-[#83dcc9] hover:text-gray-900 transition text-lg">
                      عرض جميع الباقات
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Call to action - يختلف حسب حالة تسجيل الدخول */}
        <section className="py-16 sm:py-20 md:py-24 text-center px-4 sm:px-6">
          {isLoggedIn ? (
            // للمستخدمين المسجلين
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">جاهز لإضافة منتجات جديدة؟</h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base px-4 sm:px-0">اذهب إلى لوحة التحكم وابدأ بتحليل منتجاتك الآن.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <Link to="/products" className="w-full sm:w-auto">
                  <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition">
                    إدارة منتجاتي
                  </button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <button className="w-full border border-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:border-[#83dcc9] hover:text-[#83dcc9] transition">
                    تحدث مع فريقنا
                  </button>
                </Link>
              </div>
            </>
          ) : (
            // للزوار غير المسجلين
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">جاهز تبدأ تحسين متجرك؟</h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base px-4 sm:px-0">ابدأ الآن مجانًا وبدون بطاقة ائتمانية.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <Link to="/checkout?plan=free" className="w-full sm:w-auto">
                  <button className="w-full bg-[#83dcc9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition">
                    جرب المنصة مجانًا
                  </button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <button className="w-full border border-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:border-[#83dcc9] hover:text-[#83dcc9] transition">
                    تحدث مع فريقنا
                  </button>
                </Link>
              </div>
            </>
          )}
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
    </div>
  );
}