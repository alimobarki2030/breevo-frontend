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
  Image as ImageIcon,
  Download,
  ExternalLink,
  Store,
  Globe,
  Clock
} from "lucide-react";

// ✅ استيراد النافبار الموحد و useTheme
import UserNavbar from '../components/navbars/UserNavbar';
import { useTheme } from '../contexts/ThemeContext';

// Constants
const ITEMS_PER_PAGE_OPTIONS = [8, 12, 16, 20, 24];
const STATUS_OPTIONS = ["الكل", "ممتاز", "جيد", "متوسط", "ضعيف", "جديد"];
const SOURCE_OPTIONS = ["الكل", "محلي", "سلة"];
const SORT_OPTIONS = [
  { value: "lastUpdated", label: "آخر تحديث" },
  { value: "seoScore", label: "درجة السيو" },
  { value: "name", label: "الاسم" },
  { value: "created", label: "تاريخ الإنشاء" },
  { value: "source", label: "المصدر" }
];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Utility functions
const getStatusColor = (status, isDark) => {
  const colors = {
    "ممتاز": isDark 
      ? "bg-emerald-900/20 text-emerald-300 border-emerald-600/30" 
      : "bg-emerald-100 text-emerald-800 border-emerald-200",
    "جيد": isDark 
      ? "bg-blue-900/20 text-blue-300 border-blue-600/30" 
      : "bg-blue-100 text-blue-800 border-blue-200", 
    "متوسط": isDark 
      ? "bg-amber-900/20 text-amber-300 border-amber-600/30" 
      : "bg-amber-100 text-amber-800 border-amber-200",
    "ضعيف": isDark 
      ? "bg-red-900/20 text-red-300 border-red-600/30" 
      : "bg-red-100 text-red-800 border-red-200",
    "جديد": isDark 
      ? "bg-purple-900/20 text-purple-300 border-purple-600/30" 
      : "bg-purple-100 text-purple-800 border-purple-200"
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

// دالة لعرض صورة المنتج أو placeholder
// دالة لعرض صورة المنتج أو placeholder
const getProductImage = (product) => {
  // إذا كان من سلة وله صور
  if (product.source === "سلة" && product.images && product.images.length > 0) {
    // أخذ أول صورة من مصفوفة الصور
    const firstImage = product.images[0];
    // إذا كانت الصورة عبارة عن string مباشر
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    // إذا كانت الصورة عبارة عن object مع URL
    if (firstImage && firstImage.url) {
      return firstImage.url;
    }
  }
  
  // إذا كان محلي وله صورة مرفوعة
  if (product.source === "محلي" && product.image) {
    return product.image;
  }
  
  // صورة افتراضية بسيطة - استخدام encodeURIComponent بدلاً من btoa
  const svgContent = `
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F3F4F6"/>
      <rect x="150" y="100" width="100" height="100" rx="8" fill="#D1D5DB"/>
      <circle cx="170" cy="130" r="15" fill="#9CA3AF"/>
      <path d="M130 200 L170 160 L200 180 L270 120 L270 200 H130Z" fill="#9CA3AF"/>
      <text x="200" y="250" text-anchor="middle" fill="#6B7280" font-family="Arial" font-size="14">Product</text>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

export default function ProductsList() {
  // ✅ استخدام useTheme
  const { theme, isDark } = useTheme();

  // State management
  const [products, setProducts] = useState([]);
  const [sallahStores, setSallahStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingFromSallah, setSyncingFromSallah] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [sourceFilter, setSourceFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lastUpdated");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [sallahConnected, setSallahConnected] = useState(false);

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
      setAiUsageStats(newUsage);
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

    // فحص اتصال سلة
    checkSallahConnection();
  }, []);

  // فحص اتصال سلة عبر جلب المتاجر المربوطة
  const checkSallahConnection = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/salla/stores`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const stores = await response.json();
        setSallahStores(stores);
        setSallahConnected(stores.length > 0);
        
        // تحديد آخر وقت تزامن من أي متجر
        if (stores.length > 0) {
          const lastSyncs = stores.map(store => store.last_sync).filter(Boolean);
          if (lastSyncs.length > 0) {
            const latestSync = new Date(Math.max(...lastSyncs.map(d => new Date(d))));
            setLastSyncTime(latestSync);
          }
        }
      }
    } catch (error) {
      console.log('Sallah connection check failed:', error);
      setSallahConnected(false);
    }
  }, []);

  // جلب المنتجات من سلة (جميع المتاجر)
  const fetchSallahProducts = useCallback(async () => {
    console.log('🔄 Fetching products from Sallah stores...');
    setSyncingFromSallah(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("لا يوجد رمز تسجيل دخول");
      }

      if (sallahStores.length === 0) {
        throw new Error("لا توجد متاجر سلة مربوطة");
      }

      let allSallahProducts = [];

      // جلب المنتجات من كل متجر
      for (const store of sallahStores) {
        try {
          console.log(`🏪 Syncing store: ${store.name}`);
          
          // بدء مزامنة المتجر
          const syncResponse = await fetch(`${API_BASE_URL}/api/salla/stores/${store.id}/sync`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!syncResponse.ok) {
            console.error(`❌ Failed to sync store ${store.name}`);
            continue;
          }

          // انتظار قليل لإنهاء المزامنة
          await new Promise(resolve => setTimeout(resolve, 2000));

          // جلب المنتجات من المتجر
          const productsResponse = await fetch(`${API_BASE_URL}/api/salla/stores/${store.id}/products`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!productsResponse.ok) {
            console.error(`❌ Failed to fetch products from store ${store.name}`);
            continue;
          }

          const result = await productsResponse.json();
          console.log(`✅ Store ${store.name} products:`, result);
          
          if (result.products && result.products.length > 0) {
            // تحويل منتجات سلة للصيغة المطلوبة
            const formattedProducts = result.products.map(product => ({
              id: `sallah_${product.id}`,
              sallahId: product.salla_product_id,
              name: product.name,
              description: product.description || "",
              seoScore: null, // سيتم حسابها لاحقاً
              status: "جديد",
              lastUpdated: product.last_synced || new Date().toISOString(),
              createdAt: product.created_at || new Date().toISOString(),
              price: product.price ? `${product.price.amount} ${product.price.currency}` : null,
              priceAmount: product.price?.amount || 0,
              priceCurrency: product.price?.currency || "SAR",
              images: product.images || [],
              source: "سلة",
              category: product.category || "",
              sku: product.sku || "",
              seoTitle: product.seo_title || "",
              seoDescription: product.seo_description || "",
              productStatus: product.status || "sale",
              storeId: store.id,
              storeName: store.name,
              targetKeyword: "",
              meta_title: product.seo_title || "",
              meta_description: product.seo_description || "",
              url_path: ""
            }));

            allSallahProducts.push(...formattedProducts);
          }
        } catch (storeError) {
          console.error(`❌ Error processing store ${store.name}:`, storeError);
        }
      }

      console.log(`✅ Total Sallah products fetched: ${allSallahProducts.length}`);

      // دمج مع المنتجات المحلية
      const localProducts = JSON.parse(localStorage.getItem("saved_products") || "[]");
      const allProducts = [...localProducts, ...allSallahProducts];
      
      setProducts(allProducts);
      
      // حفظ منتجات سلة منفصلة
      localStorage.setItem("sallah_products", JSON.stringify(allSallahProducts));
      localStorage.setItem("sallah_last_sync", new Date().toISOString());
      setLastSyncTime(new Date());
      
      toast.success(`تم تزامن ${allSallahProducts.length} منتج من سلة! 🎉`);
      return allSallahProducts;
      
    } catch (error) {
      console.error("Error fetching Sallah products:", error);
      setErrors(prev => ({ ...prev, sallah: error.message }));
      toast.error(error.message);
      return [];
    } finally {
      setSyncingFromSallah(false);
    }
  }, [sallahStores]);

  // Load products from localStorage and Sallah
  useEffect(() => {
    loadProducts();
  }, [sallahConnected]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading products...');
      
      // تحميل المنتجات المحلية
      const localProducts = JSON.parse(localStorage.getItem("saved_products") || "[]");
      
      // تحميل منتجات سلة المحفوظة
      const sallahProducts = JSON.parse(localStorage.getItem("sallah_products") || "[]");
      
      // دمج المنتجات
      const allProducts = [...localProducts, ...sallahProducts];
      
      console.log(`✅ Loaded ${localProducts.length} local + ${sallahProducts.length} Sallah products`);
      setProducts(allProducts);
      
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: localProducts.length, // فقط المنتجات المحلية تحسب في الاستخدام
        canAddMore: prev.productsLimit === -1 || localProducts.length < prev.productsLimit
      }));
      
      // إذا لم توجد منتجات سلة وكان متصل، جرب التزامن
      if (sallahProducts.length === 0 && sallahConnected && sallahStores.length > 0) {
        console.log('🔄 No Sallah products found, attempting sync...');
        await fetchSallahProducts();
      }
      
    } catch (error) {
      console.error("Error loading products:", error);
      setErrors(prev => ({ ...prev, load: "فشل في تحميل المنتجات" }));
      toast.error("فشل في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, [sallahConnected, sallahStores, fetchSallahProducts]);

  // دالة التزامن اليدوي مع سلة
  const handleSyncWithSallah = useCallback(async () => {
    if (!sallahConnected || sallahStores.length === 0) {
      toast.error("لم يتم ربط حساب سلة بعد");
      return;
    }
    
    await fetchSallahProducts();
  }, [sallahConnected, sallahStores, fetchSallahProducts]);

  // Filtered products with new source filter
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesStatus = statusFilter === "الكل" || product.status === statusFilter;
      const matchesSource = sourceFilter === "الكل" || product.source === sourceFilter;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSource && matchesSearch;
    });

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
  }, [products, statusFilter, sourceFilter, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const localProducts = filteredProducts.filter(p => p.source === "محلي").length;
    const sallahProducts = filteredProducts.filter(p => p.source === "سلة").length;
    const averageScore = totalProducts > 0 
      ? Math.round(filteredProducts.reduce((sum, p) => sum + (p.seoScore || 0), 0) / totalProducts)
      : 0;
    
    const statusCounts = STATUS_OPTIONS.slice(1).reduce((acc, status) => {
      acc[status] = filteredProducts.filter(p => p.status === status).length;
      return acc;
    }, {});

    return {
      total: totalProducts,
      local: localProducts,
      sallah: sallahProducts,
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
        id: `local_${Date.now()}`,
        name: newProduct.name.trim(),
        description: "",
        seoScore: null,
        status: "جديد",
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        source: "محلي",
        keyword: "",
        meta_title: "",
        meta_description: "",
        category: "",
        target_audience: "",
        tone: "",
        best_story_arc: "",
        url_path: "",
        imageAlt: "",
        price: null,
        priceAmount: 0,
        priceCurrency: "SAR",
        images: null
      };

      // إضافة للمنتجات المحلية فقط
      const localProducts = JSON.parse(localStorage.getItem("saved_products") || "[]");
      const updatedLocalProducts = [...localProducts, productData];
      localStorage.setItem("saved_products", JSON.stringify(updatedLocalProducts));

      // تحديث قائمة المنتجات الكاملة
      setProducts(prev => [...prev, productData]);
      
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: prev.productsUsed + 1,
        canAddMore: prev.productsLimit === -1 || prev.productsUsed + 1 < prev.productsLimit
      }));

      toast.success("تم إضافة المنتج بنجاح! 🎉");
      setShowModal(false);
      setNewProduct({ name: "" });
      
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
  }, [newProduct, usageStats, validateNewProduct, navigate]);

  const handleDeleteProduct = useCallback(async (productId) => {
    try {
      const productToDelete = products.find(p => p.id === productId);
      
      if (productToDelete?.source === "سلة") {
        toast.error("لا يمكن حذف منتجات سلة من هنا. احذفها من متجر سلة.");
        return;
      }

      // حذف من المنتجات المحلية
      const localProducts = JSON.parse(localStorage.getItem("saved_products") || "[]");
      const updatedLocalProducts = localProducts.filter(p => p.id !== productId);
      localStorage.setItem("saved_products", JSON.stringify(updatedLocalProducts));

      // تحديث القائمة
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      
      setUsageStats(prev => ({ 
        ...prev, 
        productsUsed: Math.max(0, prev.productsUsed - 1),
        canAddMore: prev.productsLimit === -1 || prev.productsUsed - 1 < prev.productsLimit
      }));
      
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
        const sallahSelected = selectedProducts.some(id => 
          products.find(p => p.id === id)?.source === "سلة"
        );
        
        if (sallahSelected) {
          toast.error("لا يمكن حذف منتجات سلة. اختر المنتجات المحلية فقط.");
          return;
        }
        
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
  }, [selectedProducts, bulkAction, handleDeleteProduct, products]);

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
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <UserNavbar />
        <div className="text-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* ✅ استخدام النافبار الموحد */}
      <UserNavbar />
      
      {/* ✅ المحتوى الرئيسي */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Error Display */}
          {errors.load && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 transition-colors duration-300">
              ❌ {errors.load}
            </div>
          )}

          {errors.sallah && (
            <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600/30 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg mb-4 transition-colors duration-300">
              ⚠️ {errors.sallah}
            </div>
          )}

          {/* Beautiful Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  🛍️ إدارة المنتجات
                  {sallahConnected && <Store className="w-8 h-8 text-green-300" />}
                </h1>
                <p className="text-blue-100 text-lg">
                  {sallahConnected 
                    ? `مدمج مع ${sallahStores.length} متجر سلة - إدارة شاملة لجميع منتجاتك` 
                    : "قم بإدارة وتحسين منتجاتك بكل سهولة"
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.total}</div>
                <div className="text-blue-100">منتج إجمالي</div>
                {sallahConnected && (
                  <div className="text-sm text-blue-200 mt-1">
                    {stats.local} محلي • {stats.sallah} من سلة
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Header Stats - محدث للثيم مع إحصائيات سلة */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    إجمالي المنتجات
                  </p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.total}
                  </p>
                  {sallahConnected && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {stats.local} محلي • {stats.sallah} سلة
                    </p>
                  )}
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    متوسط درجة السيو
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.averageScore}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            {/* عداد المنتجات المحلية */}
            <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    المنتجات المحلية
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.local}
                    {usageStats.productsLimit !== -1 && (
                      <span className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        /{usageStats.productsLimit}
                      </span>
                    )}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            {/* عداد التوليد الذكي */}
            <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    استخدام التوليد الذكي
                  </p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {userPlan === "free" ? (
                      <>
                        {aiUsageStats.used}
                        <span className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          /{aiUsageStats.limit}
                        </span>
                      </>
                    ) : (
                      "∞"
                    )}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            
            <div className={`rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    خطتك الحالية
                  </p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    {userPlan === "enterprise" && <Crown className="w-4 h-4" />}
                    {userPlan === "free" ? "مجانية" : userPlan === "pro" ? "احترافية" : "أعمال"}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Sallah Integration Status */}
          {sallahConnected && (
            <div className={`rounded-xl p-4 border transition-colors duration-300 ${
              isDark 
                ? 'bg-green-900/20 border-green-600/30' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Store className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                      متصل مع {sallahStores.length} متجر سلة ✅
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {lastSyncTime ? (
                        <>آخر تزامن: {formatDate(lastSyncTime)}</>
                      ) : (
                        "جاهز للتزامن"
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSyncWithSallah}
                  disabled={syncingFromSallah}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                >
                  {syncingFromSallah ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري التزامن...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      تزامن الآن
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Toolbar - محدث للثيم مع فلتر المصدر */}
          <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="ابحث في المنتجات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-4 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-colors duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {/* فلتر المصدر */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {SOURCE_OPTIONS.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className={`px-4 py-3 rounded-xl transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
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
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
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

                {sallahConnected && (
                  <button
                    onClick={handleSyncWithSallah}
                    disabled={syncingFromSallah}
                    className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-xl transition-colors flex items-center gap-2"
                    title="تزامن مع سلة"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncingFromSallah ? 'animate-spin' : ''}`} />
                  </button>
                )}
                
                <button
                  onClick={openModal}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm ${
                    usageStats.canAddMore
                      ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!usageStats.canAddMore}
                >
                  <Plus className="w-5 h-5" />
                  إضافة منتج محلي
                </button>
              </div>
            </div>

            {/* Usage Warning - محدث للثيم */}
            {(
              (usageStats.productsLimit !== -1 && stats.local >= usageStats.productsLimit * 0.8) ||
              (userPlan === "free" && aiUsageStats.used >= aiUsageStats.limit * 0.8)
            ) && (
              <div className="mt-4 space-y-2">
                {/* تحذير المنتجات */}
                {usageStats.productsLimit !== -1 && stats.local >= usageStats.productsLimit * 0.8 && (
                  <div className={`border rounded-lg p-3 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-yellow-900/20 border-yellow-600/30 text-yellow-300' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        اقتربت من الحد الأقصى للمنتجات المحلية ({stats.local}/{usageStats.productsLimit}). 
                        <Link to="/account" className="underline hover:no-underline mr-1">
                          قم بترقية خطتك
                        </Link>
                      </span>
                    </div>
                  </div>
                )}
                
                {/* تحذير التوليد الذكي */}
                {userPlan === "free" && aiUsageStats.used >= aiUsageStats.limit * 0.8 && (
                  <div className={`border rounded-lg p-3 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-purple-900/20 border-purple-600/30 text-purple-300' 
                      : 'bg-purple-50 border-purple-200 text-purple-800'
                  }`}>
                    <div className="flex items-center gap-2">
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

            {/* Bulk Actions - محدث للثيم */}
            {selectedProducts.length > 0 && (
              <div className={`mt-4 flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${
                isDark 
                  ? 'bg-blue-900/20 border border-blue-600/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  تم اختيار {selectedProducts.length} منتج
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className={`px-3 py-1 border rounded text-sm transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">اختر عملية</option>
                  <option value="analyze">تحليل مجمع</option>
                  <option value="delete">حذف (المحلية فقط)</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  تطبيق
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className={`px-4 py-1 rounded text-sm transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>

          {/* Products Grid - محدث للثيم */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className={`group rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
                }`}>
                  
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = getProductImage({...product, images: null});
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(product.status, isDark)}`}>
                        {getStatusIcon(product.status)}
                        {product.status}
                      </span>
                    </div>

                    {/* Source Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        product.source === "سلة" 
                          ? (isDark ? "bg-green-900/80 text-green-300 border border-green-600/50" : "bg-green-100 text-green-800 border border-green-300")
                          : (isDark ? "bg-blue-900/80 text-blue-300 border border-blue-600/50" : "bg-blue-100 text-blue-800 border border-blue-300")
                      }`}>
                        {product.source === "سلة" ? <Store className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {product.source}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute bottom-3 left-3">
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
                        {product.source === "محلي" && (
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
                        )}
                        {product.source === "سلة" && product.sallahId && (
                          <button
                            onClick={() => window.open(`https://salla.dev/products/${product.sallahId}`, '_blank')}
                            className="p-2 bg-white text-green-600 rounded-full shadow-lg hover:bg-green-50 transition-colors"
                            title="فتح في سلة"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    {/* Product Name */}
                    <h3 className={`font-bold mb-2 line-clamp-2 text-lg ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`} title={product.name}>
                      {product.name}
                    </h3>
                    
                    {/* Product Description */}
                    {product.description && (
                      <p className={`text-sm mb-4 line-clamp-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`} title={product.description}>
                        {product.description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* Price for Sallah products */}
                    {product.source === "سلة" && product.priceAmount && (
                      <div className="mb-3">
                        <span className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          {product.priceAmount} {product.priceCurrency}
                        </span>
                      </div>
                    )}

                    {/* SEO Score Progress */}
                    {product.seoScore !== null && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            درجة السيو
                          </span>
                          <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {product.seoScore}%
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
                    <div className={`text-xs space-y-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {product.category && (
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{product.category}</span>
                        </div>
                      )}
                      {product.source === "سلة" && product.sku && (
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>كود: {product.sku}</span>
                        </div>
                      )}
                      {product.source === "سلة" && product.storeName && (
                        <div className="flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          <span>{product.storeName}</span>
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
            <div className={`rounded-2xl shadow-sm border p-12 text-center transition-colors duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <ShoppingBag className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                لا توجد منتجات
              </h3>
              <p className={`mb-8 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchQuery || statusFilter !== "الكل" || sourceFilter !== "الكل"
                  ? "لم يتم العثور على منتجات تطابق البحث أو التصفية المحددة"
                  : sallahConnected 
                    ? "قم بإضافة منتجات محلية أو تزامن مع متاجر سلة"
                    : "ابدأ بإضافة منتجك الأول لتحليل السيو وتحسين ظهورك في محركات البحث"
                }
              </p>
              {(!searchQuery && statusFilter === "الكل" && sourceFilter === "الكل") && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={openModal}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
                    disabled={!usageStats.canAddMore}
                  >
                    <Plus className="w-5 h-5" />
                    إضافة منتج محلي
                  </button>
                  {sallahConnected && (
                    <button
                      onClick={handleSyncWithSallah}
                      disabled={syncingFromSallah}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-medium transition-all flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      <RefreshCw className={`w-5 h-5 ${syncingFromSallah ? 'animate-spin' : ''}`} />
                      تزامن مع سلة
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pagination - محدث للثيم */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`px-4 py-2 border rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
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
                          : isDark 
                            ? 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                            : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`px-4 py-2 border rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
                disabled={currentPage === totalPages}
              >
                التالي ➡️
              </button>
              
              <span className={`text-sm mr-4 px-3 py-2 rounded-xl border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-200 text-gray-600'
              }`}>
                صفحة {currentPage} من {totalPages} ({filteredProducts.length} منتج)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal - محدث للثيم */}
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
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-right align-middle shadow-xl transition-all ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                  <Dialog.Title as="h3" className={`text-xl font-bold leading-6 mb-6 flex items-center gap-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    إضافة منتج محلي جديد
                  </Dialog.Title>
                  
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        placeholder="اسم المنتج (مثل: سماعات بلوتوث لاسلكية)"
                        value={newProduct.name}
                        onChange={(e) => handleNewProductChange(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-lg transition-colors duration-300 ${
                          errors.name 
                            ? (isDark ? 'border-red-500 bg-gray-700 text-white' : 'border-red-300 bg-white text-gray-900')
                            : (isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500')
                        }`}
                        autoFocus
                      />
                      {errors.name && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* شرح الفرق بين المحلي وسلة */}
                    <div className={`rounded-xl p-5 border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-blue-900/20 border-blue-600/30' 
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                    }`}>
                      <h4 className={`font-bold mb-3 flex items-center gap-2 ${
                        isDark ? 'text-blue-300' : 'text-blue-900'
                      }`}>
                        <Globe className="w-5 h-5" />
                        المنتجات المحلية مقابل منتجات سلة
                      </h4>
                      <div className={`text-sm space-y-2 ${
                        isDark ? 'text-blue-200' : 'text-blue-800'
                      }`}>
                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 mt-0.5 text-blue-500" />
                          <span><strong>المحلية:</strong> تضيفها يدوياً، كامل التحكم، تحسب في حد الاستخدام</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Store className="w-4 h-4 mt-0.5 text-green-500" />
                          <span><strong>سلة:</strong> تأتي من متجرك تلقائياً، بيانات حقيقية، لا تحسب في الحد</span>
                        </div>
                      </div>
                    </div>

                    {/* معلومات الاستخدام - محدث للثيم */}
                    <div className={`rounded-xl p-4 space-y-3 transition-colors duration-300 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <ShoppingBag className="w-4 h-4 text-blue-500" />
                        <span>المنتجات المحلية: {stats.local} / {usageStats.productsLimit === -1 ? '∞' : usageStats.productsLimit}</span>
                      </div>
                      {sallahConnected && (
                        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                          <Store className="w-4 h-4 text-green-500" />
                          <span>منتجات سلة: {stats.sallah} (لا محدودة)</span>
                        </div>
                      )}
                      {userPlan === "free" && (
                        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>التوليد الذكي: {aiUsageStats.used} / {aiUsageStats.limit} هذا الشهر</span>
                        </div>
                      )}
                      {userPlan === "free" && (
                        <div className={`text-xs px-3 py-2 rounded-lg transition-colors duration-300 ${
                          isDark 
                            ? 'text-blue-300 bg-blue-900/30' 
                            : 'text-blue-600 bg-blue-100'
                        }`}>
                          💡 ترقية للمزيد من المنتجات المحلية والتوليد الذكي
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className={`px-6 py-3 text-sm font-medium border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300 ${
                        isDark 
                          ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200'
                      }`}
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

      {/* Delete Confirmation Modal - محدث للثيم */}
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
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-right align-middle shadow-xl transition-all ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    تأكيد الحذف
                  </Dialog.Title>
                  
                  <p className={`mb-6 p-4 rounded-xl transition-colors duration-300 ${
                    isDark 
                      ? 'text-gray-300 bg-gray-700' 
                      : 'text-gray-600 bg-gray-50'
                  }`}>
                    هل أنت متأكد من حذف هذا المنتج المحلي؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className={`px-6 py-3 text-sm font-medium border rounded-xl transition-colors duration-300 ${
                        isDark 
                          ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200'
                      }`}
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
    </div>
  );
}