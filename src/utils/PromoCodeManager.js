// PromoCodeManager.js - إدارة أكواد الخصم

export class PromoCodeManager {
  constructor() {
    this.codes = this.loadCodes();
  }

  // تحميل الأكواد من localStorage أو API
  loadCodes() {
    const savedCodes = localStorage.getItem('promo_codes');
    return savedCodes ? JSON.parse(savedCodes) : this.getDefaultCodes();
  }

  // الأكواد الافتراضية
  getDefaultCodes() {
    return {
      // أكواد عامة
      'WELCOME20': {
        type: 'percentage',
        value: 20,
        maxUses: 100,
        currentUses: 0,
        active: true,
        expiryDate: '2025-12-31',
        description: 'خصم ترحيبي 20%',
        categories: ['all'],
        minimumAmount: 0
      },
      'FIRST50': {
        type: 'percentage', 
        value: 50,
        maxUses: 50,
        currentUses: 0,
        active: true,
        expiryDate: '2025-06-30',
        description: 'خصم العملاء الجدد 50%',
        categories: ['new_users'],
        minimumAmount: 0
      },
      'SAVE30': {
        type: 'percentage',
        value: 30,
        maxUses: 200,
        currentUses: 0,
        active: true,
        expiryDate: '2025-12-31',
        description: 'خصم ثابت 30%',
        categories: ['all'],
        minimumAmount: 100
      },
      // أكواد مجانية للخدمة
      'FREE_PRO_30': {
        type: 'free_plan',
        value: 'pro',
        duration: 30, // أيام
        maxUses: 10,
        currentUses: 0,
        active: true,
        expiryDate: '2025-12-31',
        description: 'خطة احترافية مجانية لمدة 30 يوم',
        categories: ['free_trial']
      },
      'VIP_ACCESS': {
        type: 'free_plan',
        value: 'enterprise',
        duration: 14,
        maxUses: 5,
        currentUses: 0,
        active: true,
        expiryDate: '2025-08-31',
        description: 'وصول VIP مجاني لخطة الأعمال',
        categories: ['vip']
      }
    };
  }

  // حفظ الأكواد
  saveCodes() {
    localStorage.setItem('promo_codes', JSON.stringify(this.codes));
  }

  // إنشاء كود جديد
  createCode(codeData) {
    const code = codeData.code.toUpperCase();
    
    if (this.codes[code]) {
      throw new Error('هذا الكود موجود مسبقاً');
    }

    this.codes[code] = {
      type: codeData.type, // 'percentage', 'fixed', 'free_plan'
      value: codeData.value,
      duration: codeData.duration || null,
      maxUses: codeData.maxUses || -1, // -1 = غير محدود
      currentUses: 0,
      active: true,
      expiryDate: codeData.expiryDate,
      description: codeData.description,
      categories: codeData.categories || ['all'],
      minimumAmount: codeData.minimumAmount || 0,
      createdAt: new Date().toISOString(),
      createdBy: codeData.createdBy || 'admin'
    };

    this.saveCodes();
    return this.codes[code];
  }

  // التحقق من صحة الكود
  validateCode(code, userEmail = null, planPrice = 0) {
    const upperCode = code.toUpperCase();
    const promoCode = this.codes[upperCode];

    if (!promoCode) {
      return { valid: false, error: 'كود الخصم غير صحيح' };
    }

    if (!promoCode.active) {
      return { valid: false, error: 'هذا الكود غير نشط' };
    }

    // فحص انتهاء الصلاحية
    if (new Date() > new Date(promoCode.expiryDate)) {
      return { valid: false, error: 'انتهت صلاحية هذا الكود' };
    }

    // فحص عدد الاستخدامات
    if (promoCode.maxUses !== -1 && promoCode.currentUses >= promoCode.maxUses) {
      return { valid: false, error: 'تم استنفاد هذا الكود' };
    }

    // فحص الحد الأدنى للمبلغ
    if (planPrice < promoCode.minimumAmount) {
      return { 
        valid: false, 
        error: `الحد الأدنى لاستخدام هذا الكود ${promoCode.minimumAmount} ريال` 
      };
    }

    // فحص فئة المستخدم (للعملاء الجدد)
    if (promoCode.categories.includes('new_users') && userEmail) {
      const isNewUser = this.checkIfNewUser(userEmail);
      if (!isNewUser) {
        return { valid: false, error: 'هذا الكود للعملاء الجدد فقط' };
      }
    }

    return { valid: true, code: promoCode };
  }

  // تطبيق الكود
  applyCode(code, planPrice, userEmail = null) {
    const validation = this.validateCode(code, userEmail, planPrice);
    
    if (!validation.valid) {
      return validation;
    }

    const promoCode = validation.code;
    let discount = 0;
    let newPlan = null;
    let duration = null;

    switch (promoCode.type) {
      case 'percentage':
        discount = (planPrice * promoCode.value) / 100;
        break;
      case 'fixed':
        discount = Math.min(promoCode.value, planPrice);
        break;
      case 'free_plan':
        newPlan = promoCode.value;
        duration = promoCode.duration;
        discount = planPrice; // خصم كامل
        break;
    }

    // تحديث عدد الاستخدامات
    this.codes[code.toUpperCase()].currentUses++;
    this.saveCodes();

    // تسجيل الاستخدام
    this.logCodeUsage(code, userEmail, discount);

    return {
      valid: true,
      discount,
      newPlan,
      duration,
      description: promoCode.description,
      finalPrice: Math.max(0, planPrice - discount)
    };
  }

  // فحص إذا كان المستخدم جديد
  checkIfNewUser(email) {
    const usedCodes = JSON.parse(localStorage.getItem('used_codes') || '[]');
    return !usedCodes.some(usage => usage.email === email);
  }

  // تسجيل استخدام الكود
  logCodeUsage(code, userEmail, discount) {
    const usedCodes = JSON.parse(localStorage.getItem('used_codes') || '[]');
    usedCodes.push({
      code: code.toUpperCase(),
      email: userEmail,
      discount,
      usedAt: new Date().toISOString()
    });
    localStorage.setItem('used_codes', JSON.stringify(usedCodes));
  }

  // الحصول على إحصائيات الأكواد
  getCodeStats() {
    const stats = {
      totalCodes: Object.keys(this.codes).length,
      activeCodes: 0,
      totalUses: 0,
      totalDiscount: 0
    };

    Object.values(this.codes).forEach(code => {
      if (code.active) stats.activeCodes++;
      stats.totalUses += code.currentUses;
    });

    const usedCodes = JSON.parse(localStorage.getItem('used_codes') || '[]');
    stats.totalDiscount = usedCodes.reduce((sum, usage) => sum + usage.discount, 0);

    return stats;
  }

  // توليد كود عشوائي
  generateRandomCode(prefix = 'PROMO') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix + '_';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // الحصول على جميع الأكواد النشطة
  getActiveCodes() {
    return Object.entries(this.codes)
      .filter(([_, code]) => code.active && new Date() <= new Date(code.expiryDate))
      .map(([codeKey, code]) => ({
        code: codeKey,
        ...code
      }));
  }

  // تعطيل كود
  deactivateCode(code) {
    const upperCode = code.toUpperCase();
    if (this.codes[upperCode]) {
      this.codes[upperCode].active = false;
      this.saveCodes();
      return true;
    }
    return false;
  }

  // تنشيط كود
  activateCode(code) {
    const upperCode = code.toUpperCase();
    if (this.codes[upperCode]) {
      this.codes[upperCode].active = true;
      this.saveCodes();
      return true;
    }
    return false;
  }

  // حذف كود
  deleteCode(code) {
    const upperCode = code.toUpperCase();
    if (this.codes[upperCode]) {
      delete this.codes[upperCode];
      this.saveCodes();
      return true;
    }
    return false;
  }
}

// مثال على الاستخدام في Checkout.js
export const usePromoCode = () => {
  const promoManager = new PromoCodeManager();

  const applyPromoCode = (code, planPrice, userEmail) => {
    try {
      const result = promoManager.applyCode(code, planPrice, userEmail);
      return result;
    } catch (error) {
      return { valid: false, error: error.message };
    }
  };

  return { applyPromoCode, promoManager };
};

// AdminPanel.js - مكون لوحة التحكم البسيط
export const PromoCodeAdmin = () => {
  const [codes, setCodes] = useState({});
  const [newCode, setNewCode] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    maxUses: 100,
    expiryDate: '',
    description: ''
  });
  const promoManager = new PromoCodeManager();

  useEffect(() => {
    setCodes(promoManager.codes);
  }, []);

  const handleCreateCode = () => {
    try {
      promoManager.createCode(newCode);
      setCodes(promoManager.codes);
      toast.success('تم إنشاء الكود بنجاح');
      setNewCode({
        code: '',
        type: 'percentage', 
        value: 0,
        maxUses: 100,
        expiryDate: '',
        description: ''
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const stats = promoManager.getCodeStats();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة أكواد الخصم</h1>
      
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">إجمالي الأكواد</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalCodes}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">الأكواد النشطة</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeCodes}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">مرات الاستخدام</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalUses}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800">إجمالي الخصم</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.totalDiscount} ريال</p>
        </div>
      </div>

      {/* إنشاء كود جديد */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">إنشاء كود جديد</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="كود الخصم"
            value={newCode.code}
            onChange={(e) => setNewCode(prev => ({...prev, code: e.target.value}))}
            className="border rounded-lg px-3 py-2"
          />
          <select
            value={newCode.type}
            onChange={(e) => setNewCode(prev => ({...prev, type: e.target.value}))}
            className="border rounded-lg px-3 py-2"
          >
            <option value="percentage">نسبة مئوية</option>
            <option value="fixed">مبلغ ثابت</option>
            <option value="free_plan">خطة مجانية</option>
          </select>
          <input
            type="number"
            placeholder="القيمة"
            value={newCode.value}
            onChange={(e) => setNewCode(prev => ({...prev, value: Number(e.target.value)}))}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="عدد الاستخدامات"
            value={newCode.maxUses}
            onChange={(e) => setNewCode(prev => ({...prev, maxUses: Number(e.target.value)}))}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={newCode.expiryDate}
            onChange={(e) => setNewCode(prev => ({...prev, expiryDate: e.target.value}))}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            placeholder="الوصف"
            value={newCode.description}
            onChange={(e) => setNewCode(prev => ({...prev, description: e.target.value}))}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <button
          onClick={handleCreateCode}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          إنشاء الكود
        </button>
      </div>

      {/* قائمة الأكواد */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-6 border-b">الأكواد الحالية</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">الكود</th>
                <th className="px-6 py-3 text-right">النوع</th>
                <th className="px-6 py-3 text-right">القيمة</th>
                <th className="px-6 py-3 text-right">الاستخدام</th>
                <th className="px-6 py-3 text-right">الحالة</th>
                <th className="px-6 py-3 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(codes).map(([codeKey, code]) => (
                <tr key={codeKey} className="border-b">
                  <td className="px-6 py-4 font-mono">{codeKey}</td>
                  <td className="px-6 py-4">{code.type}</td>
                  <td className="px-6 py-4">{code.value}{code.type === 'percentage' ? '%' : ' ريال'}</td>
                  <td className="px-6 py-4">{code.currentUses}/{code.maxUses === -1 ? '∞' : code.maxUses}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${code.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {code.active ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => code.active ? promoManager.deactivateCode(codeKey) : promoManager.activateCode(codeKey)}
                      className="text-blue-600 hover:underline"
                    >
                      {code.active ? 'تعطيل' : 'تنشيط'}
                    </button>
                    <button
                      onClick={() => promoManager.deleteCode(codeKey)}
                      className="text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};