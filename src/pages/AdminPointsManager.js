import React, { useState, useEffect } from 'react';
import { Plus, Gift, Users, Search, AlertCircle } from 'lucide-react';

const AdminPointsManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAmount, setPointsAmount] = useState('');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // البحث عن المستخدمين
  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/search?term=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // إضافة نقاط للمستخدم
  const addPoints = async () => {
    if (!selectedUser || !pointsAmount || !reason) {
      setMessage({ type: 'error', text: 'يرجى ملء جميع الحقول' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/points/bonus', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          amount: parseInt(pointsAmount),
          reason: reason
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ تم إضافة النقاط بنجاح!' });
        setPointsAmount('');
        setReason('');
        setSelectedUser(null);
      } else {
        setMessage({ type: 'error', text: '❌ حدث خطأ في إضافة النقاط' });
      }
    } catch (error) {
      console.error('Error adding points:', error);
      setMessage({ type: 'error', text: '❌ حدث خطأ في الاتصال' });
    } finally {
      setLoading(false);
    }
  };

  // قوالب جاهزة للأسباب
  const reasonTemplates = [
    { value: 'اختبار المنصة', points: 100 },
    { value: 'مكافأة ترحيبية', points: 50 },
    { value: 'تعويض عن مشكلة تقنية', points: 200 },
    { value: 'مختبر بيتا', points: 500 },
    { value: 'عرض خاص', points: 1000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Gift className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">إدارة النقاط المجانية</h1>
          </div>

          {/* رسالة التنبيه */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5" />
              <span>{message.text}</span>
            </div>
          )}

          {/* البحث عن المستخدمين */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">البحث عن مستخدم</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالبريد الإلكتروني أو الاسم..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={searchUsers}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                بحث
              </button>
            </div>
          </div>

          {/* قائمة المستخدمين */}
          {users.length > 0 && (
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">اختر المستخدم</label>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id 
                        ? 'bg-purple-100 border-2 border-purple-500' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-sm text-gray-500">الرصيد الحالي: {user.points_balance} نقطة</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* المستخدم المحدد */}
          {selectedUser && (
            <div className="mb-8 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium">المستخدم المحدد:</span>
              </div>
              <div className="text-gray-700">{selectedUser.name} - {selectedUser.email}</div>
            </div>
          )}

          {/* إضافة النقاط */}
          <div className="space-y-6">
            {/* قوالب جاهزة */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">قوالب سريعة</label>
              <div className="grid grid-cols-2 gap-2">
                {reasonTemplates.map(template => (
                  <button
                    key={template.value}
                    onClick={() => {
                      setReason(template.value);
                      setPointsAmount(template.points.toString());
                    }}
                    className="p-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{template.value}</div>
                    <div className="text-gray-600">{template.points} نقطة</div>
                  </button>
                ))}
              </div>
            </div>

            {/* عدد النقاط */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">عدد النقاط</label>
              <input
                type="number"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                placeholder="أدخل عدد النقاط..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* السبب */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">سبب الإضافة</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="مثال: مكافأة ترحيبية للمختبرين..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* زر الإضافة */}
            <button
              onClick={addPoints}
              disabled={loading || !selectedUser}
              className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
            >
              <Plus className="w-6 h-6" />
              إضافة النقاط
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-purple-600">150</div>
            <div className="text-gray-600">إجمالي المختبرين</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-green-600">25,000</div>
            <div className="text-gray-600">نقاط تم توزيعها</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-blue-600">85%</div>
            <div className="text-gray-600">معدل الاستخدام</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPointsManager;