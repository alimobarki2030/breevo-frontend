import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  Crown,
  Gem,
  Gift,
  Building2,
  Search,
} from 'lucide-react';

const UnifiedNavbar = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // إغلاق القائمة المحمولة عند تغيير المسار
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // الحصول على معلومات المستخدم
  const getUserInitial = () => {
    // استخدم userData من getAuthState() أولاً
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    
    // تحقق من user العادي (للحالات العادية)
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    const storedName = localStorage.getItem("clientName");
    if (storedName) {
      return storedName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    // استخدم userData من getAuthState() أولاً
    if (userData?.name) return userData.name;
    if (userData?.email) return userData.email;
    
    // تحقق من user العادي (للحالات العادية)
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    
    const storedName = localStorage.getItem("clientName");
    if (storedName) return storedName;
    return "مستخدم";
  };

  // الحصول على باقة المستخدم (من localStorage أو user data)
  const getUserPlan = () => {
    return user?.plan || localStorage.getItem("userPlan") || "free";
  };

  // ✅ تحقق ذكي من حالة المصادقة - يتعامل مع loading state
  const getAuthState = () => {
    // إذا كان AuthContext لا يزال يتحقق، استخدم localStorage كمرجع مؤقت
    if (loading) {
      const hasToken = localStorage.getItem('token');
      const hasUser = localStorage.getItem('user');
      return {
        isLoggedIn: !!(hasToken && hasUser),
        userData: hasUser ? JSON.parse(hasUser) : null
      };
    }
    
    // إذا انتهى التحقق، استخدم النتيجة النهائية
    return {
      isLoggedIn: isAuthenticated,
      userData: user
    };
  };

  const { isLoggedIn, userData } = getAuthState();

  // معلومات الباقات
  const planInfo = {
    free: { 
      name: "مجانية", 
      icon: Gift, 
      color: "text-green-600 bg-green-100",
      products: "1/3 منتجات"
    },
    pro: { 
      name: "احترافية", 
      icon: Gem, 
      color: "text-blue-600 bg-blue-100",
      products: "15/30 منتج"
    },
    enterprise: { 
      name: "أعمال", 
      icon: Crown, 
      color: "text-purple-600 bg-purple-100",
      products: "∞ منتجات"
    }
  };

  const currentPlan = getUserPlan();
  const CurrentPlanIcon = planInfo[currentPlan]?.icon || Gift;

  // التحقق من الموقع المختار
  const selectedSite = localStorage.getItem("selected_site");

  // تحديد نوع الصفحة الحالية
  const getCurrentPageType = () => {
    const path = location.pathname.toLowerCase();
    
    // تحقق من جميع الاحتمالات لصفحات المصادقة
    if (path.includes('/login') || path.includes('/register') || 
        path === '/login' || path === '/register' ||
        path === '/login/' || path === '/register/') {
      return 'auth'; // صفحات التسجيل والدخول
    }
    
    return 'default'; // باقي الصفحات
  };

  // دالة الحصول على عناصر القائمة حسب حالة المستخدم ونوع الصفحة
  const getMenuItems = () => {
    const pageType = getCurrentPageType();
    
    // صفحات التسجيل والدخول - مبسطة
    if (pageType === 'auth') {
      return [
        { path: '/', label: 'الرئيسية' },
        { path: '/contact', label: 'الدعم' }
      ];
    }
    
    // المستخدم المسجل
    if (isLoggedIn) {
      const baseItems = [
        { path: '/contact', label: 'التواصل' },
        { path: '/videos', label: 'شروحات الفيديو' }
      ];

      // إضافة عناصر حسب الباقة
      if (currentPlan === 'pro' || currentPlan === 'enterprise') {
        baseItems.push({ path: '/keyword-research', label: 'تحليل الكلمات المفتاحية' });
      }
      
      if (currentPlan === 'enterprise') {
        baseItems.push({ path: '/competitor-analysis', label: 'تحليل المنافسين' });
      }

      return baseItems;
    } 
    
    // المستخدم غير المسجل
    return [
      { path: '/features', label: 'المميزات' },
      { path: '/pricing', label: 'الأسعار' },
      { path: '/how-it-works', label: 'كيف يعمل' },
      { path: '/contact', label: 'اتصل بنا' }
    ];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 text-white py-4 px-6 shadow-sm border-b border-gray-800">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo3.png" alt="Logo" className="h-9" />
          </Link>
          
          {/* عرض الموقع المختار إذا كان متوفراً */}
          {selectedSite && (
            <span className="ml-4 text-sm bg-green-600 px-3 py-1 rounded-full">
              {selectedSite}
            </span>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          
          {/* عرض الروابط المناسبة */}
          {getMenuItems().map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`transition-colors ${
                isActivePath(item.path) 
                  ? 'text-[#4BB8A9] font-semibold' 
                  : 'hover:text-[#4BB8A9]'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* User Menu or Login Button */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* User Avatar with Plan Indicator */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-[#4BB8A9] text-gray-900 flex items-center justify-center font-bold">
                  {getUserInitial()}
                </div>
                
                {/* Plan Badge */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${planInfo[currentPlan]?.color}`}>
                  <CurrentPlanIcon size={12} />
                  <span>{planInfo[currentPlan]?.name}</span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-md shadow-lg py-2 z-50 border border-gray-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold truncate">{getUserDisplayName()}</p>
                    {userData?.email && (
                      <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                    )}
                    <div className={`flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${planInfo[currentPlan]?.color}`}>
                      <CurrentPlanIcon size={12} />
                      <span>الباقة {planInfo[currentPlan]?.name}</span>
                      <span className="mr-auto text-gray-500">({planInfo[currentPlan]?.products})</span>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <Link
                    to="/account"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={16} />
                    حسابي
                  </Link>
                  
                  <Link
                    to="/account#stats"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <BarChart3 size={16} />
                    إحصائياتي
                  </Link>

                  {/* Upgrade Plan */}
                  {currentPlan !== 'enterprise' && (
                    <Link
                      to="/pricing"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Crown size={16} />
                      ترقية الباقة ⭐
                    </Link>
                  )}
                  
                  <Link
                    to="/account#billing"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <CreditCard size={16} />
                    الفواتير
                  </Link>

                  <Link
                    to="/account#notifications"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Bell size={16} />
                    الإشعارات
                  </Link>
                  
                  <Link
                    to="/account#settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings size={16} />
                    الإعدادات
                  </Link>

                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <HelpCircle size={16} />
                    المساعدة والدعم
                  </Link>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#4BB8A9] text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-[#6cc9b9] transition"
            >
              دخول
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 bg-gray-900 border border-gray-700 rounded-xl mt-2 py-4 px-4 shadow-2xl z-40 md:hidden">
            <div className="flex flex-col space-y-4">
              
              {/* معلومات المستخدم المسجل */}
              {isLoggedIn && (
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <p className="font-semibold text-sm">{getUserDisplayName()}</p>
                  {userData?.email && (
                    <p className="text-xs text-gray-400">{userData.email}</p>
                  )}
                  <div className={`flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${planInfo[currentPlan]?.color.replace('bg-', 'bg-opacity-20 bg-')}`}>
                    <CurrentPlanIcon size={12} />
                    <span className="text-white">الباقة {planInfo[currentPlan]?.name}</span>
                  </div>
                  {selectedSite && (
                    <p className="text-xs text-green-400 mt-1">{selectedSite}</p>
                  )}
                </div>
              )}

              {/* عرض جميع الروابط المناسبة للمستخدم */}
              {getMenuItems().map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`transition-colors py-2 ${
                    isActivePath(item.path) 
                      ? 'text-[#4BB8A9] font-semibold' 
                      : 'hover:text-[#4BB8A9]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* قائمة المستخدم في الموبايل */}
              {isLoggedIn && (
                <>
                  <hr className="border-gray-700" />
                  
                  <Link
                    to="/account"
                    className="flex items-center gap-3 py-2 text-sm hover:text-[#4BB8A9] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    حسابي
                  </Link>

                  {currentPlan !== 'enterprise' && (
                    <Link
                      to="/pricing"
                      className="flex items-center gap-3 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Crown size={16} />
                      ترقية الباقة ⭐
                    </Link>
                  )}
                </>
              )}

              {/* زر الدخول أو الخروج */}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors py-2 text-right text-sm"
                >
                  <LogOut size={16} />
                  تسجيل الخروج
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-[#4BB8A9] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-[#6cc9b9] transition text-center mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  دخول
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UnifiedNavbar;