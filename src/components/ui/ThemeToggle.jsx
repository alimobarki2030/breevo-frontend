// src/components/ui/ThemeToggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ size = 'md', className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        rounded-lg 
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        border border-gray-300 dark:border-gray-600
        flex items-center justify-center
        transition-all duration-300
        relative overflow-hidden
        ${className}
      `}
      aria-label={`تبديل إلى الوضع ${theme === 'light' ? 'المظلم' : 'المضيء'}`}
    >
      {/* Sun Icon */}
      <Sun 
        className={`
          ${iconSizes[size]} text-amber-500 
          absolute transition-all duration-300 transform
          ${theme === 'light' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0'
          }
        `} 
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`
          ${iconSizes[size]} text-slate-700 dark:text-slate-300
          absolute transition-all duration-300 transform
          ${theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
          }
        `} 
      />
    </button>
  );
};

export default ThemeToggle;