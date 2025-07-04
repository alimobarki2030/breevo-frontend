// src/components/ui/ThemeToggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ variant = 'navbar', size = 'md', className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  // طباعة للتطوير
  console.log('ThemeToggle - Current theme:', theme, 'isDark:', isDark);
  
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

  // أنماط مختلفة للنافبار والاستخدامات الأخرى
  const variantClasses = {
    navbar: `
      ${sizeClasses[size]} 
      rounded-lg 
      bg-white/10 hover:bg-white/20 
      dark:bg-gray-800/50 dark:hover:bg-gray-700/50
      border border-white/20 dark:border-gray-600/50
      backdrop-blur-sm
      flex items-center justify-center
      transition-all duration-300
      relative overflow-hidden
    `,
    standalone: `
      ${sizeClasses[size]} 
      rounded-xl 
      bg-gray-100 hover:bg-gray-200 
      dark:bg-gray-800 dark:hover:bg-gray-700
      border border-gray-300 dark:border-gray-600
      flex items-center justify-center
      transition-all duration-300
      relative overflow-hidden
      shadow-lg hover:shadow-xl
    `,
    minimal: `
      ${sizeClasses[size]} 
      rounded-full 
      bg-transparent hover:bg-gray-100/50
      dark:hover:bg-gray-800/50
      flex items-center justify-center
      transition-all duration-300
      relative overflow-hidden
    `
  };

  const handleToggle = () => {
    console.log('ThemeToggle clicked! Current theme:', theme, 'Will change to:', theme === 'light' ? 'dark' : 'light');
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${variantClasses[variant]}
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
          ${iconSizes[size]} text-blue-400 dark:text-blue-300
          absolute transition-all duration-300 transform
          ${theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
          }
        `} 
      />
      
      {/* نص للتطوير (سيتم إزالته لاحقاً) */}
      <span className="sr-only">Current: {theme}</span>
    </button>
  );
};

export default ThemeToggle;