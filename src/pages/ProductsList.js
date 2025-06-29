import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Package, 
  Calendar,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Crown,
  RefreshCw,
  Sparkles,
  Star,
  ShoppingBag,
  Image as ImageIcon
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// Constants
const ITEMS_PER_PAGE_OPTIONS = [8, 12, 16, 20, 24];
const STATUS_OPTIONS = ["الكل", "ممتاز", "جيد", "متوسط", "ضعيف", "جديد"];
const SORT_OPTIONS = [
  { value: "lastUpdated", label: "آخر تحديث" },
  { value: "seoScore", label: "درجة السيو" },
  { value: "name", label: "الاسم" },
  { value: "created", label: "تاريخ الإنشاء" }
];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// صور افتراضية جميلة للمنتجات
const DEFAULT_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop&crop=center", 
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop&crop=center"
];

// Utility functions
const getStatusColor = (status) => {
  const colors = {
    "ممتاز": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "جيد": "bg-blue-100 text-blue-800 border-blue-200", 
    "متوسط": "bg-amber-100 text-amber-800 border-amber-200",
    "ضعيف": "bg-red-100 text-red-800 border-red-200",
    "جديد": "bg-purple-100 text-purple-800 border-purple-200"
  };
  return colors[status] || colors["جديد"];
};

const getStatusIcon = (status) => {
  const icons = {
    "ممتاز": <CheckCircle className="w-4 h-4" />,
    "جيد": <TrendingUp className="w-4 h-4" />,
    "متوسط": <AlertCircle className="w-4 h-4" />,
    "ضعيف": <XCircle className="w-4 h-4" />,
    "جديد": <Sparkles className="w-4 h-4" />
  };
  return icons[status] || icons["جديد"];
};

const calculateSEOStatus = (score) => {
  if (score === null || score === undefined) return "جديد";
  if (score >= 85) return "ممتاز";
  if (score >= 70) return "جيد";
  if (score >= 50) return "متوسط";
  return "ضعيف";
};

// دالة لإنشاء صورة افتراضية بناء على اسم المنتج
const getProductImage = (productName, productId) => {
  const index = productId % DEFAULT_PRODUCT_IMAGES.length;
  return DEFAULT_PRODUCT_IMAGES[index];
};

export default function ProductsList() {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lastUpdated");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  // Form state for new product
  const [newProduct, setNewProduct] = useState({
    name: ""
  });

  // User subscription info - فصل العدادات
  const [userPlan, setUserPlan] = useState("free");
  
  // عداد المنتجات منفصل
  const [usageStats, setUsageStats] = useState({
    productsUsed: 0,
    productsLimit: 3,
    canAddMore: true
  });

  // عداد التوليد الذكي منفصل
  const [aiUsageStats, setAiUsageStats] = useState({
    used: 0,
    limit: 3,
    resetDate: null
  });

  const navigate = useNavigate();

  // تحميل إحصائيات التوليد الذكي
  const loadAiUsage = () => {
    const usage = JSON.parse(localStorage.getItem("seo_trial_usage") || "{}");
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    if (!usage.month || usage.month !== currentMonth) {
      const newUsage = {
        used: 0,
        limit: 3,
        month: currentMonth,
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
      };
      localStorage.setItem("seo_trial_usage", JSON.stringify(newUsage));
      setAiUsageStats(newUsage);
    } else {
      setAiUsageStats(usage);
    }
  };

  // Load user plan and usage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    
    const plan = subscription.plan || user.plan || "free";
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    setUserPlan(isOwner ? "owner" : plan);
    
    // Set limits based on plan - للمنتجات فقط
    const limits = {
      free: 3,
      pro: 30,
      enterprise: -1 // unlimited
    };
    
    const currentLimit = limits[plan] || limits.free;
    setUsageStats(prev => ({
      ...prev,
      productsLimit: currentLimit
    }));

    // تحميل إحصائيات التوليد الذكي للمجانيين فقط
    if (!isOwner && plan === "free") {
      loadAiUsage();
    }
  }, []);

  // Load products from localStorage only (until backend is ready)
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading products from localStorage...');
      
      // Load from localStorage only (API endpoints not ready yet)
      const saved = JSON.parse(localStorage.getItem("saved_products") || "[]");
      
      if (saved.length > 0) {
        console.log(`✅ Loaded ${saved.length} products from localStorage`);
        setProducts(saved);
        setUsageStats(prev => ({ 
          ...prev, 
          productsUsed: saved.length,
          canAddMore: prev.productsLimit === -1 || saved.length < prev.productsLimit
        }));
      } else {
        // Generate dummy data for demo
        console.log('📝 Generating dummy products...');
        const dummyData = Array.from({ length: 5 }).map((_, i) => ({
          id: i + 1,
          name: `منتج تجريبي رقم ${i + 1}`,
          description: `وصف تفصيلي للمنتج التجريبي رقم ${i + 1}`,
          seoScore: Math.floor(Math.random() * 100),
          status: calculateSEOStatus(Math.floor(Math.random() * 100)),
          lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          category: ["إلكترونيات", "ملابس", "منزل", "رياضة"][Math.floor(Math.random() * 4)],
          targetKeyword: `كلمة مفتاحية ${i + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        setProducts(dummyData);
        setUsageStats(prev => ({ 
          ...prev, 
          productsUsed: dummyData.length,
          canAddMore: prev.productsLimit === -1 || dummyData.length < prev.productsLimit
        }));
        localStorage.setItem("saved_products", JSON.stringify(dummyData));
        console.log('✅ Generated and saved dummy products');
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setErrors(prev => ({ ...prev, load: "فشل في تحميل المنتجات" }));
      toast.error("فشل في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesStatus = statusFilter === "الكل" || product.status === statusFilter;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "lastUpdated" || sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, statusFilter, searchQuery, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const averageScore = totalProducts > 0 
      ? Math.round(filteredProducts.reduce((sum, p) => sum + (p.seoScore || 0), 0) / totalProducts)
      : 0;
    
    const statusCounts = STATUS_OPTIONS.slice(1).reduce((acc, status) => {
      acc[status] = filteredProducts.filter(p => p.status === status).length;
      return acc;
    }, {});

    return {
      total: totalProducts,
      averageScore,
      statusCounts
    };
  }, [filteredProducts]);

  // Event handlers
  const handleAnalyze = useCallback((product) => {
    navigate(`/product-seo/${product.id}`, { state: { product } });
  }, [navigate]);

  const handleNewProductChange = useCallback((value) => {
    setNewProduct({ name: value });
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: null }));
    }
  }, [errors]);

  const validateNewProduct = useCallback(() => {
    const newErrors = {};
    
    if (!newProduct.name.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    } else if (newProduct.name.trim().length < 3) {
      newErrors.name = "اسم المنتج يجب أن يكون 3 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newProduct]);

  const handleSubmit = useCallback(async () => {
    if (!validateNewProduct()) return;
    
    if (!usageStats.canAddMore) {
      toast.error(`وصلت للحد الأقصى من المنتجات (${usageStats.productsLimit}). قم بترقية خطتك للمزيد.`);
      return;
    }

    try {
      const productData = {
        id: Date.now(),
        name: newProduct.name.trim(),
        description: "",
        seoScore: null,
        status: "جديد",
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        keyword: "",
        meta_title: "",
        meta_description: "",
        category: "",
        target_audience: "",
        tone: "",
        best_story_arc: "",
        url_path: "",
        imageAlt: ""
      };

      console.log('💾 Saving new product to localStorage:', productData);

      const updatedProducts = [...products, productData];
      setProducts(updatedProducts);
      
      // تحديث عداد المنتجات فقط
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: prev.productsUsed + 1,
        canAddMore: prev.productsLimit === -1 || prev.productsUsed + 1 < prev.productsLimit
      }));
      
      // لا نلمس عداد التوليد الذكي هنا!
      
      localStorage.setItem("saved_products", JSON.stringify(updatedProducts));

      toast.success("تم إضافة المنتج بنجاح! 🎉");
      setShowModal(false);
      setNewProduct({ name: "" });
      
      // Navigate to SEO analysis with new product flag
      setTimeout(() => {
        navigate(`/product-seo/${productData.id}`, { 
          state: { 
            product: productData,
            isNewProduct: true
          } 
        });
      }, 1000);

    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    }
  }, [newProduct, products, usageStats, validateNewProduct, navigate]);

  const handleDeleteProduct = useCallback(async (productId) => {
    try {
      console.log('🗑️ Deleting product:', productId);
      
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      
      // تحديث عداد المنتجات فقط (وليس عداد التوليد الذكي)
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: Math.max(0, prev.productsUsed - 1),
        canAddMore: prev.productsLimit === -1 || prev.productsUsed - 1 < prev.productsLimit
      }));
      
      // 🚨 لا نلمس عداد التوليد الذكي هنا - هذا مهم!
      // setAiUsageStats ← لا نغيره عند حذف المنتج
      
      localStorage.setItem("saved_products", JSON.stringify(updatedProducts));
      
      toast.success("تم حذف المنتج بنجاح");
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    }
  }, [products]);

  const handleBulkAction = useCallback(() => {
    if (!selectedProducts.length) {
      toast.error("يرجى اختيار منتجات أولاً");
      return;
    }

    switch (bulkAction) {
      case "delete":
        if (window.confirm(`هل تريد حذف ${selectedProducts.length} منتج؟`)) {
          selectedProducts.forEach(id => handleDeleteProduct(id));
          setSelectedProducts([]);
        }
        break;
      case "analyze":
        toast.info("سيتم تحليل المنتجات المختارة...");
        break;
      default:
        toast.error("يرجى اختيار عملية");
    }
  }, [selectedProducts, bulkAction, handleDeleteProduct]);

  const openModal = useCallback(() => {
    if (!usageStats.canAddMore) {
      toast.error(`وصلت للحد الأقصى من المنتجات (${usageStats.productsLimit}). قم بترقية خطتك للمزيد.`);
      return;
    }
    
    setNewProduct({ name: "" });
    setErrors({});
    setShowModal(true);
  }, [usageStats]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6 space-y-6">
          
          {/* Error Display */}
          {errors.load && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              ❌ {errors.load}
            </div>
          )}

          {/* Beautiful Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">🛍️ إدارة المنتجات</h1>
                <p className="text-blue-100 text-lg">قم بإدارة وتحسين منتجاتك بكل سهولة</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.total}</div>
                <div className="text-blue-100">منتج إجمالي</div>
              </div>
            </div>
          </div>

          {/* Header Stats - 5 إحصائيات منفصلة */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط درجة السيو</p>
                  <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            {/* عداد المنتجات المضافة */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المنتجات المضافة</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {usageStats.productsUsed}
                    {usageStats.productsLimit !== -1 && (
                      <span className="text-lg text-gray-400">/{usageStats.productsLimit}</span>
                    )}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            {/* عداد التوليد الذكي منفصل */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">استخدام التوليد الذكي</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {userPlan === "free" ? (
                      <>
                        {aiUsageStats.used}
                        <span className="text-lg text-gray-400">/{aiUsageStats.limit}</span>
                      </>
                    ) : (
                      "∞"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">خطتك الحالية</p>
                  <p className="text-lg font-bold text-yellow-600 flex items-center gap-1">
                    {userPlan === "enterprise" && <Crown className="w-4 h-4" />}
                    {userPlan === "free" ? "مجانية" : userPlan === "pro" ? "احترافية" : "أعمال"}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث في المنتجات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title={sortOrder === "asc" ? "تصاعدي" : "تنازلي"}
                >
                  {sortOrder === "asc" ? "⬆️" : "⬇️"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 items-center">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(num => (
                    <option key={num} value={num}>{num} لكل صفحة</option>
                  ))}
                </select>
                
                <button
                  onClick={loadProducts}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-2"
                  title="تحديث"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={openModal}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm ${
                    usageStats.canAddMore
                      ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!usageStats.canAddMore}
                >
                  <Plus className="w-5 h-5" />
                  إضافة منتج
                </button>
              </div>
            </div>

            {/* Usage Warning - للعدادين المنفصلين */}
            {(
              (usageStats.productsLimit !== -1 && usageStats.productsUsed >= usageStats.productsLimit * 0.8) ||
              (userPlan === "free" && aiUsageStats.used >= aiUsageStats.limit * 0.8)
            ) && (
              <div className="mt-4 space-y-2">
                {/* تحذير المنتجات */}
                {usageStats.productsLimit !== -1 && usageStats.productsUsed >= usageStats.productsLimit * 0.8 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        اقتربت من الحد الأقصى للمنتجات ({usageStats.productsUsed}/{usageStats.productsLimit}). 
                        <Link to="/account" className="underline hover:no-underline mr-1">
                          قم بترقية خطتك
                        </Link>
                      </span>
                    </div>
                  </div>
                )}
                
                {/* تحذير التوليد الذكي */}
                {userPlan === "free" && aiUsageStats.used >= aiUsageStats.limit * 0.8 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-800">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">
                        اقتربت من الحد الأقصى للتوليد الذكي ({aiUsageStats.used}/{aiUsageStats.limit}) هذا الشهر. 
                        <Link to="/account" className="underline hover:no-underline mr-1">
                          قم بترقية خطتك
                        </Link>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">
                  تم اختيار {selectedProducts.length} منتج
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">اختر عملية</option>
                  <option value="analyze">تحليل مجمع</option>
                  <option value="delete">حذف</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  تطبيق
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>

          {/* Beautiful Products Grid */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getProductImage(product.name, product.id)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNzBIMTc1VjEyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTE1NSAxNDBIMTc1VjE2MEgxNTVWMTQwWiIgZmlsbD0iIzlDQTRBRiIvPgo8cGF0aCBkPSJNMjI1IDE0MEgyNDVWMTYwSDIyNVYxNDBaIiBmaWxsPSIjOUNBNEFGIi8+CjxwYXRoIGQ9Ik0xNzUgMTcwSDIyNVYxODBIMTc1VjE3MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+";
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        {product.status}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute top-3 left-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white border-gray-300"
                      />
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnalyze(product)}
                          className="p-2 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                          title="عرض/تحرير"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    {/* Product Name */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg" title={product.name}>
                      {product.name}
                    </h3>
                    
                    {/* Product Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2" title={product.description}>
                        {product.description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* SEO Score Progress */}
                    {product.seoScore !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">درجة السيو</span>
                          <span className="font-bold text-lg">{product.seoScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              product.seoScore >= 80 ? 'bg-emerald-500' :
                              product.seoScore >= 60 ? 'bg-blue-500' : 
                              product.seoScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${product.seoScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="text-xs text-gray-500 space-y-1 mb-4">
                      {product.category && (
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{product.category}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>آخر تحديث: {formatDate(product.lastUpdated)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAnalyze(product)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <Zap className="w-4 h-4" />
                      {product.seoScore === null ? "بدء التحليل" : "عرض التحليل"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchQuery || statusFilter !== "الكل" 
                  ? "لم يتم العثور على منتجات تطابق البحث أو التصفية المحددة"
                  : "ابدأ بإضافة منتجك الأول لتحليل السيو وتحسين ظهورك في محركات البحث"
                }
              </p>
              {(!searchQuery && statusFilter === "الكل") && (
                <button
                  onClick={openModal}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
                  disabled={!usageStats.canAddMore}
                >
                  <Plus className="w-5 h-5" />
                  إضافة منتج جديد
                </button>
              )}
            </div>
          )}

          {/* Beautiful Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
              >
                ⬅️ السابق
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-xl transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
              >
                التالي ➡️
              </button>
              
              <span className="text-sm text-gray-600 mr-4 bg-white px-3 py-2 rounded-xl border border-gray-200">
                صفحة {currentPage} من {totalPages} ({filteredProducts.length} منتج)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Add Product Modal */}
      <Transition appear show={showModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    إضافة منتج جديد
                  </Dialog.Title>
                  
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        placeholder="اسم المنتج (مثل: سماعات بلوتوث لاسلكية)"
                        value={newProduct.name}
                        onChange={(e) => handleNewProductChange(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-lg ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        autoFocus
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* شرح ما سيحدث */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        ماذا سيحدث بعد إضافة المنتج؟
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          ستنتقل لصفحة تحسين السيو
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          يمكنك اختيار التوليد التلقائي بالذكاء الاصطناعي
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          أو توليد كل حقل منفصل حسب احتياجك
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          أو الكتابة يدوياً كما تشاء
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          ومتابعة تحليل السيو المباشر
                        </li>
                      </ul>
                    </div>

                    {/* معلومات الاستخدام */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <ShoppingBag className="w-4 h-4 text-blue-500" />
                        <span>المنتجات: {usageStats.productsUsed} / {usageStats.productsLimit === -1 ? '∞' : usageStats.productsLimit}</span>
                      </div>
                      {userPlan === "free" && (
                        <div className="flex items-center gap-2 text-sm text-purple-700">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>التوليد الذكي: {aiUsageStats.used} / {aiUsageStats.limit} هذا الشهر</span>
                        </div>
                      )}
                      {userPlan === "free" && (
                        <div className="text-xs text-blue-600 bg-blue-100 px-3 py-2 rounded-lg">
                          💡 ترقية للمزيد من كليهما
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!usageStats.canAddMore || !newProduct.name.trim()}
                      className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 border border-transparent rounded-xl hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      🚀 انتقل للتحسين
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={showDeleteConfirm} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowDeleteConfirm}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-red-700 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    تأكيد الحذف
                  </Dialog.Title>
                  
                  <p className="text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">
                    هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(productToDelete)}
                      className="px-6 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 shadow-lg hover:shadow-xl"
                    >
                      نعم، احذف
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}