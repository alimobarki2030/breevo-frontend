import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  User, 
  Mail, 
  Phone, 
  Crown, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Store,
  RefreshCw,
  ExternalLink,
  Globe,
  Zap
} from "lucide-react";

// معلومات الخطط
const PLAN_DETAILS = {
  free: {
    name: "المجانية",
    price: 0,
    icon: "🆓",
    color: "from-gray-500 to-gray-600",
    features: ["3 منتجات شهرياً", "معاينة Google", "مؤشرات سيو أساسية"]
  },
  pro: {
    name: "الاحترافية", 
    price: 49,
    icon: "💎",
    color: "from-blue-500 to-purple-600",
    features: ["30 منتج شهرياً", "مؤشرات سيو متقدمة", "توليد تلقائي بالذكاء الاصطناعي", "دعم فني مخصص"]
  },
  enterprise: {
    name: "الأعمال",
    price: 129, 
    icon: "👑",
    color: "from-yellow-500 to-orange-600",
    features: ["منتجات غير محدودة", "تحليل شامل متقدم", "دعم خاص ومتابعة مخصصة", "تقارير مفصلة"]
  }
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Account() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({ productsUsed: 0, productsLimit: 3 });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // ✨ حالات ربط سلة المبسطة - للعرض فقط
  const [sallaStores, setSallaStores] = useState([]);
  const [sallaLoading, setSallaLoading] = useState(true);
  const [syncing, setSyncing] = useState({});

  useEffect(() => {
    loadUserData();
    loadSubscriptionData();
    loadUsageData();
    loadInvoicesData();
    // ✨ تحميل المتاجر المربوطة تلقائياً
    loadSallaStores();
  }, []);

  const loadUserData = () => {
    const storedName = localStorage.getItem("clientName") || "اسم المستخدم";
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    setUserData({
      name: storedName,
      email: storedUser.email || "email@example.com",
      phone: storedUser.phone || "+966xxxxxxxxx"
    });
  };

  const loadSubscriptionData = () => {
    const storedSubscription = JSON.parse(localStorage.getItem("subscription") || "null");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (storedSubscription) {
      setSubscription(storedSubscription);
    } else {
      setSubscription({
        plan: storedUser.plan || "free",
        status: "active",
        startDate: new Date().toISOString(),
        endDate: null,
        billingCycle: "monthly"
      });
    }
  };

  const loadUsageData = () => {
    const storedUsage = JSON.parse(localStorage.getItem("usage") || "{}");
    setUsage({
      productsUsed: storedUsage.productsUsed || Math.floor(Math.random() * 25),
      productsLimit: storedUsage.productsLimit || (subscription?.plan === "enterprise" ? -1 : subscription?.plan === "pro" ? 30 : 3)
    });
  };

  const loadInvoicesData = () => {
    const mockInvoices = [
      {
        id: "INV-2025-001",
        date: "2025-01-20",
        amount: 49,
        status: "paid",
        plan: "pro",
        period: "يناير 2025"
      },
      {
        id: "INV-2024-012",
        date: "2024-12-20", 
        amount: 49,
        status: "paid",
        plan: "pro",
        period: "ديسمبر 2024"
      },
      {
        id: "INV-2024-011",
        date: "2024-11-20",
        amount: 49,
        status: "paid", 
        plan: "pro",
        period: "نوفمبر 2024"
      }
    ];
    
    setInvoices(mockInvoices);
  };

  // ✨ تحميل المتاجر المربوطة (تلقائياً من قاعدة البيانات)
  const loadSallaStores = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSallaLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/salla/stores`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const stores = await response.json();
        setSallaStores(stores);
      } else {
        console.log('No Salla stores found or not connected');
        setSallaStores([]);
      }
    } catch (error) {
      console.error('Failed to load Salla stores:', error);
      setSallaStores([]);
    } finally {
      setSallaLoading(false);
    }
  };

  // ✨ تزامن المنتجات يدوياً
  const syncStoreProducts = async (storeId, storeName) => {
    setSyncing(prev => ({ ...prev, [storeId]: true }));
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/api/salla/stores/${storeId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`تم تزامن ${result.products_count} منتج من ${storeName}! 🎉`);
        
        // تحديث بيانات المتجر
        setSallaStores(prev => prev.map(store => 
          store.id === storeId 
            ? { 
                ...store, 
                last_synced: new Date().toISOString(), 
                products_count: result.products_count 
              }
            : store
        ));
      } else {
        const error = await response.json();
        toast.error(error.message || 'فشل في التزامن');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('فشل في تزامن المنتجات');
    } finally {
      setSyncing(prev => ({ ...prev, [storeId]: false }));
    }
  };

  // ✨ قطع ربط متجر
  const disconnectStore = async (storeId, storeName) => {
    if (!window.confirm(`هل تريد قطع ربط متجر "${storeName}"؟`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE_URL}/api/salla/stores/${storeId}/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSallaStores(prev => prev.filter(store => store.id !== storeId));
        toast.success(`تم قطع ربط متجر ${storeName}`);
      } else {
        toast.error('فشل في قطع الربط');
      }
    } catch (error) {
      toast.error('فشل في قطع الربط');
    }
  };

  const handleUpgrade = () => {
    navigate("/?upgrade=true");
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedSubscription = {
        ...subscription,
        status: "cancelled",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setSubscription(updatedSubscription);
      localStorage.setItem("subscription", JSON.stringify(updatedSubscription));
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.plan = "free";
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success("تم إلغاء الاشتراك بنجاح. ستتمكن من استخدام الخدمة حتى نهاية الفترة المدفوعة.");
      setShowCancelDialog(false);
      
    } catch (error) {
      toast.error("حدث خطأ أثناء إلغاء الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = () => {
    if (!subscription?.endDate) return null;
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUsagePercentage = () => {
    if (usage.productsLimit === -1) return 0;
    return Math.min((usage.productsUsed / usage.productsLimit) * 100, 100);
  };

  const currentPlan = PLAN_DETAILS[subscription?.plan] || PLAN_DETAILS.free;
  const daysUntilExpiry = getDaysUntilExpiry();
  const usagePercentage = getUsagePercentage();

  // ✨ واجهة ربط سلة التلقائية المبسطة
  const renderSallaIntegration = () => (
    <div className="bg-gray-900 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">S</span>
        </div>
        متاجر سلة المربوطة
      </h2>
      
      {sallaLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل المتاجر...</p>
        </div>
      ) : sallaStores.length > 0 ? (
        // عرض المتاجر المربوطة
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>لديك {sallaStores.length} متجر مربوط تلقائياً من سلة</span>
            </div>
          </div>

          {sallaStores.map(store => (
            <div key={store.id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{store.name || 'متجر سلة'}</h3>
                    <p className="text-sm text-gray-400">{store.domain || `Store ID: ${store.merchant_id}`}</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      مثبت تلقائياً - آخر تزامن: {store.last_synced ? new Date(store.last_synced).toLocaleDateString('ar-SA') : 'لم يتم التزامن بعد'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => syncStoreProducts(store.id, store.name)}
                    disabled={syncing[store.id]}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing[store.id] ? 'animate-spin' : ''}`} />
                    {syncing[store.id] ? 'جاري التزامن...' : 'تزامن المنتجات'}
                  </button>
                  
                  {store.domain && (
                    <a
                      href={store.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition flex items-center gap-1"
                      title="فتح المتجر"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  <button
                    onClick={() => disconnectStore(store.id, store.name)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                    title="قطع الربط"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-green-400 font-bold">{store.products_count || 0}</p>
                  <p className="text-gray-400">منتج متزامن</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-bold">{store.webhook_status || 'نشط'}</p>
                  <p className="text-gray-400">Webhook</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 font-bold">{store.status || 'نشط'}</p>
                  <p className="text-gray-400">الحالة</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // لا توجد متاجر مربوطة
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">لا توجد متاجر مربوطة</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            لربط متجرك، قم بتثبيت التطبيق من متجر تطبيقات سلة وسيتم الربط تلقائياً
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 text-right">
            <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              خطوات الربط التلقائي:
            </h4>
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>ادخل لوحة تحكم متجرك في سلة</li>
              <li>اذهب لمتجر التطبيقات (App Store)</li>
              <li>ابحث عن تطبيق <strong>"بريفو لتحسين السيو"</strong></li>
              <li>اضغط <strong>"تثبيت"</strong> وأعطي الصلاحيات المطلوبة</li>
              <li className="text-green-400 font-medium">✨ سيتم ربط المتجر وتزامن المنتجات تلقائياً!</li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://apps.salla.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <ExternalLink className="w-4 h-4" />
              فتح متجر تطبيقات سلة
            </a>
            
            <button
              onClick={loadSallaStores}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث الحالة
            </button>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>💡 نصيحة: بعد تثبيت التطبيق، اضغط "تحديث الحالة" لرؤية المتجر المربوط</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/products" className="text-[#83dcc9] hover:underline flex items-center gap-2">
              <span>←</span> العودة إلى المنتجات
            </Link>
          </div>
          <img src="/logo3.png" alt="Logo" className="h-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الأيسر - معلومات المستخدم والاشتراك */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* معلومات المستخدم */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                معلومات الحساب
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                  <User className="w-5 h-5 text-[#83dcc9]" />
                  <div>
                    <p className="text-sm text-gray-400">الاسم</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-[#83dcc9]" />
                  <div>
                    <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                  <Phone className="w-5 h-5 text-[#83dcc9]" />
                  <div>
                    <p className="text-sm text-gray-400">رقم الجوال</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#83dcc9]" />
                  <div>
                    <p className="text-sm text-gray-400">تاريخ التسجيل</p>
                    <p className="font-medium">{formatDate(subscription?.startDate || new Date())}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✨ قسم ربط متاجر سلة التلقائي */}
            {renderSallaIntegration()}

            {/* الاشتراك الحالي */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                الاشتراك الحالي
              </h2>
              
              <div className={`bg-gradient-to-r ${currentPlan.color} rounded-xl p-6 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentPlan.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">الخطة {currentPlan.name}</h3>
                      <p className="text-white/80">
                        {currentPlan.price > 0 ? `${currentPlan.price} ريال/شهر` : "مجانية"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      subscription?.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      subscription?.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {subscription?.status === 'active' && <CheckCircle className="w-4 h-4" />}
                      {subscription?.status === 'cancelled' && <XCircle className="w-4 h-4" />}
                      {subscription?.status === 'expired' && <AlertCircle className="w-4 h-4" />}
                      
                      {subscription?.status === 'active' ? 'نشط' :
                       subscription?.status === 'cancelled' ? 'ملغى' : 'منتهي'}
                    </div>
                  </div>
                </div>
                
                {daysUntilExpiry && daysUntilExpiry <= 7 && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        {subscription?.status === 'cancelled' 
                          ? `ينتهي اشتراكك خلال ${daysUntilExpiry} أيام`
                          : `يتجدد اشتراكك خلال ${daysUntilExpiry} أيام`
                        }
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-white/90">
                  <div>
                    <p className="text-sm text-white/70">تاريخ البداية</p>
                    <p className="font-medium">{formatDate(subscription?.startDate)}</p>
                  </div>
                  {subscription?.endDate && (
                    <div>
                      <p className="text-sm text-white/70">
                        {subscription?.status === 'cancelled' ? 'ينتهي في' : 'يتجدد في'}
                      </p>
                      <p className="font-medium">{formatDate(subscription?.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">الميزات المتاحة:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {subscription?.plan !== 'enterprise' && (
                  <button
                    onClick={handleUpgrade}
                    className="bg-[#83dcc9] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#6cc9b9] transition flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    ترقية الخطة
                  </button>
                )}
                
                {subscription?.plan !== 'free' && subscription?.status === 'active' && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    إلغاء الاشتراك
                  </button>
                )}
                
                <div className="flex gap-2 mt-3">
                  {subscription?.plan === 'free' && (
                    <>
                      <Link 
                        to="/checkout?plan=pro"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        💎 الاحترافية
                      </Link>
                      <Link 
                        to="/checkout?plan=enterprise"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        👑 الأعمال
                      </Link>
                    </>
                  )}
                  
                  {subscription?.plan === 'pro' && (
                    <Link 
                      to="/checkout?plan=enterprise"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                    >
                      👑 ترقية للأعمال
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* إحصائيات الاستخدام */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" />
                إحصائيات الاستخدام
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">المنتجات المحسنة هذا الشهر</span>
                    <span className="text-sm text-gray-400">
                      {usage.productsUsed} / {usage.productsLimit === -1 ? '∞' : usage.productsLimit}
                    </span>
                  </div>
                  
                  {usage.productsLimit !== -1 && (
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          usagePercentage > 80 ? 'bg-red-500' : 
                          usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#83dcc9]">{usage.productsUsed}</p>
                    <p className="text-xs text-gray-400">منتجات محسنة</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">87%</p>
                    <p className="text-xs text-gray-400">متوسط درجة السيو</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">23</p>
                    <p className="text-xs text-gray-400">أيام متبقية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيمن - الفواتير والإعدادات */}
          <div className="space-y-6">
            
            {/* تاريخ الفواتير */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                تاريخ الفواتير
              </h2>
              
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{invoice.period}</span>
                      <span className="text-sm text-[#83dcc9] font-bold">{invoice.amount} ريال</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDate(invoice.date)}</span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        مدفوع
                      </span>
                    </div>
                  </div>
                ))}
                
                {invoices.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">لا توجد فواتير بعد</p>
                  </div>
                )}
              </div>
            </div>

            {/* إعدادات سريعة */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات سريعة
              </h2>
              
              <div className="space-y-3">
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  <Settings className="w-4 h-4 text-[#83dcc9]" />
                  <span className="text-sm">إعدادات الحساب</span>
                </Link>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <CreditCard className="w-4 h-4 text-[#83dcc9]" />
                  <span className="text-sm">طرق الدفع</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <Mail className="w-4 h-4 text-[#83dcc9]" />
                  <span className="text-sm">تفضيلات التنبيهات</span>
                </button>

                <Link 
                  to="/products"
                  className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  <Package className="w-4 h-4 text-[#83dcc9]" />
                  <span className="text-sm">إدارة المنتجات</span>
                </Link>
              </div>
            </div>

            {/* تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* مودال إلغاء الاشتراك */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4 text-red-400">تأكيد إلغاء الاشتراك</h3>
              <p className="text-gray-300 mb-6">
                هل أنت متأكد من إلغاء اشتراكك؟ ستتمكن من استخدام الخدمة حتى نهاية الفترة المدفوعة.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "جاري الإلغاء..." : "نعم، إلغاء"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}