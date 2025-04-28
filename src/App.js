import React from "react";
import { Routes, Route } from "react-router-dom";
import AnalyticsOverview from "./pages/AnalyticsOverview";
import ProductsList from "./pages/ProductsList";
import ProductSEO from "./pages/ProductSEO";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Videos from "./pages/Videos";       // ✅ أضف هذا
import Settings from "./pages/Settings";   // ✅ وأضف هذا
import './index.css';
import LandingPage from "./pages/LandingPage";
import SiteSelector from "./pages/SiteSelector";
import CompleteAuth from "./pages/CompleteAuth";
import AnalyticsUTM from "./pages/AnalyticsUTM";
import ManualLogin from "./pages/ManualLogin";


function App() {
  const clientName = "علي مبارك";

  return (
    <div dir="rtl" className="font-sans">
  <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/account" element={<Account />} />
  <Route path="/videos" element={<Videos />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/products" element={<ProductsList />} />
  <Route path="/product-seo" element={<ProductSEO />} />
  <Route path="/analytics" element={<AnalyticsOverview />} />
  <Route path="/analytics-utm" element={<AnalyticsUTM />} />
  <Route path="/site-selector" element={<SiteSelector />} />
  <Route path="/complete-auth" element={<CompleteAuth />} />
  <Route path="/manual-login" element={<ManualLogin />} />
  <Route path="/error-auth" element={<div>فشل تسجيل الدخول بحساب Google. يرجى المحاولة لاحقًا.</div>} />
</Routes>

    </div>
  );
}

export default App;
