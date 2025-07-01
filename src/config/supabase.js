import { createClient } from '@supabase/supabase-js'

// إعداد Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!')
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Found' : '❌ Missing')
  throw new Error('Missing Supabase environment variables')
}

// إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // مهم للأمان
  }
})

console.log('✅ Supabase client initialized successfully')

// =======================================================
// 🔐 دوال المصادقة (Authentication)
// =======================================================

export const auth = {
  // تسجيل دخول بالإيميل وكلمة المرور
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      
      if (error) {
        console.error('❌ Sign in error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ User signed in:', data.user?.email)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Sign in exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // تسجيل حساب جديد
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: metadata.full_name || '',
            phone: metadata.phone || '',
            store_url: metadata.store_url || '',
            plan: metadata.plan || 'free'
          }
        }
      })
      
      if (error) {
        console.error('❌ Sign up error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ User signed up:', data.user?.email)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Sign up exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // تسجيل دخول بـ Google
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/products`
        }
      })
      
      if (error) {
        console.error('❌ Google sign in error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Google sign in initiated')
      return { data, error: null }
    } catch (err) {
      console.error('❌ Google sign in exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // ✅ إعادة تعيين كلمة المرور - دالة جديدة
  resetPasswordForEmail: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        console.error('❌ Reset password error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Reset password email sent')
      return { data, error: null }
    } catch (err) {
      console.error('❌ Reset password exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // تسجيل خروج
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Sign out error:', error.message)
        return { error }
      }
      
      console.log('✅ User signed out')
      
      // تنظيف التخزين المحلي
      localStorage.removeItem('token')
      localStorage.removeItem('clientName')
      localStorage.removeItem('user')
      
      return { error: null }
    } catch (err) {
      console.error('❌ Sign out exception:', err)
      return { error: { message: err.message } }
    }
  },

  // الحصول على المستخدم الحالي
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ Get user error:', error.message)
        return { user: null, error }
      }
      
      return { user, error: null }
    } catch (err) {
      console.error('❌ Get user exception:', err)
      return { user: null, error: { message: err.message } }
    }
  },

  // الحصول على الجلسة الحالية
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Get session error:', error.message)
        return { session: null, error }
      }
      
      return { session, error: null }
    } catch (err) {
      console.error('❌ Get session exception:', err)
      return { session: null, error: { message: err.message } }
    }
  },

  // الاستماع لتغييرات المصادقة
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Auth event: ${event}`, session?.user?.email || 'No user')
      callback(event, session)
    })
  }
}

// =======================================================
// 🗄️ دوال قاعدة البيانات (Database)
// =======================================================

export const database = {
  // الحصول على المنتجات للمستخدم الحالي
  getProducts: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: [], error: { message: 'User not authenticated' } }
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Get products error:', error.message)
        return { data: [], error }
      }
      
      console.log(`✅ Loaded ${data?.length || 0} products`)
      return { data: data || [], error: null }
    } catch (err) {
      console.error('❌ Get products exception:', err)
      return { data: [], error: { message: err.message } }
    }
  },

  // إضافة منتج جديد
  addProduct: async (productData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Add product error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Product added:', data.name)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Add product exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // تحديث منتج
  updateProduct: async (productId, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Update product error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Product updated:', data.name)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Update product exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // حذف منتج
  deleteProduct: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .select()
      
      if (error) {
        console.error('❌ Delete product error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Product deleted')
      return { data: data?.[0], error: null }
    } catch (err) {
      console.error('❌ Delete product exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // الحصول على الخطط
  getPricingPlans: async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true })
      
      if (error) {
        console.error('❌ Get pricing plans error:', error.message)
        return { data: [], error }
      }
      
      console.log(`✅ Loaded ${data?.length || 0} pricing plans`)
      return { data: data || [], error: null }
    } catch (err) {
      console.error('❌ Get pricing plans exception:', err)
      return { data: [], error: { message: err.message } }
    }
  },

  // الحصول على ملف المستخدم
  getProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('❌ Get profile error:', error.message)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('❌ Get profile exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // تحديث ملف المستخدم
  updateProfile: async (profileData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ Update profile error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Profile updated')
      return { data, error: null }
    } catch (err) {
      console.error('❌ Update profile exception:', err)
      return { data: null, error: { message: err.message } }
    }
  },

  // تتبع استخدام التوليد الذكي
  trackUsage: async (actionType, resourceId = null, metadata = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      const { data, error } = await supabase
        .from('usage_tracking')
        .insert([{
          user_id: user.id,
          action_type: actionType,
          resource_id: resourceId,
          metadata,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Track usage error:', error.message)
        return { data: null, error }
      }
      
      console.log('✅ Usage tracked:', actionType)
      return { data, error: null }
    } catch (err) {
      console.error('❌ Track usage exception:', err)
      return { data: null, error: { message: err.message } }
    }
  }
}

// تصدير افتراضي
export default supabase