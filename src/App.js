// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductsList from "./pages/ProductsList";
import ProductSEO from "./pages/ProductSEO";
import Account from "./pages/Account";
import Videos from "./pages/Videos";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import ManualLogin from "./pages/ManualLogin";
import { AuthProvider } from "./AuthContext";
import Checkout from "./pages/Checkout";
import AdminPromo from './pages/AdminPromo';
import PromoCodesManagement from './pages/PromoCodesManagement';
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Demo from './pages/Demo';

import "./index.css";

function App() {
  const clientName = "علي مبارك";

  return (
    <AuthProvider>
      <div dir="rtl" className="font-sans">
        <Routes>
          {/* صفحة الهبوط الرئيسية */}
          <Route path="/" element={<LandingPage />} />
          
          {/* صفحات التسجيل والدخول */}
          <Route path="/login" element={<ManualLogin />} />
          
          {/* الصفحات المحمية (بعد تسجيل الدخول) */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/product-seo" element={<ProductSEO />} />
          <Route path="/account" element={<Account />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product-seo/:id" element={<ProductSEO />} />
          <Route path="/admin-promo" element={<AdminPromo />} />
          <Route path="/admin/promo-codes" element={<PromoCodesManagement />} />
          <Route path="/about" element={<About />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/demo" element={<Demo />} />





          
          {/* مسارات إضافية للتوافق مع الكود القديم */}
          <Route path="/manual-login" element={<ManualLogin />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;