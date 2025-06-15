// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import AnalyticsOverview from "./pages/AnalyticsOverview";
import ProductsList from "./pages/ProductsList";
import ProductSEO from "./pages/ProductSEO";
import RegisterLanding from "./pages/Register";
import Account from "./pages/Account";
import Videos from "./pages/Videos";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import ManualLogin from "./pages/ManualLogin";
import { AuthProvider } from "./AuthContext";

import "./index.css";

function App() {
  const clientName = "علي مبارك";

  return (
    <AuthProvider>
      <div dir="rtl" className="font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterLanding />} />
          <Route path="/account" element={<Account />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/product-seo" element={<ProductSEO />} />
          <Route path="/analytics" element={<AnalyticsOverview />} />
          <Route path="/manual-login" element={<ManualLogin />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
