import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuthNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // إغلاق القائمة المحمولة عند تغيير المسار
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // قائمة روابط مبسطة لصفحة الدخول (تجنب التشتيت)
  const authMenuItems = [
    { path: '/', label: 'الرئيسية' },
    { path: '/contact', label: 'الدعم' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 text-white py-4 px-6 shadow-sm border-b border-gray-800">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo22.png" alt="Logo" className="h-9" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          
          {/* الروابط المبسطة */}
          {authMenuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`transition-colors ${
                isActivePath(item.path) 
                  ? 'text-[#83dcc9] font-semibold' 
                  : 'hover:text-[#83dcc9]'
              }`}
            >
              {item.label}
            </Link>
          ))}
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
              
              {/* الروابط المبسطة */}
              {authMenuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`transition-colors py-2 ${
                    isActivePath(item.path) 
                      ? 'text-[#83dcc9] font-semibold' 
                      : 'hover:text-[#83dcc9]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;