import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import PointsBalance from '../points/PointsBalance'; // إضافة استيراد مكون الرصيد
import { 
  User, Settings, BarChart3, CreditCard, Bell, HelpCircle, LogOut,
  Crown, Gem, Gift, Coins // إضافة أيقونة النقاط
} from 'lucide-react';

const UserNavbar = () => {
  const { user, logout } = useAuth();
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
  const getUserInfo = () => {
    if (user) return user;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    
    const storedName = localStorage.getItem('clientName');
    if (storedName) {
      return { name: storedName };
    }
    
    return { name: 'مستخدم' };
  };

  const getUserInitial = () => {
    const userInfo = getUserInfo();
    if (userInfo?.name) {
      return userInfo.name.charAt(0).toUpperCase();
    }
    if (userInfo?.email) {
      return userInfo.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    const userInfo = getUserInfo();
    if (userInfo?.name) return userInfo.name;
    if (userInfo?.email) return userInfo.email;
    return "مستخدم";
  };

  // ✅ الحصول على معلومات المستخدم أولاً
  const userInfo = getUserInfo();
  const userPlan = userInfo?.plan || localStorage.getItem('userPlan') || 'free';
  const selectedSite = localStorage.getItem("selected_site");

  // ✅ التحقق من كون المستخدم هو المالك
  const checkIfOwner = () => {
    const ownerEmail = "alimobarki.ad@gmail.com";
    return userInfo?.email === ownerEmail || 
           userInfo?.role === "owner" || 
           userInfo?.role === "admin" ||
           localStorage.getItem("userRole") === "owner";
  };

  const isOwnerUser = checkIfOwner();

  // معلومات الباقات + المالك
  const planInfo = {
    free: { 
      name: "مجانية", 
      icon: Gift, 
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
      products: "1/3 منتجات"
    },
    pro: { 
      name: "احترافية", 
      icon: Gem, 
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      products: "15/30 منتج"
    },
    enterprise: { 
      name: "أعمال", 
      icon: Crown, 
      color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
      products: "∞ منتجات"
    },
    owner: { 
      name: "مالك الموقع", 
      icon: Crown, 
      color: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
      products: "∞ مالك"
    }
  };

  // تحديد الباقة المعروضة
  const displayPlan = isOwnerUser ? 'owner' : userPlan;
  const CurrentPlanIcon = planInfo[displayPlan]?.icon || Gift;

  // قائمة الروابط للمستخدمين المسجلين
  const getUserMenuItems = () => {
    const baseItems = [
      { path: '/products', label: 'منتجاتي' },
      { path: '/points', label: 'النقاط', icon: Coins } // إضافة رابط النقاط
    ];

    // ✅ إذا كان المالك - يرى كل شيء + لوحة الإدارة
    if (isOwnerUser) {
      baseItems.push(
        { path: '/keyword-research', label: 'بحث الكلمات المفتاحية' },
        { path: '/competitor-analysis', label: 'تحليل المنافسين' },
        { path: '/admin-promo', label: '🔧 لوحة الإدارة' },
        { path: '/contact', label: 'التواصل' },
        { path: '/videos', label: 'شروحات الفيديو' }
      );
    } else {
      // ✅ للعملاء العاديين - حسب الباقة
      if (userPlan === 'pro' || userPlan === 'enterprise') {
        baseItems.push(
          { path: '/keyword-research', label: 'بحث الكلمات المفتاحية' }
        );
      }
      
      if (userPlan === 'enterprise') {
        baseItems.push(
          { path: '/competitor-analysis', label: 'تحليل المنافسين' }
        );
      }

      baseItems.push(
        { path: '/contact', label: 'التواصل' },
        { path: '/videos', label: 'شروحات الفيديو' }
      );
    }

    return baseItems;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-md text-white py-4 px-6 shadow-lg border-b border-gray-700/50 dark:border-gray-600/50 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo3.png" alt="Logo" className="h-9" />
          </Link>
          
          {/* عرض الموقع المختار إذا كان متوفراً */}
          {selectedSite && (
            <span className="ml-4 text-sm bg-green-600 dark:bg-green-500 px-3 py-1 rounded-full transition-colors duration-300">
              {selectedSite}
            </span>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          
          {/* روابط المستخدم */}
          {getUserMenuItems().map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-2 transition-colors duration-300 ${
                isActivePath(item.path) 
                  ? 'text-[#83dcc9] font-semibold' 
                  : 'text-gray-300 dark:text-gray-400 hover:text-[#83dcc9]'
              }`}
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </Link>
          ))}

          {/* عرض رصيد النقاط */}
          <PointsBalance />

          {/* Theme Toggle */}
          <ThemeToggle variant="navbar" size="md" className="ml-4" />

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            {/* User Avatar with Plan Indicator */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-[#83dcc9] text-gray-900 flex items-center justify-center font-bold">
                {getUserInitial()}
              </div>
              
              {/* Plan Badge */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${planInfo[displayPlan]?.color} transition-colors duration-300`}>
                <CurrentPlanIcon size={12} />
                <span>{planInfo[displayPlan]?.name}</span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold truncate">{getUserDisplayName()}</p>
                  {userInfo?.email && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{userInfo.email}</p>
                  )}
                  <div className={`flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${planInfo[displayPlan]?.color}`}>
                    <CurrentPlanIcon size={12} />
                    <span>الباقة {planInfo[displayPlan]?.name}</span>
                    <span className="mr-auto text-gray-500 dark:text-gray-400">({planInfo[displayPlan]?.products})</span>
                  </div>
                </div>
                
                {/* Menu Items */}
                <Link
                  to="/account"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User size={16} />
                  حسابي
                </Link>

                <Link
                  to="/points"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Coins size={16} />
                  نظام النقاط
                </Link>
                
                <Link
                  to="/account#stats"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <BarChart3 size={16} />
                  إحصائياتي
                </Link>

                {/* Upgrade Plan - لا يظهر للمالك */}
                {!isOwnerUser && userPlan !== 'enterprise' && (
                  <Link
                    to="/pricing"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Crown size={16} />
                    ترقية الباقة ⭐
                  </Link>
                )}
                
                <Link
                  to="/account#billing"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <CreditCard size={16} />
                  الفواتير
                </Link>

                <Link
                  to="/account#notifications"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Bell size={16} />
                  الإشعارات
                </Link>
                
                <Link
                  to="/account#settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings size={16} />
                  الإعدادات
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <HelpCircle size={16} />
                  المساعدة والدعم
                </Link>
                
                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={16} />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3 space-x-reverse">
          {/* عرض رصيد النقاط للموبايل */}
          <PointsBalance />
          
          {/* Theme Toggle for Mobile */}
          <ThemeToggle variant="navbar" size="sm" />
          
          <button 
            className="text-white z-50 relative"
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-600/50 dark:border-gray-500/50 rounded-xl mt-2 py-4 px-4 shadow-2xl z-40 md:hidden transition-colors duration-300">
            <div className="flex flex-col space-y-4">
              
              {/* معلومات المستخدم */}
              <div className="bg-gray-700/50 dark:bg-gray-800/50 rounded-lg p-3 mb-4 transition-colors duration-300">
                <p className="font-semibold text-sm text-white">{getUserDisplayName()}</p>
                {userInfo?.email && (
                  <p className="text-xs text-gray-300 dark:text-gray-400">{userInfo.email}</p>
                )}
                <div className={`flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${planInfo[displayPlan]?.color}`}>
                  <CurrentPlanIcon size={12} />
                  <span>الباقة {planInfo[displayPlan]?.name}</span>
                </div>
                {selectedSite && (
                  <p className="text-xs text-green-400 dark:text-green-300 mt-1">{selectedSite}</p>
                )}
              </div>

              {/* روابط المستخدم */}
              {getUserMenuItems().map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center gap-2 transition-colors duration-300 py-2 ${
                    isActivePath(item.path) 
                      ? 'text-[#83dcc9] font-semibold' 
                      : 'text-gray-300 dark:text-gray-400 hover:text-[#83dcc9]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon size={16} />}
                  {item.label}
                </Link>
              ))}

              <hr className="border-gray-600 dark:border-gray-500" />
              
              {/* روابط الحساب */}
              <Link
                to="/account"
                className="flex items-center gap-3 py-2 text-sm text-gray-300 dark:text-gray-400 hover:text-[#83dcc9] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={16} />
                حسابي
              </Link>

              {!isOwnerUser && userPlan !== 'enterprise' && (
                <Link
                  to="/pricing"
                  className="flex items-center gap-3 py-2 text-sm text-blue-400 dark:text-blue-300 hover:text-blue-300 dark:hover:text-blue-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Crown size={16} />
                  ترقية الباقة ⭐
                </Link>
              )}

              {/* زر تسجيل الخروج */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-400 dark:text-red-300 hover:text-red-300 dark:hover:text-red-200 transition-colors py-2 text-right text-sm"
              >
                <LogOut size={16} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;