import React, { useState, useEffect } from 'react';
import { 
  Tags, 
  Percent, 
  DollarSign, 
  Calendar, 
  User, 
  Link2, 
  Edit, 
  Trash2, 
  Plus, 
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  Copy,
  ExternalLink,
  UserPlus,
  Settings,
  Share2
} from 'lucide-react';

// Promo Codes Management Component
const PromoCodesManagement = () => {
  const [activePromoTab, setActivePromoTab] = useState('discount');
  const [discountCodes, setDiscountCodes] = useState([
    {
      id: 1,
      code: 'SUMMER2024',
      discountType: 'percentage',
      discountValue: 20,
      startDate: '2024-06-01',
      expirationDate: '2024-08-31',
      usageLimit: 500,
      currentUsage: 127,
      status: 'active',
      applicablePlans: ['pro', 'enterprise'],
      billingCycleRestriction: 'all',
      minPurchase: 0,
      description: 'عرض الصيف الخاص',
      statistics: {
        totalUsed: 127,
        uniqueCustomers: 98,
        totalSales: 15680,
        averageOrderValue: 123.46,
        conversionRate: 0.67
      }
    },
    {
      id: 2,
      code: 'FIRSTORDER',
      discountType: 'fixed',
      discountValue: 50,
      startDate: '2024-01-01',
      expirationDate: '2024-12-31',
      usageLimit: 1000,
      currentUsage: 342,
      status: 'active',
      applicablePlans: ['pro', 'enterprise'],
      billingCycleRestriction: 'monthly',
      minPurchase: 0,
      description: 'خصم الطلب الأول',
      statistics: {
        totalUsed: 342,
        uniqueCustomers: 298,
        totalSales: 28450,
        averageOrderValue: 83.19,
        conversionRate: 0.87
      }
    }
  ]);

  const [affiliateCodes, setAffiliateCodes] = useState([
    {
      id: 1,
      code: 'Ahmed_REF',
      assignedUser: 'أحمد محمد',
      clicks: 1245,
      conversions: 87,
      commissionEarned: 4350,
      commissionRate: 0.15,
      customerDiscountType: 'percentage',
      customerDiscountValue: 10,
      status: 'active',
      startDate: '2024-01-15',
      applicablePlans: ['pro', 'enterprise'],
      billingCycleRestriction: 'all',
      statistics: {
        totalUsed: 87,
        uniqueCustomers: 78,
        totalSales: 29000,
        averageOrderValue: 333.33,
        conversionRate: 0.07
      }
    },
    {
      id: 2,
      code: 'FATIMA_SHARE',
      assignedUser: 'فاطمة علي',
      clicks: 892,
      conversions: 56,
      commissionEarned: 2800,
      commissionRate: 0.12,
      customerDiscountType: 'fixed',
      customerDiscountValue: 25,
      status: 'active',
      startDate: '2024-02-01',
      applicablePlans: ['pro'],
      billingCycleRestriction: 'monthly',
      statistics: {
        totalUsed: 56,
        uniqueCustomers: 51,
        totalSales: 23333,
        averageOrderValue: 416.66,
        conversionRate: 0.063
      }
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isMarketerModalOpen, setIsMarketerModalOpen] = useState(false);
  const [currentEditCode, setCurrentEditCode] = useState(null);
  const [currentStatsCode, setCurrentStatsCode] = useState(null);
  const [marketers, setMarketers] = useState([
    { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '+966501234567' },
    { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', phone: '+966501234568' },
    { id: 3, name: 'محمد خالد', email: 'mohammed@example.com', phone: '+966501234569' },
    { id: 4, name: 'سارة أحمد', email: 'sara@example.com', phone: '+966501234570' }
  ]);
  const [newMarketer, setNewMarketer] = useState({ name: '', email: '', phone: '' });
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    customerDiscountType: 'percentage',
    customerDiscountValue: '',
    startDate: '',
    expirationDate: '',
    usageLimit: '',
    minPurchase: 0,
    description: '',
    applicablePlans: ['pro', 'enterprise'],
    billingCycleRestriction: 'all',
    status: 'active',
    assignedUser: '',
    commissionRate: 0.15
  });

  const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'active': return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
        case 'inactive': return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
        case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle };
        default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle };
      }
    };

    const { bg, text, icon: Icon } = getStatusConfig();
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
        <Icon size={14} />
        {status === 'active' ? 'نشط' : status === 'inactive' ? 'غير نشط' : 'معلق'}
      </span>
    );
  };

  const handleCodeClick = (code) => {
    setCurrentStatsCode(code);
    setIsStatsModalOpen(true);
  };

  const handleEditCode = (e, code) => {
    e.stopPropagation();
    setCurrentEditCode(code);
    
    setFormData({
      code: code.code || '',
      discountType: code.discountType || 'percentage',
      discountValue: code.discountValue || '',
      customerDiscountType: code.customerDiscountType || 'percentage',
      customerDiscountValue: code.customerDiscountValue || '',
      startDate: code.startDate || '',
      expirationDate: code.expirationDate || '',
      usageLimit: code.usageLimit || '',
      minPurchase: code.minPurchase || 0,
      description: code.description || '',
      applicablePlans: code.applicablePlans || ['pro', 'enterprise'],
      billingCycleRestriction: code.billingCycleRestriction || 'all',
      status: code.status || 'active',
      assignedUser: code.assignedUser || '',
      commissionRate: code.commissionRate || 0.15
    });
    
    setIsCreateModalOpen(true);
  };

  const handleCreateNew = () => {
    setCurrentEditCode(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      customerDiscountType: 'percentage',
      customerDiscountValue: '',
      startDate: '',
      expirationDate: '',
      usageLimit: '',
      minPurchase: 0,
      description: '',
      applicablePlans: ['pro', 'enterprise'],
      billingCycleRestriction: 'all',
      status: 'active',
      assignedUser: '',
      commissionRate: 0.15
    });
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newCodeData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      customerDiscountValue: parseFloat(formData.customerDiscountValue) || 0,
      usageLimit: parseInt(formData.usageLimit) || 0,
      minPurchase: parseFloat(formData.minPurchase) || 0,
      currentUsage: 0,
      clicks: 0,
      conversions: 0,
      commissionEarned: 0,
      statistics: {
        totalUsed: 0,
        uniqueCustomers: 0,
        totalSales: 0,
        averageOrderValue: 0,
        conversionRate: 0
      }
    };
    
    if (currentEditCode) {
      if (activePromoTab === 'discount') {
        setDiscountCodes(codes => 
          codes.map(code => 
            code.id === currentEditCode.id 
              ? { ...code, ...newCodeData }
              : code
          )
        );
      } else {
        setAffiliateCodes(codes => 
          codes.map(code => 
            code.id === currentEditCode.id 
              ? { ...code, ...newCodeData }
              : code
          )
        );
      }
    } else {
      const newId = Math.max(
        ...discountCodes.map(c => c.id), 
        ...affiliateCodes.map(c => c.id), 
        0
      ) + 1;
      
      if (activePromoTab === 'discount') {
        setDiscountCodes(codes => [...codes, { id: newId, ...newCodeData }]);
      } else {
        setAffiliateCodes(codes => [...codes, { id: newId, ...newCodeData }]);
      }
    }
    
    setIsCreateModalOpen(false);
    setCurrentEditCode(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addNewMarketer = () => {
    if (newMarketer.name && newMarketer.email) {
      const newId = Math.max(...marketers.map(m => m.id), 0) + 1;
      const newMarketerData = { id: newId, ...newMarketer };
      setMarketers([...marketers, newMarketerData]);
      setFormData(prev => ({ ...prev, assignedUser: newMarketer.name }));
      setNewMarketer({ name: '', email: '', phone: '' });
      setIsMarketerModalOpen(false);
    }
  };

  const generateAffiliateLink = (code, plan = 'pro') => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/checkout?plan=${plan}&affiliate=${code}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('تم النسخ بنجاح!');
    });
  };

  const handleDeleteCode = (e, codeId) => {
    e.stopPropagation();
    if (activePromoTab === 'discount') {
      setDiscountCodes(codes => codes.filter(code => code.id !== codeId));
    } else {
      setAffiliateCodes(codes => codes.filter(code => code.id !== codeId));
    }
  };

  const renderMarketerModal = () => {
    if (!isMarketerModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">إضافة مسوق جديد</h3>
              <button 
                onClick={() => setIsMarketerModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                <input 
                  type="text" 
                  placeholder="أدخل اسم المسوق"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={newMarketer.name}
                  onChange={(e) => setNewMarketer(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  placeholder="marketer@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={newMarketer.email}
                  onChange={(e) => setNewMarketer(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input 
                  type="tel" 
                  placeholder="+966501234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={newMarketer.phone}
                  onChange={(e) => setNewMarketer(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsMarketerModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button 
                onClick={addNewMarketer}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                إضافة المسوق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsModal = () => {
    if (!isStatsModalOpen || !currentStatsCode) return null;

    const stats = currentStatsCode.statistics;
    const isDiscount = activePromoTab === 'discount';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div>
              <h3 className="text-2xl font-bold">{currentStatsCode.code}</h3>
              <p className="text-blue-100 mt-1">إحصائيات الكود التفصيلية</p>
            </div>
            <button 
              onClick={() => {
                setIsStatsModalOpen(false);
                setCurrentStatsCode(null);
              }} 
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XCircle size={28} />
            </button>
          </div>
          
          <div className="p-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">عدد مرات الاستخدام</p>
                    <p className="text-3xl font-bold text-green-800 mt-2">{stats.totalUsed}</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-full">
                    <BarChart3 className="text-green-700" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">عدد العملاء</p>
                    <p className="text-3xl font-bold text-blue-800 mt-2">{stats.uniqueCustomers}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-full">
                    <Users className="text-blue-700" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">إجمالي المبيعات</p>
                    <p className="text-3xl font-bold text-purple-800 mt-2">${stats.totalSales.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-full">
                    <DollarSign className="text-purple-700" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">متوسط قيمة الطلب</p>
                    <p className="text-3xl font-bold text-orange-800 mt-2">${stats.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-full">
                    <ShoppingCart className="text-orange-700" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Code Details and Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Tags size={20} />
                  تفاصيل الكود
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">نوع الكود:</span>
                    <span className="font-medium">
                      {isDiscount ? 'كود خصم' : 'كود تسويق'}
                    </span>
                  </div>
                  
                  {isDiscount ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع الخصم:</span>
                        <span className="font-medium">
                          {currentStatsCode.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">قيمة الخصم:</span>
                        <span className="font-medium">
                          {currentStatsCode.discountType === 'percentage' 
                            ? `${currentStatsCode.discountValue}%` 
                            : `$${currentStatsCode.discountValue}`}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المسوق:</span>
                        <span className="font-medium">{currentStatsCode.assignedUser}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نسبة العمولة:</span>
                        <span className="font-medium">{(currentStatsCode.commissionRate * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">العمولة المكتسبة:</span>
                        <span className="font-medium">${currentStatsCode.commissionEarned}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">خصم العميل:</span>
                        <span className="font-medium">
                          {currentStatsCode.customerDiscountType === 'percentage' 
                            ? `${currentStatsCode.customerDiscountValue}%` 
                            : `$${currentStatsCode.customerDiscountValue}`}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!isDiscount && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Share2 size={20} />
                    روابط التسويق
                  </h4>
                  <div className="space-y-3">
                    {currentStatsCode.applicablePlans?.map((plan) => (
                      <div key={plan} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {plan === 'pro' ? 'الخطة الاحترافية' : 'خطة الأعمال'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            plan === 'pro' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {plan}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={generateAffiliateLink(currentStatsCode.code, plan)}
                            readOnly
                            className="flex-1 text-xs bg-gray-50 border rounded px-2 py-1 text-gray-600"
                          />
                          <button 
                            onClick={() => copyToClipboard(generateAffiliateLink(currentStatsCode.code, plan))}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="نسخ الرابط"
                          >
                            <Copy size={14} />
                          </button>
                          <button 
                            onClick={() => window.open(generateAffiliateLink(currentStatsCode.code, plan), '_blank')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="فتح الرابط"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={(e) => {
                  setIsStatsModalOpen(false);
                  setCurrentStatsCode(null);
                  handleEditCode(e, currentStatsCode);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                تعديل الكود
              </button>
              <button 
                onClick={() => {
                  setIsStatsModalOpen(false);
                  setCurrentStatsCode(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDiscountCodesTable = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">كود الخصم</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">نوع الخصم</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">قيمة الخصم</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الخطط المطبقة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">دورة الفوترة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">تاريخ البداية</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">تاريخ الانتهاء</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الاستخدام الحالي</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الحالة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {discountCodes.map((code) => (
              <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                <td 
                  className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                  onClick={() => handleCodeClick(code)}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-gray-400" />
                    {code.code}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    code.discountType === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {code.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">
                  {code.discountType === 'percentage' 
                    ? `${code.discountValue}%` 
                    : `${code.discountValue}`
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {code.applicablePlans.map((plan) => (
                      <span 
                        key={plan}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan === 'pro' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {plan === 'pro' ? 'احترافية' : 'أعمال'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    code.billingCycleRestriction === 'monthly' 
                      ? 'bg-orange-100 text-orange-800'
                      : code.billingCycleRestriction === 'yearly'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {code.billingCycleRestriction === 'monthly' 
                      ? 'شهري فقط'
                      : code.billingCycleRestriction === 'yearly'
                        ? 'سنوي فقط'
                        : 'جميع الأنواع'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{code.startDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{code.expirationDate}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    code.currentUsage / code.usageLimit > 0.8 
                      ? 'bg-red-100 text-red-800' 
                      : code.currentUsage / code.usageLimit > 0.5 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {code.currentUsage} / {code.usageLimit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={code.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={(e) => handleEditCode(e, code)}
                      title="تعديل"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => handleDeleteCode(e, code.id)}
                      title="حذف"
                    >
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
  );

  const renderAffiliateCodesTable = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">أكواد التسويق</h3>
        <button 
          onClick={() => setIsMarketerModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <UserPlus size={16} />
          إضافة مسوق جديد
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">كود التسويق</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المستخدم المعين</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">خصم العميل</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الخطط المطبقة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">دورة الفوترة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">النقرات</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">التحويلات</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">نسبة العمولة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">العمولة المكتسبة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الحالة</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {affiliateCodes.map((code) => (
              <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                <td 
                  className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                  onClick={() => handleCodeClick(code)}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-gray-400" />
                    {code.code}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {code.assignedUser.charAt(0)}
                    </div>
                    <span>{code.assignedUser}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    code.customerDiscountType === 'percentage' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {code.customerDiscountType === 'percentage' 
                      ? `${code.customerDiscountValue}%` 
                      : `${code.customerDiscountValue}`}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{code.clicks}</td>
                <td className="px-6 py-4 text-sm font-medium">{code.conversions}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{(code.commissionRate * 100).toFixed(0)}%</td>
                <td className="px-6 py-4 text-sm font-medium">${code.commissionEarned}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={code.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={(e) => handleEditCode(e, code)}
                      title="تعديل"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => handleDeleteCode(e, code.id)}
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => copyToClipboard(generateAffiliateLink(code.code, 'pro'))}
                      title="نسخ رابط التسويق للخطة الاحترافية"
                    >
                      <Link2 size={16} />
                    </button>
                    <button 
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      onClick={() => copyToClipboard(generateAffiliateLink(code.code, 'enterprise'))}
                      title="نسخ رابط التسويق لخطة الأعمال"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCreateEditModal = () => {
    if (!isCreateModalOpen) return null;

    const isDiscountTab = activePromoTab === 'discount';
    const isEditing = !!currentEditCode;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-0 transform transition-all duration-300 scale-100">
          {/* Header with gradient */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {isEditing ? 'تعديل الكود' : 'إنشاء كود جديد'}
                </h3>
                <p className="text-blue-100 mt-1">
                  {isDiscountTab ? 'كود خصم' : 'كود تسويق'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCurrentEditCode(null);
                }} 
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-6 bg-gray-50">
            <form className="space-y-5" onSubmit={handleFormSubmit}>
              {isDiscountTab ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">كود الخصم</label>
                    <input 
                      type="text" 
                      placeholder="مثال: SUMMER2024"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الخصم</label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.discountType}
                        onChange={(e) => handleInputChange('discountType', e.target.value)}
                      >
                        <option value="percentage">نسبة مئوية</option>
                        <option value="fixed">مبلغ ثابت</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">قيمة الخصم</label>
                      <input 
                        type="number" 
                        placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.discountValue}
                        onChange={(e) => handleInputChange('discountValue', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ البداية</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ الانتهاء</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.expirationDate}
                        onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الحد الأقصى للاستخدام</label>
                      <input 
                        type="number" 
                        placeholder="500"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.usageLimit}
                        onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">كود التسويق</label>
                    <input 
                      type="text" 
                      placeholder="مثال: AHMED_REF"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">المستخدم المعين</label>
                      <div className="flex gap-2">
                        <select 
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                          value={formData.assignedUser}
                          onChange={(e) => handleInputChange('assignedUser', e.target.value)}
                        >
                          <option value="">اختر مستخدم</option>
                          {marketers.map((marketer) => (
                            <option key={marketer.id} value={marketer.name}>
                              {marketer.name}
                            </option>
                          ))}
                        </select>
                        <button 
                          type="button"
                          onClick={() => setIsMarketerModalOpen(true)}
                          className="px-3 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                          title="إضافة مسوق جديد"
                        >
                          <UserPlus size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">نسبة العمولة (%)</label>
                      <input 
                        type="number" 
                        step="1" 
                        min="0" 
                        max="100"
                        placeholder="15"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.commissionRate * 100}
                        onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) / 100)}
                      />
                    </div>
                  </div>

                  {/* Customer Discount Section */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3">خصم العميل</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">نوع الخصم للعميل</label>
                        <select 
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          value={formData.customerDiscountType}
                          onChange={(e) => handleInputChange('customerDiscountType', e.target.value)}
                        >
                          <option value="percentage">نسبة مئوية</option>
                          <option value="fixed">مبلغ ثابت</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">قيمة خصم العميل</label>
                        <input 
                          type="number" 
                          placeholder={formData.customerDiscountType === 'percentage' ? '10' : '25'}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          value={formData.customerDiscountValue}
                          onChange={(e) => handleInputChange('customerDiscountValue', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plans and Billing Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الخطط المطبقة</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={formData.applicablePlans.includes('pro')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('applicablePlans', [...formData.applicablePlans, 'pro']);
                              } else {
                                handleInputChange('applicablePlans', formData.applicablePlans.filter(p => p !== 'pro'));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">الخطة الاحترافية</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={formData.applicablePlans.includes('enterprise')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('applicablePlans', [...formData.applicablePlans, 'enterprise']);
                              } else {
                                handleInputChange('applicablePlans', formData.applicablePlans.filter(p => p !== 'enterprise'));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">خطة الأعمال</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">دورة الفوترة</label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.billingCycleRestriction}
                        onChange={(e) => handleInputChange('billingCycleRestriction', e.target.value)}
                      >
                        <option value="all">جميع الأنواع</option>
                        <option value="monthly">شهري فقط</option>
                        <option value="yearly">سنوي فقط</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ البداية</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                      </select>
                    </div>
                  </div>

                  {/* Generated Links Preview */}
                  {formData.code && formData.applicablePlans.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Link2 size={16} />
                        روابط التسويق المُنشأة
                      </h4>
                      <div className="space-y-2">
                        {formData.applicablePlans.map((plan) => (
                          <div key={plan} className="bg-white p-3 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {plan === 'pro' ? 'الخطة الاحترافية' : 'خطة الأعمال'}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                plan === 'pro' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {plan}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                value={generateAffiliateLink(formData.code, plan)}
                                readOnly
                                className="flex-1 text-xs bg-gray-50 border rounded px-2 py-1 text-gray-600"
                              />
                              <button 
                                type="button"
                                onClick={() => copyToClipboard(generateAffiliateLink(formData.code, plan))}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="نسخ الرابط"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Common Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف</label>
                <textarea 
                  placeholder="وصف مختصر للكود..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCurrentEditCode(null);
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                إلغاء
              </button>
              <button 
                type="submit"
                onClick={handleFormSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isEditing ? 'تحديث الكود' : 'إنشاء الكود'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة أكواد الترويج</h2>
          <p className="text-gray-600">إدارة أكواد الخصم والتسويق مع إحصائيات تفصيلية</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleCreateNew}
          >
            <Plus size={16} />
            إنشاء كود جديد
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            تصدير
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => setActivePromoTab('discount')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activePromoTab === 'discount' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Percent size={16} />
          أكواد الخصم
        </button>
        <button
          onClick={() => setActivePromoTab('affiliate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activePromoTab === 'affiliate' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Link2 size={16} />
          أكواد التسويق
        </button>
      </div>

      {/* Content */}
      {activePromoTab === 'discount' 
        ? renderDiscountCodesTable() 
        : renderAffiliateCodesTable()}

      {/* Create/Edit Modal */}
      {renderCreateEditModal()}

      {/* Statistics Modal */}
      {renderStatsModal()}

      {/* Marketer Modal */}
      {renderMarketerModal()}
    </div>
  );
};

export default PromoCodesManagement;