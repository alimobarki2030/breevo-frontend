import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterLanding() {
  const navigate = useNavigate();
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [store_url, setStoreUrl] = useState('');
  const [heard_from, setHeardFrom] = useState('');
  const [plan, setPlan] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://breevo-backend.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name,
          email,
          password,
          phone,
          store_url,
          heard_from,
          plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'حدث خطأ أثناء التسجيل');
      }

      localStorage.setItem('access_token', data.access_token);
      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          إنشاء حساب جديد
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                id="full_name"
                type="text"
                required
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الجوال
              </label>
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="store_url" className="block text-sm font-medium text-gray-700">
                رابط المتجر
              </label>
              <input
                id="store_url"
                type="text"
                required
                value={store_url}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="heard_from" className="block text-sm font-medium text-gray-700">
                من وين سمعت عنّا؟
              </label>
              <input
                id="heard_from"
                type="text"
                required
                value={heard_from}
                onChange={(e) => setHeardFrom(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                نوع الباقة
              </label>
              <select
                id="plan"
                required
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">اختر الباقة</option>
                <option value="free">مجانية</option>
                <option value="pro">احترافية</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                إنشاء الحساب
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">✅ تم التسجيل بنجاح، يتم التوجيه الآن...</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
