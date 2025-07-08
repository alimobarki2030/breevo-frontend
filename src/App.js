// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

// استيراد الصفحات
import ProductsList from "./pages/ProductsList";
import ProductSEO from "./pages/ProductSEO";
import Account from "./pages/Account";
import Videos from "./pages/Videos";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import ManualLogin from "./pages/ManualLogin";
import Checkout from "./pages/Checkout";
import AdminPromo from './pages/AdminPromo';
import PromoCodesManagement from './pages/PromoCodesManagement';
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Demo from './pages/Demo';
import KeywordResearch from './pages/KeywordResearch';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import DataForSEOTest from './components/DataForSEOTest';
import AdminVideoUpload from './pages/AdminVideoUpload';
import PaymentResult from './pages/PaymentResult';
import SupabaseTest from './components/SupabaseTest';
import ConnectStore from './pages/ConnectStore';
import SallaCallback from './pages/SallaCallback';
import PointsDashboard from './components/points/PointsDashboard';

import "./index.css";

function App() {
  console.log('App.js loaded - ThemeProvider and AuthProvider will wrap the app');
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <div dir="rtl" className="font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<ManualLogin />} />
            <Route path="/supabase-test" element={<SupabaseTest />} />
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
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/keyword-research" element={<KeywordResearch />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
            <Route path="/api-test" element={<DataForSEOTest />} />
            <Route path="/admin/videos" element={<AdminVideoUpload />} />
            <Route path="/payment/callback" element={<PaymentResult />} />
            <Route path="/payment/result" element={<PaymentResult />} />
            <Route path="/manual-login" element={<ManualLogin />} />
            <Route path="/connect-store" element={<ConnectStore />} />
            <Route path="/salla/callback" element={<SallaCallback />} />
            <Route path="/points" element={<PointsDashboard />} />
          </Routes>
          
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 6000,
              style: {
                background: '#16a34a',
                color: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '500',
                textAlign: 'center',
                direction: 'rtl'
              },
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;