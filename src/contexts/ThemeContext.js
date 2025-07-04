// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // تحقق من تفضيل النظام
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // تطبيق التيم على الـ HTML
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // إزالة كلاس الثيم السابق
      root.classList.remove('light', 'dark');
      
      // إضافة كلاس الثيم الجديد
      root.classList.add(theme);
      
      // إضافة data attribute
      root.setAttribute('data-theme', theme);
      
      // للتأكد من Tailwind dark mode
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // للتطوير: طباعة حالة الثيم الحالية
  console.log('Current theme:', theme);

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};