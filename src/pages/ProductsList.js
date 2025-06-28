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
  Sparkles
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

// Utility functions
const getStatusColor = (status) => {
  const colors = {
    "ممتاز": "bg-green-100 text-green-800 border-green-200",
    "جيد": "bg-blue-100 text-blue-800 border-blue-200", 
    "متوسط": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "ضعيف": "bg-red-100 text-red-800 border-red-200",
    "جديد": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colors[status] || colors["جديد"];
};

const getStatusIcon = (status) => {
  const icons = {
    "ممتاز": <CheckCircle className="w-4 h-4" />,
    "جيد": <TrendingUp className="w-4 h-4" />,
    "متوسط": <AlertCircle className="w-4 h-4" />,
    "ضعيف": <XCircle className="w-4 h-4" />,
    "جديد": <Package className="w-4 h-4" />
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

  // User subscription info
  const [userPlan, setUserPlan] = useState("free");
  const [usageStats, setUsageStats] = useState({
    productsUsed: 0,
    productsLimit: 3,
    canAddMore: true
  });

  const navigate = useNavigate();

  // Load user plan and usage
  useEffect(() => {
    const user = safeLocalStorageGet("user", {});
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    
    const plan = subscription.plan || user.plan || "free";
    setUserPlan(plan);
    
    // Set limits based on plan
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
  }, []);

  // ✅ FIXED: Load products from localStorage only (until backend is ready)
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
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: prev.productsUsed + 1,
        canAddMore: prev.productsLimit === -1 || prev.productsUsed + 1 < prev.productsLimit
      }));
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
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: Math.max(0, prev.productsUsed - 1),
        canAddMore: prev.productsLimit === -1 || prev.productsUsed - 1 < prev.productsLimit
      }));
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
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

          {/* API Status Notice */}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
            ℹ️ <strong>وضع التطوير:</strong> يتم حفظ البيانات محلياً. سيتم ربط قاعدة البيانات قريباً.
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط درجة السيو</p>
                  <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الاستخدام الشهري</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {usageStats.productsUsed}
                    {usageStats.productsLimit !== -1 && (
                      <span className="text-lg text-gray-400">/{usageStats.productsLimit}</span>
                    )}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">خطتك الحالية</p>
                  <p className="text-lg font-bold text-yellow-600 flex items-center gap-1">
                    {userPlan === "enterprise" && <Crown className="w-4 h-4" />}
                    {userPlan === "free" ? "مجانية" : userPlan === "pro" ? "احترافية" : "أعمال"}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same... */}
          {/* Toolbar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
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
                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(num => (
                    <option key={num} value={num}>{num} لكل صفحة</option>
                  ))}
                </select>
                
                <button
                  onClick={loadProducts}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  title="تحديث"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={openModal}
                  className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    usageStats.canAddMore
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!usageStats.canAddMore}
                >
                  <Plus className="w-4 h-4" />
                  إضافة منتج
                </button>
              </div>
            </div>

            {/* Usage Warning */}
            {usageStats.productsLimit !== -1 && usageStats.productsUsed >= usageStats.productsLimit * 0.8 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
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

          {/* Products Grid */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
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
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          {product.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAnalyze(product)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="عرض/تحرير"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2" title={product.name}>
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={product.description}>
                        {product.description}
                      </p>
                    )}

                    {/* SEO Score */}
                    {product.seoScore !== null && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">درجة السيو</span>
                          <span className="font-bold">{product.seoScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              product.seoScore >= 80 ? 'bg-green-500' :
                              product.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${product.seoScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="text-xs text-gray-500 space-y-1">
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
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {product.seoScore === null ? "بدء التحليل" : "عرض التحليل"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== "الكل" 
                  ? "لم يتم العثور على منتجات تطابق البحث أو التصفية المحددة"
                  : "ابدأ بإضافة منتجك الأول لتحليل السيو"
                }
              </p>
              {(!searchQuery && statusFilter === "الكل") && (
                <button
                  onClick={openModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  disabled={!usageStats.canAddMore}
                >
                  <Plus className="w-5 h-5" />
                  إضافة منتج جديد
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-green-600 text-white'
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
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
              >
                التالي ➡️
              </button>
              
              <span className="text-sm text-gray-600 mr-4">
                صفحة {currentPage} من {totalPages} ({filteredProducts.length} منتج)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-500" />
                    ➕ إضافة منتج جديد
                  </Dialog.Title>
                  
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="اسم المنتج (مثل: سماعات بلوتوث لاسلكية)"
                        value={newProduct.name}
                        onChange={(e) => handleNewProductChange(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        autoFocus
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* شرح ما سيحدث */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        🎯 ماذا سيحدث بعد إضافة المنتج؟
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>📝 ستنتقل لصفحة تحسين السيو</li>
                        <li>🤖 يمكنك اختيار التوليد التلقائي بالذكاء الاصطناعي</li>
                        <li>⚙️ أو توليد كل حقل منفصل حسب احتياجك</li>
                        <li>✏️ أو الكتابة يدوياً كما تشاء</li>
                        <li>📊 ومتابعة تحليل السيو المباشر</li>
                      </ul>
                    </div>

                    {/* معلومات الاستخدام */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        📊 الاستخدام: {usageStats.productsUsed} / {usageStats.productsLimit === -1 ? '∞' : usageStats.productsLimit}
                        {userPlan === "free" && (
                          <span className="text-xs text-blue-600">
                            (💡 ترقية للمزيد)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!usageStats.canAddMore || !newProduct.name.trim()}
                      className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-red-700 mb-4">
                    🗑️ تأكيد الحذف
                  </Dialog.Title>
                  
                  <p className="text-gray-600 mb-6">
                    هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(productToDelete)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
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