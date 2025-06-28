import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Target, Crown } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // ✅ جلب بيانات المستخدم من localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const clientName = storedUser?.name || "العميل";

  // ✅ إدارة الاشتراك والخطة
  const [userPlan, setUserPlan] = useState("free");

  useEffect(() => {
    const user = safeLocalStorageGet("user", {});
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    const plan = subscription.plan || user.plan || "free";
    
    // Check if this is the site owner - full access always
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    setUserPlan(isOwner ? "owner" : plan);
  }, []);

  // ✅ تحديد الروابط الأساسية
  const basicLinks = [
    { to: "/products", label: "منتجاتي", icon: "📦" },
    { to: "/videos", label: "شروحات الفيديو", icon: "🎥" },
    { to: "/settings", label: "الإعدادات", icon: "⚙️" },
  ];

  // ✅ الروابط المتقدمة حسب الخطة
  const advancedLinks = [];

  // Professional plan and above: Add keyword research
  if (userPlan === "professional" || userPlan === "business" || userPlan === "enterprise" || userPlan === "owner") {
    advancedLinks.push({
      to: "/keyword-research",
      label: "بحث الكلمات المفتاحية",
      icon: "🔍",
      badge: userPlan === "professional" ? "Pro" : null
    });
  }

  // Business plan and above: Add competitor analysis
  if (userPlan === "business" || userPlan === "enterprise" || userPlan === "owner") {
    advancedLinks.push({
      to: "/competitor-analysis",
      label: "تحليل المنافسين",
      icon: "⚔️",
      badge: userPlan === "business" ? "Business" : null
    });
  }

  // ✅ دالة لعرض شارة الخطة
  const renderPlanBadge = (badge) => {
    if (!badge) return null;
    
    const badgeColors = {
      "Pro": "bg-blue-100 text-blue-800 border-blue-200",
      "Business": "bg-purple-100 text-purple-800 border-purple-200",
      "Enterprise": "bg-green-100 text-green-800 border-green-200"
    };

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${badgeColors[badge] || badgeColors.Pro}`}>
        {badge}
      </span>
    );
  };

  {/* روابط المدير فقط (إدارة الفيديوهات) */}
{userPlan === "owner" && (
  <div className="mb-4">
    <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
      إدارة
    </div>
    <Link
      to="/admin/videos"
      className={`flex items-center gap-3 px-4 py-2 rounded transition font-medium ${
        isActive("/admin/videos") ? "bg-[#d1e7f5] text-sky-900" : "hover:bg-[#e8f3fa]"}`}
    >
      <span>🎬</span>
      إدارة الفيديوهات
    </Link>
  </div>
)}


  // ✅ دالة لعرض خطة المستخدم
  const getPlanDisplayName = (plan) => {
    const planNames = {
      "free": "مجانية",
      "professional": "احترافية",
      "business": "أعمال",
      "enterprise": "مؤسسية",
      "owner": "مالك الموقع"
    };
    return planNames[plan] || "مجانية";
  };

  const getPlanColor = (plan) => {
    const planColors = {
      "free": "text-gray-600",
      "professional": "text-blue-600",
      "business": "text-purple-600", 
      "enterprise": "text-green-600",
      "owner": "text-yellow-600"
    };
    return planColors[plan] || "text-gray-600";
  };

  return (
    <aside className="w-64 bg-[#f4f8fb] text-slate-800 min-h-screen p-5 shadow-md hidden md:block">
      {/* ترحيب بالعميل مع عرض الخطة */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-2">
          👋 مرحباً، {clientName.split(" ")[0]}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Crown className="w-3 h-3" />
          <span className={`font-semibold ${getPlanColor(userPlan)}`}>
            خطة {getPlanDisplayName(userPlan)}
          </span>
        </div>
      </div>

      {/* روابط التنقل */}
      <nav className="space-y-3">
        {/* الروابط الأساسية */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            الأساسيات
          </div>
          {basicLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2 rounded transition font-medium ${
                isActive(to) ? "bg-[#d1e7f5] text-sky-900" : "hover:bg-[#e8f3fa]"
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* الروابط المتقدمة */}
        {advancedLinks.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              أدوات متقدمة
            </div>
            {advancedLinks.map(({ to, label, icon, badge }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-2 rounded transition font-medium ${
                  isActive(to) ? "bg-[#d1e7f5] text-sky-900" : "hover:bg-[#e8f3fa]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{icon}</span>
                  {label}
                </div>
                {renderPlanBadge(badge)}
              </Link>
            ))}
          </div>
        )}

        {/* رسالة ترقية للخطط المجانية */}
        {userPlan === "free" && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="text-center">
              <Crown className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 mb-2">ترقية خطتك</h4>
              <p className="text-xs text-gray-600 mb-3">
                احصل على أدوات البحث المتقدمة وتحليل المنافسين
              </p>
              <Link
                to="/pricing"
                className="inline-block bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                عرض الباقات
              </Link>
            </div>
          </div>
        )}

        {/* رسالة ترقية للخطة الاحترافية */}
        {userPlan === "professional" && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
            <div className="text-center">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 mb-2">ارقَ لخطة الأعمال</h4>
              <p className="text-xs text-gray-600 mb-3">
                احصل على تحليل المنافسين وميزات إضافية
              </p>
              <Link
                to="/pricing"
                className="inline-block bg-purple-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                ترقية الآن
              </Link>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}