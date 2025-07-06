import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Gift,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  BarChart3,
  RefreshCw,
  X
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Simple Toast Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function PointsDashboard() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // تحميل جميع البيانات بشكل متوازي
      const [balanceRes, transactionsRes, packagesRes, servicesRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/points/balance`, { headers }),
        fetch(`${API_BASE_URL}/api/points/transactions?per_page=10`, { headers }),
        fetch(`${API_BASE_URL}/api/points/packages`, { headers }),
        fetch(`${API_BASE_URL}/api/points/services`, { headers }),
        fetch(`${API_BASE_URL}/api/points/analytics?period=month`, { headers })
      ]);

      if (balanceRes.ok) setBalance(await balanceRes.json());
      if (transactionsRes.ok) {
        const data = await transactionsRes.json();
        setTransactions(data.transactions || []);
      }
      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(data.packages || []);
      }
      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data.services || []);
      }
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());

    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchasePackage = async (packageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/points/packages/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package_id: packageId,
          payment_method: 'credit_card' // سيتم التعامل معه في صفحة الدفع
        })
      });

      if (response.ok) {
        showToast('تم شراء الباقة بنجاح!', 'success');
        loadDashboardData();
      } else {
        const error = await response.json();
        showToast(error.detail || 'فشل في شراء الباقة', 'error');
      }
    } catch (error) {
      showToast('خطأ في معالجة الشراء', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="w-4 h-4" />;
      case 'deduct': return <ArrowDownRight className="w-4 h-4" />;
      case 'refund': return <RefreshCw className="w-4 h-4" />;
      case 'bonus': return <Gift className="w-4 h-4" />;
      case 'transfer': return <ArrowUpRight className="w-4 h-4" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'purchase': 
      case 'bonus':
      case 'refund': return 'text-green-600';
      case 'deduct': return 'text-red-600';
      case 'transfer': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام النقاط</h1>
        <p className="text-gray-600">إدارة واستخدام نقاطك بكفاءة</p>
      </div>

      {/* Balance Card */}
      {balance && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">رصيدك الحالي</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold">{balance.balance.toLocaleString()}</h2>
                <span className="text-xl">نقطة</span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>الحد اليومي: {balance.daily_remaining}/{balance.daily_limit}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Coins className="w-16 h-16 text-white/20" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-blue-100 text-sm">مشتريات</p>
              <p className="text-xl font-semibold">{balance.total_purchased.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">مستخدم</p>
              <p className="text-xl font-semibold">{balance.total_spent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">مسترجع</p>
              <p className="text-xl font-semibold">{balance.total_refunded.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          نظرة عامة
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'packages' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          شراء نقاط
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'services' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          الخدمات
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'history' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          السجل
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Usage Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              استخدام النقاط هذا الشهر
            </h3>
            <div className="space-y-4">
              {Object.entries(analytics.usage_by_service).map(([service, data]) => (
                <div key={service}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{service}</span>
                    <span className="text-sm text-gray-600">{data.total_points} نقطة</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.total_points / analytics.total_spent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              الخدمات الأكثر استخداماً
            </h3>
            <div className="space-y-3">
              {analytics.top_services.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{service.service}</span>
                  <span className="text-sm font-semibold">{service.count} مرة</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-xl shadow-sm border p-6 relative transition-transform hover:scale-105 ${
                pkg.is_popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {pkg.is_popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  الأكثر شعبية
                </span>
              )}
              
              <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600">{pkg.points.toLocaleString()}</div>
                <div className="text-gray-600">نقطة</div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">{pkg.price}</div>
                <div className="text-sm text-gray-600">ريال</div>
                {pkg.original_price && (
                  <div className="text-sm text-gray-400 line-through">{pkg.original_price} ريال</div>
                )}
              </div>
              
              {pkg.discount_percentage > 0 && (
                <div className="bg-green-100 text-green-800 text-sm text-center py-1 rounded mb-4">
                  وفر {pkg.discount_percentage}%
                </div>
              )}
              
              <button
                onClick={() => handlePurchasePackage(pkg.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  pkg.is_popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                شراء الآن
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="text-2xl">{service.icon}</div>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {service.points_cost} نقطة
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{service.category}</span>
                <span>{service.estimated_time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">سجل المعاملات</h3>
          </div>
          
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} نقطة
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {transactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد معاملات بعد</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}