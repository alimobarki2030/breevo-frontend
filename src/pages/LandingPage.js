import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-arabic">
      {/* Hero Section */}
      <header className="max-w-screen-xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center md:text-right md:max-w-xl"
        >
          <img src="/logo2.png" alt="Logo" className="h-14 mb-4 mx-auto md:mx-0" />
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            حوّل منتجاتك إلى صدارة Google
          </h1>
          <p className="text-gray-300 text-lg">
            تحليل سيو ذكي، توليد تلقائي، أداء حقيقي. منصة صممت لتجعل متجرك يتألق.
          </p>
          <Link to="/register">
            <button className="bg-[#83dcc9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition">
              ابدأ الآن مجانًا
            </button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1 }}
          className="w-full md:w-[480px] h-[320px] bg-gradient-to-tr from-[#83dcc9]/30 to-transparent rounded-3xl shadow-[0_20px_60px_rgba(131,220,201,0.25)] animate-pulse"
        />
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-screen-xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">مميزات المنصة</h2>
          <p className="text-gray-400 text-base">حل متكامل لتحسين ظهور منتجاتك وتحقيق أداء استثنائي.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto text-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">توليد تلقائي للمحتوى</h3>
            <p className="text-sm text-gray-300">دع الذكاء الاصطناعي يكتب أوصاف منتجاتك ويختار الكلمات المفتاحية الأمثل.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">مؤشرات SEO فورية</h3>
            <p className="text-sm text-gray-300">تحليل حيّ لكل منتج مع اقتراحات مباشرة لتحسين الظهور.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">لوحة تحكم متقدمة</h3>
            <p className="text-sm text-gray-300">تابع أداء منتجاتك لحظة بلحظة من خلال لوحة مخصصة وسهلة الاستخدام.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-screen-xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">الباقات والأسعار</h2>
          <p className="text-gray-400 text-base">اختر الباقة التي تناسب حجم متجرك وطموحك.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto text-center">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">المجانية</h3>
            <p className="text-4xl font-extrabold mb-4">0 ريال</p>
            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              <li>توليد 3 منتجات شهريًا</li>
              <li>معاينة Google</li>
              <li>مؤشرات سيو أساسية</li>
            </ul>
            <button className="bg-gray-700 text-white font-semibold px-6 py-2 rounded-xl hover:bg-gray-600 transition">
              اختر الخطة
            </button>
          </div>

          <div className="bg-[#83dcc9] text-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition scale-105 border-2 border-white">
            <h3 className="text-xl font-bold mb-2">الاحترافية</h3>
            <p className="text-4xl font-extrabold mb-4">49 ريال</p>
            <ul className="text-sm text-gray-800 space-y-2 mb-6">
              <li>توليد 30 منتج شهريًا</li>
              <li>مؤشرات سيو متقدمة</li>
              <li>تحليل تلقائي + توصيات</li>
            </ul>
            <button className="bg-white text-[#111] font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition">
              اختر الخطة
            </button>
          </div>

          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">الأعمال</h3>
            <p className="text-4xl font-extrabold mb-4">129 ريال</p>
            <ul className="text-sm text-gray-300 space-y-2 mb-6">
              <li>توليد غير محدود</li>
              <li>مؤشرات وتحليل شامل</li>
              <li>دعم خاص ومتابعة مخصصة</li>
            </ul>
            <button className="bg-gray-700 text-white font-semibold px-6 py-2 rounded-xl hover:bg-gray-600 transition">
              اختر الخطة
            </button>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">جاهز تبدأ تحسين متجرك؟</h2>
        <p className="text-gray-300 mb-6">ابدأ الآن مجانًا وبدون بطاقة ائتمانية.</p>
        <Link to="/register">
          <button className="bg-[#83dcc9] text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-[#6cc9b9] transition">
            جرب المنصة مجانًا
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 border-t border-gray-700">
        © 2025 مشروع السيو الذكي. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}