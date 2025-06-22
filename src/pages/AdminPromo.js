import React, { useState, useEffect } from 'react';
import { Tags } from 'lucide-react';
import PromoCodesManagement from '../pages/PromoCodesManagement';
import { 
  Users, 
  ShoppingBag, 
  Settings, 
  BarChart3,
  Shield,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  Activity,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Globe,
  Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // بيانات وهمية للمستخدمين
  const users = [
    { 
      id: 1, 
      name: 'أحمد محمد', 
      email: 'ahmed@example.com', 
      role: 'مدير', 
      status: 'نشط', 
      lastLogin: '2024-01-15',
      products: 23,
      sales: 15400
    },
    { 
      id: 2, 
      name: 'فاطمة علي', 
      email: 'fatima@example.com', 
      role: 'محرر', 
      status: 'نشط', 
      lastLogin: '2024-01-14',
      products: 18,
      sales: 12300
    },
    { 
      id: 3, 
      name: 'محمد خالد', 
      email: 'mohammed@example.com', 
      role: 'مستخدم', 
      status: 'معلق', 
      lastLogin: '2024-01-10',
      products: 5,
      sales: 2100
    },
    { 
      id: 4, 
      name: 'سارة أحمد', 
      email: 'sara@example.com', 
      role: 'محرر', 
      status: 'نشط', 
      lastLogin: '2024-01-15',
      products: 31,
      sales: 18900
    }
  ];

  // بيانات وهمية للمنتجات
  const products = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro Max', 
      category: 'إلكترونيات', 
      price: 1299, 
      stock: 45, 
      status: 'منشور',
      views: 2340,
      sales: 23
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      category: 'إلكترونيات', 
      price: 999, 
      stock: 32, 
      status: 'منشور',
      views: 1890,
      sales: 18
    },
    { 
      id: 3, 
      name: 'MacBook Air M3', 
      category: 'حاسوب', 
      price: 1599, 
      stock: 0, 
      status: 'نفد المخزون',
      views: 1560,
      sales: 12
    }
  ];

  const systemStats = {
    totalUsers: 1247,
    activeUsers: 834,
    totalProducts: 3456,
    pendingApprovals: 23,
    totalSales: 284590,
    systemUptime: '99.8%',
    storageUsed: '67%',
    apiCalls: 125000
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {count && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          activeTab === id ? 'bg-blue-500' : 'bg-gray-200 text-gray-700'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const StatusBadge = ({ status, type = 'user' }) => {
    const getStatusConfig = () => {
      if (type === 'user') {
        switch (status) {
          case 'نشط': return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
          case 'معلق': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle };
          case 'محظور': return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
          default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle };
        }
      } else {
        switch (status) {
          case 'منشور': return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
          case 'مسودة': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: Edit };
          case 'نفد المخزون': return { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle };
          default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle };
        }
      }
    };

    const { bg, text, icon: Icon } = getStatusConfig();
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* شريط التنقل العلوي */}
      <nav className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم الإدارية</h1>
              <p className="text-sm text-gray-600">إدارة شاملة للنظام</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <AlertTriangle size={16} />
              <span>تنبيهات النظام</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">5</span>
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              إ
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* الشريط الجانبي */}
        <div className="w-80 bg-white shadow-sm border-l min-h-screen p-6">
          <div className="space-y-2">
            <TabButton id="overview" label="نظرة عامة" icon={BarChart3} />
            <TabButton id="users" label="إدارة المستخدمين" icon={Users} count={systemStats.totalUsers} />
            <TabButton id="products" label="إدارة المنتجات" icon={ShoppingBag} count={systemStats.totalProducts} />
            <TabButton id="permissions" label="الصلاحيات" icon={Shield} />
            <TabButton id="settings" label="إعدادات النظام" icon={Settings} />
            <TabButton id="reports" label="التقارير" icon={Database} />
            <TabButton id="security" label="الأمان" icon={Lock} />
            <TabButton id="promo-codes" label="أكواد الترويج" icon={Tags} />
          </div>

          {/* إحصائيات سريعة */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">إحصائيات سريعة</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المستخدمين النشطين</span>
                <span className="font-semibold text-green-600">{systemStats.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الموافقات المعلقة</span>
                <span className="font-semibold text-yellow-600">{systemStats.pendingApprovals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">وقت تشغيل النظام</span>
                <span className="font-semibold text-blue-600">{systemStats.systemUptime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 p-6">
          {/* نظرة عامة */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">نظرة عامة على النظام</h2>
                <p className="text-gray-600">مراقبة شاملة لأداء النظام والإحصائيات</p>
              </div>

              {/* البطاقات الإحصائية */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Users className="text-blue-600" size={24} />
                    </div>
                    <Zap className="text-green-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{systemStats.totalUsers.toLocaleString()}</h3>
                  <p className="text-gray-600 text-sm">إجمالي المستخدمين</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <ShoppingBag className="text-green-600" size={24} />
                    </div>
                    <Activity className="text-blue-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{systemStats.totalProducts.toLocaleString()}</h3>
                  <p className="text-gray-600 text-sm">إجمالي المنتجات</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <DollarSign className="text-yellow-600" size={24} />
                    </div>
                    <Globe className="text-purple-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">${systemStats.totalSales.toLocaleString()}</h3>
                  <p className="text-gray-600 text-sm">إجمالي المبيعات</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <Database className="text-gray-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{systemStats.pendingApprovals}</h3>
                  <p className="text-gray-600 text-sm">الموافقات المعلقة</p>
                </div>
              </div>

              {/* أداء النظام */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">أداء النظام</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h4 className="font-semibold text-gray-800">وقت التشغيل</h4>
                    <p className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Database className="text-blue-600" size={32} />
                    </div>
                    <h4 className="font-semibold text-gray-800">التخزين المستخدم</h4>
                    <p className="text-2xl font-bold text-blue-600">{systemStats.storageUsed}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="text-purple-600" size={32} />
                    </div>
                    <h4 className="font-semibold text-gray-800">استدعاءات API</h4>
                    <p className="text-2xl font-bold text-purple-600">{systemStats.apiCalls.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* إدارة المستخدمين */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h2>
                  <p className="text-gray-600">إدارة حسابات المستخدمين والصلاحيات</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Plus size={16} />
                    إضافة مستخدم
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Upload size={16} />
                    استيراد
                  </button>
                </div>
              </div>

              {/* شريط البحث والفلاتر */}
              <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="البحث عن المستخدمين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    فلتر
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download size={16} />
                    تصدير
                  </button>
                </div>
              </div>

              {/* جدول المستخدمين */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المستخدم</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الدور</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الحالة</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">آخر دخول</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المنتجات</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المبيعات</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              className="rounded"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={user.status} type="user" />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                          <td className="px-6 py-4 text-sm font-medium">{user.products}</td>
                          <td className="px-6 py-4 text-sm font-medium">${user.sales.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit size={16} />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                {user.status === 'نشط' ? <Lock size={16} /> : <Unlock size={16} />}
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* إدارة المنتجات */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة المنتجات</h2>
                  <p className="text-gray-600">إدارة وتنظيم منتجات الموقع</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Plus size={16} />
                    إضافة منتج
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <BarChart3 size={16} />
                    تحليل SEO
                  </button>
                </div>
              </div>

              {/* جدول المنتجات */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المنتج</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">التصنيف</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">السعر</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المخزون</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الحالة</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المشاهدات</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المبيعات</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                {product.name.charAt(0)}
                              </div>
                              <div className="font-medium text-gray-800">{product.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-medium">${product.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stock > 20 ? 'bg-green-100 text-green-800' :
                              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={product.status} type="product" />
                          </td>
                          <td className="px-6 py-4 text-sm">{product.views.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-medium">{product.sales}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                <Edit size={16} />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* الصلاحيات */}
          {activeTab === 'permissions' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة الصلاحيات</h2>
                <p className="text-gray-600">تحكم في صلاحيات المستخدمين والأدوار</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">الأدوار والصلاحيات</h3>
                  <div className="space-y-4">
                    {['مدير عام', 'مدير', 'محرر', 'مستخدم'].map((role, index) => (
                      <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-800">{role}</h4>
                          <p className="text-sm text-gray-600">
                            {index === 0 && 'صلاحية كاملة للنظام'}
                            {index === 1 && 'إدارة المستخدمين والمنتجات'}
                            {index === 2 && 'تحرير المحتوى والمنتجات'}
                            {index === 3 && 'عرض المحتوى فقط'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={16} />
                          </button>
                          {index > 0 && (
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">الصلاحيات المتقدمة</h3>
                  <div className="space-y-3">
                    {[
                      'إدارة المستخدمين',
                      'إدارة المنتجات', 
                      'إدارة المحتوى',
                      'الوصول للتقارير',
                      'إعدادات النظام',
                      'النسخ الاحتياطي',
                      'إدارة قاعدة البيانات',
                      'مراقبة النظام'
                    ].map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-800">{permission}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">تفعيل/إلغاء</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* إعدادات النظام */}
          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">إعدادات النظام</h2>
                <p className="text-gray-600">تكوين وإعداد النظام العام</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">الإعدادات العامة</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم الموقع</label>
                      <input 
                        type="text" 
                        defaultValue="متجر إلكتروني"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">وصف الموقع</label>
                      <textarea 
                        rows="3"
                        defaultValue="أفضل متجر إلكتروني للمنتجات عالية الجودة"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني للإدارة</label>
                      <input 
                        type="email" 
                        defaultValue="admin@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">إعدادات الأمان</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">المصادقة الثنائية</h4>
                        <p className="text-sm text-gray-600">تفعيل الحماية الإضافية</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">تسجيل العمليات</h4>
                        <p className="text-sm text-gray-600">حفظ سجل جميع الأنشطة</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">التحديث التلقائي</h4>
                        <p className="text-sm text-gray-600">تحديث النظام تلقائياً</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">إعدادات البريد الإلكتروني</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">خادم SMTP</label>
                      <input 
                        type="text" 
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المنفذ</label>
                      <input 
                        type="number" 
                        placeholder="587"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
                      <input 
                        type="email" 
                        placeholder="your-email@gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">النسخ الاحتياطي</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-green-800">آخر نسخة احتياطية</h4>
                        <p className="text-sm text-green-600">15 يناير 2024 - 14:30</p>
                      </div>
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Download size={16} />
                        إنشاء نسخة احتياطية
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Upload size={16} />
                        استعادة نسخة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* التقارير */}
          {activeTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">التقارير والإحصائيات</h2>
                <p className="text-gray-600">تقارير مفصلة حول أداء النظام</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'تقرير المستخدمين', icon: Users, color: 'blue', description: 'إحصائيات شاملة عن المستخدمين' },
                  { title: 'تقرير المبيعات', icon: DollarSign, color: 'green', description: 'أداء المبيعات والإيرادات' },
                  { title: 'تقرير المنتجات', icon: ShoppingBag, color: 'purple', description: 'إحصائيات المنتجات والمخزون' },
                  { title: 'تقرير SEO', icon: BarChart3, color: 'yellow', description: 'أداء محركات البحث' },
                  { title: 'تقرير الأمان', icon: Shield, color: 'red', description: 'سجل الأمان والتهديدات' },
                  { title: 'تقرير النظام', icon: Activity, color: 'indigo', description: 'أداء الخادم والموارد' }
                ].map((report, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                      <report.icon className={`text-${report.color}-600`} size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                    <button className={`w-full px-4 py-2 bg-${report.color}-600 text-white rounded-lg hover:bg-${report.color}-700 transition-colors`}>
                      عرض التقرير
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* الأمان */}
          {activeTab === 'security' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">الأمان ومراقبة النظام</h2>
                <p className="text-gray-600">مراقبة الأنشطة المشبوهة وإدارة الأمان</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">محاولات الدخول الأخيرة</h3>
                  <div className="space-y-3">
                    {[
                      { user: 'أحمد محمد', ip: '192.168.1.100', time: '14:30', status: 'نجح', country: 'السعودية' },
                      { user: 'فاطمة علي', ip: '192.168.1.101', time: '14:25', status: 'نجح', country: 'السعودية' },
                      { user: 'مجهول', ip: '185.234.72.45', time: '14:20', status: 'فشل', country: 'روسيا' },
                      { user: 'محمد خالد', ip: '192.168.1.102', time: '14:15', status: 'نجح', country: 'السعودية' }
                    ].map((attempt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{attempt.user}</div>
                          <div className="text-sm text-gray-600">{attempt.ip} - {attempt.country}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-600">{attempt.time}</div>
                          <div className={`text-sm font-medium ${
                            attempt.status === 'نجح' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {attempt.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">تنبيهات الأمان</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                      <div>
                        <div className="font-medium text-red-800">محاولة دخول مشبوهة</div>
                        <div className="text-sm text-red-600">عدة محاولات فاشلة من IP واحد</div>
                        <div className="text-xs text-red-500 mt-1">منذ 5 دقائق</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                      <div>
                        <div className="font-medium text-yellow-800">استخدام مكثف للموارد</div>
                        <div className="text-sm text-yellow-600">استهلاك عالي للذاكرة والمعالج</div>
                        <div className="text-xs text-yellow-500 mt-1">منذ 15 دقيقة</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <div className="font-medium text-blue-800">تحديث أمني</div>
                        <div className="text-sm text-blue-600">تم تثبيت التحديث الأمني بنجاح</div>
                        <div className="text-xs text-blue-500 mt-1">منذ ساعة</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">إعدادات الأمان المتقدمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">حماية قوة كلمة المرور</h4>
                    <div className="space-y-2">
                      {[
                        'الحد الأدنى 8 أحرف',
                        'يجب أن تحتوي على أرقام',
                        'يجب أن تحتوي على رموز خاصة',
                        'يجب أن تحتوي على أحرف كبيرة وصغيرة'
                      ].map((rule, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="text-green-600" size={16} />
                          <span className="text-sm text-gray-700">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">إعدادات الجلسة</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">مدة انتهاء الجلسة (دقيقة)</label>
                        <input 
                          type="number" 
                          defaultValue="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">تسجيل خروج تلقائي</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        
          {activeTab === 'promo-codes' && (
            <PromoCodesManagement />
          )}
</div>
      </div>
    </div>
  );
};

export default AdminDashboard;