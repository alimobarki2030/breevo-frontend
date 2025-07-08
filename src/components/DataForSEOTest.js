// DataForSEO API Test Component
// Create this file as: src/components/DataForSEOTest.js

import React, { useState } from 'react';

const DataForSEOTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPIConnection = async () => {
    setLoading(true);
    setError('');
    setTestResult(null);

    try {
      const API_LOGIN = process.env.REACT_APP_DATAFORSEO_LOGIN;
      const API_PASSWORD = process.env.REACT_APP_DATAFORSEO_PASSWORD;

      console.log('Testing API connection...');
      console.log('Login:', API_LOGIN ? 'Set ✓' : 'Missing ✗');
      console.log('Password:', API_PASSWORD ? 'Set ✓' : 'Missing ✗');

      if (!API_LOGIN || !API_PASSWORD) {
        throw new Error('Missing API credentials in environment variables');
      }

      // Test with a simple keyword search
      const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${API_LOGIN}:${API_PASSWORD}`)
        },
        body: JSON.stringify([{
          keywords: ["تسويق إلكتروني"],
          location_name: "Saudi Arabia",
          language_name: "Arabic"
        }])
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      setTestResult({
        status: 'success',
        data: data,
        creditsUsed: data.cost || 'Unknown',
        keyword: data.tasks?.[0]?.result?.[0] || null
      });

    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message);
      setTestResult({
        status: 'error',
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4 text-white">اختبار اتصال DataForSEO API</h2>
      
      <button
        onClick={testAPIConnection}
        disabled={loading}
        className="bg-[#4BB8A9] text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-[#6cc9b9] transition disabled:opacity-50"
      >
        {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
      </button>

      {/* Environment Check */}
      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2 text-white">فحص متغيرات البيئة:</h3>
        <p className="text-sm">
          LOGIN: {process.env.REACT_APP_DATAFORSEO_LOGIN ? '✅ مُعرّف' : '❌ مفقود'}
        </p>
        <p className="text-sm">
          PASSWORD: {process.env.REACT_APP_DATAFORSEO_PASSWORD ? '✅ مُعرّف' : '❌ مفقود'}
        </p>
      </div>

      {/* Results */}
      {testResult && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-white">نتائج الاختبار:</h3>
          
          {testResult.status === 'success' ? (
            <div className="text-green-400">
              <p>✅ الاتصال ناجح!</p>
              <p>الكلمة المختبرة: {testResult.keyword?.keyword || 'غير متوفرة'}</p>
              <p>حجم البحث: {testResult.keyword?.search_volume?.toLocaleString('ar-SA') || 'غير متوفر'}</p>
              <p>التكلفة: {testResult.creditsUsed} نقطة</p>
            </div>
          ) : (
            <div className="text-red-400">
              <p>❌ فشل الاتصال</p>
              <p>الخطأ: {testResult.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
          <p className="text-red-400">خطأ: {error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <h4 className="font-semibold text-blue-400 mb-2">تعليمات:</h4>
        <ol className="text-sm text-blue-300 space-y-1">
          <li>1. تأكد من إضافة معلومات API في ملف .env</li>
          <li>2. أعد تشغيل خادم التطوير بعد إضافة المتغيرات</li>
          <li>3. تأكد من وجود رصيد كافٍ في حساب DataForSEO</li>
          <li>4. اضغط "اختبار الاتصال" للتحقق من عمل API</li>
        </ol>
      </div>
    </div>
  );
};

export default DataForSEOTest;