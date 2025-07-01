import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // محاولة التحقق من صحة التوكن مع الخادم
          try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const verifiedUser = await response.json();
              setUser(verifiedUser);
              setIsAuthenticated(true);
            } else {
              // إذا كان التوكن غير صالح، نظف البيانات
              throw new Error('Invalid token');
            }
          } catch (apiError) {
            // إذا لم يكن الخادم متاحاً، استخدم البيانات المحلية
            console.log('API not available, using local data');
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // إذا كانت البيانات تالفة، نظف كل شيء
          console.error('Corrupted user data:', error);
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ التوكن والبيانات
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // حفظ اسم العميل للتوافق مع النظام القديم
        if (data.user.name) {
          localStorage.setItem('clientName', data.user.name);
        }

        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'فشل في تسجيل الدخول');
      }
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        // حفظ التوكن والبيانات
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // حفظ اسم العميل للتوافق مع النظام القديم
        if (data.user.name) {
          localStorage.setItem('clientName', data.user.name);
        }

        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'فشل في إنشاء الحساب');
      }
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
      const token = localStorage.getItem('token');
      
      // محاولة إشعار الخادم بتسجيل الخروج
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (apiError) {
          // لا بأس إذا فشل إشعار الخادم
          console.log('Could not notify server of logout');
        }
      }

      // تنظيف البيانات المحلية
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('clientName');
      localStorage.removeItem('selected_site');
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // حتى لو حدث خطأ، نظف البيانات المحلية
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('clientName');
      localStorage.removeItem('selected_site');
      
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('لا يوجد توكن صالح');
      }

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
        
        // تحديث اسم العميل للتوافق مع النظام القديم
        if (updatedUser.name) {
          localStorage.setItem('clientName', updatedUser.name);
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