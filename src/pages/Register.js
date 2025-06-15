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
      navigate('/products');
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
            <input type="text" placeholder="الاسم الكامل" value={full_name} onChange={(e) => setFullName(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required />
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required />
            <input type="text" placeholder="رقم الجوال" value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required />
            <input type="text" placeholder="رابط المتجر" value={store_url} onChange={(e) => setStoreUrl(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required />
            <input type="text" placeholder="من وين سمعت عنّا؟" value={heard_from} onChange={(e) => setHeardFrom(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required />
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200" required>
              <option value="">اختر الباقة</option>
              <option value="free">مجانية</option>
              <option value="pro">احترافية</option>
            </select>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              إنشاء الحساب
            </button>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}