import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../config/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('backend_token');
      
      if (token) {
        try {
          // التحقق من صحة التوكن مع Backend
          const verifiedUser = await authAPI.verifyToken();
          
          if (verifiedUser) {
            setUser(verifiedUser);
            setIsAuthenticated(true);
            
            // حفظ البيانات للتوافق
            localStorage.setItem('user', JSON.stringify(verifiedUser));
            if (verifiedUser.full_name || verifiedUser.name) {
              localStorage.setItem('clientName', verifiedUser.full_name || verifiedUser.name);
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // إذا فشل التحقق، نظف البيانات
          await logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // استخدام Backend API
      const data = await authAPI.login(credentials.email, credentials.password);
      
      if (data.access_token) {
        // حفظ التوكن في جميع الأماكن المحتملة
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('backend_token', data.access_token);
        
        // حفظ بيانات المستخدم
        const userData = data.user || { email: credentials.email };
        setUser(userData);
        setIsAuthenticated(true);
        
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.full_name || userData.name) {
          localStorage.setItem('clientName', userData.full_name || userData.name);
        }
        
        return { success: true, user: userData };
      }
      
      throw new Error('No access token received');
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'حدث خطأ أثناء تسجيل الدخول' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // استخدام Backend API للتسجيل
      const data = await authAPI.register({
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName || userData.full_name,
        phone: userData.phone,
        store_url: userData.storeUrl || userData.store_url,
        plan: userData.plan || 'free'
      });
      
      if (data.access_token) {
        // حفظ التوكن
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('backend_token', data.access_token);
        
        // حفظ بيانات المستخدم
        const user = data.user || { email: userData.email };
        setUser(user);
        setIsAuthenticated(true);
        
        localStorage.setItem('user', JSON.stringify(user));
        if (user.full_name || user.name) {
          localStorage.setItem('clientName', user.full_name || user.name);
        }
        
        return { success: true, user };
      }
      
      throw new Error('No access token received');
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message || 'حدث خطأ أثناء إنشاء الحساب' 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('backend_token');
      
      // محاولة إشعار Backend بتسجيل الخروج
      if (token) {
        try {
          await authAPI.logout();
        } catch (error) {
          console.log('Could not notify server of logout');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // تنظيف البيانات المحلية في جميع الأحوال
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('backend_token');
      localStorage.removeItem('user');
      localStorage.removeItem('clientName');
      localStorage.removeItem('selected_site');
      
      // تنظيف بيانات Supabase القديمة
      localStorage.removeItem('sb-afkxzvmbrymdpvyfzyzn-auth-token');
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('backend_token');
      
      if (!token) {
        throw new Error('لا يوجد توكن صالح');
      }

      const API_BASE_URL = process.env.REACT_APP_API_URL || "https://breevo-backend.onrender.com";
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (response.ok) {
        // تحديث البيانات المحلية
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (updatedUser.full_name || updatedUser.name) {
          localStorage.setItem('clientName', updatedUser.full_name || updatedUser.name);
        }
        
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error(data.message || 'فشل في تحديث البيانات');
      }
    } catch (error) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        error: error.message || 'حدث خطأ أثناء تحديث البيانات' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};