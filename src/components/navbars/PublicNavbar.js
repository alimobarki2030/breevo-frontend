import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const PublicNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // إغلاق القائمة المحمولة عند تغيير المسار
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // قائمة الروابط للصفحات العامة
  const publicMenuItems = [
    { path: '/features', label: 'المميزات' },
    { path: '/pricing', label: 'الأسعار' },
    { path: '/how-it-works', label: 'كيف يعمل' },
    { path: '/about', label: 'من نحن' },
    { path: '/contact', label: 'اتصل بنا' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-md text-white py-4 px-6 shadow-lg border-b border-gray-700/50 dark:border-gray-600/50 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo3.png" alt="Logo" className="h-9" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          
          {/* الروابط العامة */}
          {publicMenuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`transition-colors duration-300 ${
                isActivePath(item.path) 
                  ? 'text-[#83dcc9] font-semibold' 
                  : 'text-gray-300 dark:text-gray-400 hover:text-[#83dcc9]'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <ThemeToggle variant="navbar" size="md" className="ml-4" />

          {/* زر الدخول */}
          <Link
            to="/login"
            className="bg-[#83dcc9] text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-[#6cc9b9] transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            دخول
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3 space-x-reverse">
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
              
              {/* الروابط العامة */}
              {publicMenuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`transition-colors duration-300 py-2 ${
                    isActivePath(item.path) 
                      ? 'text-[#83dcc9] font-semibold' 
                      : 'text-gray-300 dark:text-gray-400 hover:text-[#83dcc9]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* زر الدخول */}
              <Link 
                to="/login" 
                className="bg-[#83dcc9] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-[#6cc9b9] transition-colors duration-300 text-center mt-4 shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                دخول
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;