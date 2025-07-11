// src/utils/migrationHelper.js
// مساعد لنقل المستخدمين من Supabase إلى Backend

export const migrationHelper = {
  // فحص وجود توكن Supabase قديم
  checkSupabaseToken() {
    const supabaseToken = localStorage.getItem('sb-afkxzvmbrymdpvyfzyzn-auth-token');
    if (supabaseToken) {
      try {
        const parsed = JSON.parse(supabaseToken);
        return parsed.access_token || null;
      } catch {
        return null;
      }
    }
    return null;
  },

  // تنظيف بيانات Supabase القديمة
  cleanupSupabaseData() {
    const supabaseKeys = [
      'sb-afkxzvmbrymdpvyfzyzn-auth-token',
      'supabase.auth.token',
      // أضف أي مفاتيح أخرى خاصة بـ Supabase
    ];
    
    supabaseKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ تم تنظيف بيانات Supabase القديمة');
  },

  // محاولة نقل المستخدم من Supabase إلى Backend
  async attemptMigration(supabaseUser) {
    try {
      // إذا كان لدينا بيانات مستخدم Supabase
      if (supabaseUser && supabaseUser.email) {
        console.log('🔄 محاولة نقل المستخدم:', supabaseUser.email);
        
        // يمكنك هنا إضافة منطق لإرسال بيانات المستخدم إلى Backend
        // مثلاً: إنشاء حساب جديد أو ربط الحساب الموجود
        
        return {
          success: true,
          message: 'يرجى إعادة تسجيل الدخول بكلمة المرور الخاصة بك'
        };
      }
      
      return {
        success: false,
        message: 'لا توجد بيانات للنقل'
      };
    } catch (error) {
      console.error('❌ خطأ في نقل البيانات:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // التحقق الكامل والتنظيف
  async performMigrationCheck() {
    console.log('🔍 فحص الحاجة لنقل البيانات...');
    
    // 1. التحقق من وجود توكن Backend
    const backendToken = localStorage.getItem('token') || 
                        localStorage.getItem('access_token') || 
                        localStorage.getItem('backend_token');
    
    if (backendToken) {
      console.log('✅ المستخدم لديه توكن Backend صالح');
      this.cleanupSupabaseData();
      return { needsMigration: false };
    }
    
    // 2. التحقق من وجود بيانات Supabase
    const supabaseToken = this.checkSupabaseToken();
    if (supabaseToken) {
      console.log('⚠️ وجدت بيانات Supabase قديمة');
      
      // يمكنك هنا محاولة استخراج بيانات المستخدم
      // والقيام بعملية النقل
      
      // بعد النقل أو الفشل، نظف البيانات القديمة
      this.cleanupSupabaseData();
      
      return { 
        needsMigration: true,
        message: 'يرجى إعادة تسجيل الدخول للمتابعة'
      };
    }
    
    console.log('✅ لا توجد بيانات قديمة للنقل');
    return { needsMigration: false };
  }
};

// تشغيل الفحص عند تحميل الملف
if (typeof window !== 'undefined') {
  migrationHelper.performMigrationCheck().then(result => {
    if (result.needsMigration) {
      console.log('📢', result.message);
    }
  });
}