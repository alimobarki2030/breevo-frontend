import React, { useState, useEffect } from 'react'
import { database, auth } from '../config/supabase'

// مكون اختبار سريع لـ Supabase
export default function SupabaseTest() {
  const [status, setStatus] = useState('جاري التحميل...')
  const [results, setResults] = useState([])
  const [user, setUser] = useState(null)

  const addResult = (test, success, message, data = null) => {
    const result = { 
      test, 
      success, 
      message, 
      data,
      time: new Date().toLocaleTimeString() 
    }
    setResults(prev => [...prev, result])
    console.log(success ? '✅' : '❌', test, ':', message)
  }

  const runTests = async () => {
    setResults([])
    setStatus('🧪 جاري تشغيل الاختبارات...')

    try {
      // اختبار 1: متغيرات البيئة
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        addResult('متغيرات البيئة', true, '✅ جميع المتغيرات موجودة')
      } else {
        addResult('متغيرات البيئة', false, '❌ متغيرات مفقودة')
        setStatus('❌ فشل في الاختبارات')
        return
      }

      // اختبار 2: الاتصال بقاعدة البيانات
      addResult('اختبار الاتصال', false, '⏳ جاري الاتصال...')
      
      const { data: plans, error: plansError } = await database.getPricingPlans()
      
      if (plansError) {
        addResult('اختبار الاتصال', false, `❌ ${plansError.message}`)
      } else {
        addResult('اختبار الاتصال', true, `✅ متصل - ${plans?.length || 0} خطط`, plans)
      }

      // اختبار 3: التحقق من البيانات
      if (plans && plans.length > 0) {
        const freeplan = plans.find(p => p.name === 'free')
        if (freeplan) {
          addResult('التحقق من البيانات', true, '✅ الخطة المجانية موجودة', freeplan)
        } else {
          addResult('التحقق من البيانات', false, '❌ الخطة المجانية غير موجودة')
        }
      }

      // اختبار 4: المصادقة (بدون تسجيل دخول)
      const { user: currentUser, error: userError } = await auth.getCurrentUser()
      
      if (userError && !userError.message.includes('session_not_found')) {
        addResult('نظام المصادقة', false, `❌ ${userError.message}`)
      } else {
        if (currentUser) {
          addResult('نظام المصادقة', true, `✅ مستخدم مسجل: ${currentUser.email}`, currentUser)
          setUser(currentUser)
        } else {
          addResult('نظام المصادقة', true, '✅ نظام المصادقة يعمل (لا يوجد مستخدم)')
        }
      }

      // اختبار 5: إذا كان المستخدم مسجل، اختبر المنتجات
      if (currentUser) {
        const { data: products, error: productsError } = await database.getProducts()
        
        if (productsError) {
          addResult('المنتجات', false, `❌ ${productsError.message}`)
        } else {
          addResult('المنتجات', true, `✅ ${products?.length || 0} منتج محفوظ`, products)
        }
      }

      setStatus('✅ اكتملت جميع الاختبارات!')

    } catch (error) {
      addResult('خطأ عام', false, `❌ ${error.message}`)
      setStatus('❌ فشل في الاختبارات')
    }
  }

  // تشغيل الاختبارات عند التحميل
  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg m-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🧪 اختبار Supabase</h1>
        <p className="text-gray-600">{status}</p>
      </div>

      {/* أزرار التحكم */}
      <div className="text-center mb-6">
        <button
          onClick={runTests}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium mr-3"
        >
          🔄 إعادة الاختبار
        </button>
        
        {user && (
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            👤 مرحباً {user.email}
          </span>
        )}
      </div>

      {/* نتائج الاختبارات */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-4">📊 نتائج الاختبارات:</h2>
          
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                result.success 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <strong>{result.test}:</strong>
                  <p className="mt-1 text-sm">{result.message}</p>
                  
                  {/* إظهار البيانات إذا كانت موجودة */}
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs opacity-75 hover:opacity-100">
                        عرض البيانات...
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                <span className="text-xs opacity-75 ml-4">{result.time}</span>
              </div>
            </div>
          ))}

          {/* خلاصة النتائج */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
            <h3 className="font-semibold text-blue-900 mb-2">📈 الخلاصة:</h3>
            <div className="grid grid-cols-3 gap-4 text-sm text-blue-800">
              <div>✅ نجح: {results.filter(r => r.success).length}</div>
              <div>❌ فشل: {results.filter(r => !r.success).length}</div>
              <div>📊 المجموع: {results.length}</div>
            </div>
            
            {results.filter(r => r.success).length === results.length && results.length > 0 && (
              <div className="mt-3 p-3 bg-green-100 rounded border border-green-300">
                <p className="font-semibold text-green-800">
                  🎉 ممتاز! جميع الاختبارات نجحت - Supabase جاهز للاستخدام!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h4 className="font-semibold mb-2">ℹ️ معلومات الاختبار:</h4>
        <ul className="space-y-1 text-xs">
          <li>• يتحقق من اتصال قاعدة البيانات</li>
          <li>• يختبر وجود البيانات الأساسية</li>
          <li>• يتحقق من نظام المصادقة</li>
          <li>• آمن للاستخدام - لا يُعدل أي بيانات</li>
        </ul>
      </div>
    </div>
  )
}