import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Video, 
  Image, 
  Save, 
  Trash2, 
  Edit, 
  Eye, 
  Plus,
  X,
  Check,
  AlertCircle,
  Clock,
  Play,
  Download,
  Copy,
  Settings,
  Users,
  BarChart3,
  Filter,
  Search,
  async,
  ChevronDown,
  Star,
  Lock,
  Globe
} from 'lucide-react';

// ✅ استخدام lazy loading لتجنب circular dependencies
const UnifiedNavbar = lazy(() => import('../components/UnifiedNavbar'));
const Sidebar = lazy(() => import('../components/Sidebar'));

const AdminVideoUpload = () => {
  // State management
  const [videos, setVideos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [selectedVideos, setSelectedVideos] = useState([]);
  
  // Form state for new/edit video
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    category: 'البداية',
    level: 'مبتدئ',
    instructor: '',
    duration: '',
    requiredPlan: 'free',
    tags: [],
    featured: false,
    status: 'draft' // draft, published, processing
  });

  // File inputs
  const videoFileRef = useRef(null);
  const thumbnailFileRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Admin access control
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin access
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.role === "admin" ||
                   user.id === "1";
    
    setIsAdmin(isOwner);
    
    if (isOwner) {
      loadVideos();
    }
  }, []);

  // Categories and options
  const categories = [
    { id: 'البداية', name: 'البداية والأساسيات', icon: '🚀' },
    { id: 'السيو-الأساسي', name: 'السيو الأساسي', icon: '📊' },
    { id: 'المنتجات', name: 'تحسين المنتجات', icon: '📦' },
    { id: 'الكلمات-المفتاحية', name: 'بحث الكلمات المفتاحية', icon: '🔍' },
    { id: 'المنافسين', name: 'تحليل المنافسين', icon: '⚔️' },
    { id: 'متقدم', name: 'استراتيجيات متقدمة', icon: '🎯' },
    { id: 'تقارير', name: 'التقارير والتحليل', icon: '📈' }
  ];

  const levels = ['مبتدئ', 'متوسط', 'متقدم'];
  const plans = [
    { id: 'free', name: 'مجاني', color: 'bg-gray-100 text-gray-800' },
    { id: 'professional', name: 'احترافي', color: 'bg-blue-100 text-blue-800' },
    { id: 'business', name: 'أعمال', color: 'bg-purple-100 text-purple-800' },
    { id: 'enterprise', name: 'مؤسسي', color: 'bg-green-100 text-green-800' }
  ];

  const statusOptions = ['الكل', 'draft', 'published', 'processing'];

  // Load videos from storage
  const loadVideos = useCallback(() => {
    const savedVideos = JSON.parse(localStorage.getItem("admin_videos") || "[]");
    setVideos(savedVideos);
  }, []);

  // Save videos to storage
  const saveVideos = useCallback((newVideos) => {
    localStorage.setItem("admin_videos", JSON.stringify(newVideos));
    setVideos(newVideos);
  }, []);

  // Handle file selections
  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Auto-extract duration (simplified)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setVideoForm(prev => ({
          ...prev,
          duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
        }));
      };
      video.src = url;
    }
  };

  const handleThumbnailFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoId = editingVideo?.id || Date.now();
      
      // Validate required files for new videos
      if (!editingVideo && (!videoFile || !thumbnailFile)) {
        alert('يرجى اختيار ملف الفيديو والصورة المصغرة');
        setLoading(false);
        return;
      }

      // Validate form data
      if (!videoForm.title.trim() || !videoForm.instructor.trim()) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        setLoading(false);
        return;
      }

      setUploadProgress({ [videoId]: 0 });

      // Actually process the files
      let videoUrl = editingVideo?.videoUrl;
      let thumbnailUrl = editingVideo?.thumbnail;

      // Process video file
      if (videoFile) {
        setUploadProgress({ [videoId]: 20 });
        videoUrl = await processVideoFile(videoFile, videoId);
        setUploadProgress({ [videoId]: 60 });
      }

      // Process thumbnail file
      if (thumbnailFile) {
        setUploadProgress({ [videoId]: 80 });
        thumbnailUrl = await processThumbnailFile(thumbnailFile, videoId);
        setUploadProgress({ [videoId]: 90 });
      }

      // Create video object with real data
      const newVideo = {
        id: videoId,
        title: videoForm.title.trim(),
        description: videoForm.description.trim(),
        category: videoForm.category,
        level: videoForm.level,
        instructor: videoForm.instructor.trim(),
        duration: videoForm.duration || '0:00',
        requiredPlan: videoForm.requiredPlan,
        tags: videoForm.tags,
        featured: videoForm.featured,
        status: videoForm.status,
        videoUrl: videoUrl,
        thumbnail: thumbnailUrl,
        views: editingVideo?.views || 0,
        rating: editingVideo?.rating || 4.5,
        createdAt: editingVideo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileSize: videoFile?.size || editingVideo?.fileSize || 0,
        originalFileName: videoFile?.name || editingVideo?.originalFileName || ''
      };

      setUploadProgress({ [videoId]: 95 });

      // Save to localStorage
      if (editingVideo) {
        const updatedVideos = videos.map(v => v.id === videoId ? newVideo : v);
        saveVideos(updatedVideos);
      } else {
        saveVideos([...videos, newVideo]);
      }

      setUploadProgress({ [videoId]: 100 });

      // Success message
      alert(editingVideo ? 'تم تحديث الفيديو بنجاح!' : 'تم رفع الفيديو بنجاح!');

      // Reset form
      resetForm();
      setShowUploadModal(false);
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('حدث خطأ أثناء الرفع: ' + error.message);
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  // Process video file using IndexedDB for larger storage
  const processVideoFile = (file, videoId) => {
    return new Promise((resolve, reject) => {
      // Check file size first
      const maxSize = 100 * 1024 * 1024; // 100MB limit
      if (file.size > maxSize) {
        reject(new Error(`حجم الملف كبير جداً (${Math.round(file.size / 1024 / 1024)}MB). الحد الأقصى 100MB`));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          
          // Store using IndexedDB for better large file support
          await storeVideoInIndexedDB(videoId, {
            data: arrayBuffer,
            type: file.type,
            size: file.size,
            name: file.name,
            lastModified: file.lastModified
          });
          
          resolve(`indexed_video_${videoId}`);
        } catch (error) {
          console.error('Error storing video:', error);
          // Fallback to simpler storage for small files
          try {
            if (file.size < 5 * 1024 * 1024) { // 5MB fallback
              const reader2 = new FileReader();
              reader2.onload = (e2) => {
                try {
                  const videoFiles = JSON.parse(localStorage.getItem("video_files") || "{}");
                  videoFiles[videoId] = {
                    data: e2.target.result,
                    type: file.type,
                    size: file.size,
                    name: file.name
                  };
                  localStorage.setItem("video_files", JSON.stringify(videoFiles));
                  resolve(`local_video_${videoId}`);
                } catch (err) {
                  reject(new Error('فشل في حفظ الفيديو - الملف كبير جداً'));
                }
              };
              reader2.readAsDataURL(file);
            } else {
              reject(new Error('فشل في حفظ الفيديو - استخدم ملف أصغر أو قم بتفعيل التخزين السحابي'));
            }
          } catch (fallbackError) {
            reject(new Error('فشل في معالجة ملف الفيديو'));
          }
        }
      };
      
      reader.onerror = () => reject(new Error('فشل في قراءة ملف الفيديو'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Process thumbnail file (smaller, so localStorage is fine)
  const processThumbnailFile = (file, videoId) => {
    return new Promise((resolve, reject) => {
      // Check thumbnail size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for thumbnails
        reject(new Error('الصورة المصغرة كبيرة جداً (الحد الأقصى 5MB)'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const base64Data = e.target.result;
          
          const thumbnails = JSON.parse(localStorage.getItem("video_thumbnails") || "{}");
          thumbnails[videoId] = {
            id: videoId,
            data: base64Data,
            type: file.type,
            size: file.size,
            name: file.name
          };
          localStorage.setItem("video_thumbnails", JSON.stringify(thumbnails));
          
          resolve(`local_thumbnail_${videoId}`);
        } catch (error) {
          reject(new Error('فشل في معالجة الصورة المصغرة - حجمها كبير جداً'));
        }
      };
      
      reader.onerror = () => reject(new Error('فشل في قراءة الصورة المصغرة'));
      reader.readAsDataURL(file);
    });
  };

  // IndexedDB storage for large video files
  const storeVideoInIndexedDB = (videoId, videoData) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('VideoStorage', 1);
      
      request.onerror = () => reject(new Error('فشل في فتح قاعدة البيانات'));
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        
        const videoRecord = {
          id: videoId,
          ...videoData,
          timestamp: new Date().toISOString()
        };
        
        const addRequest = store.put(videoRecord);
        
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(new Error('فشل في حفظ الفيديو'));
      };
    });
  };

  const resetForm = () => {
    setVideoForm({
      title: '',
      description: '',
      category: 'البداية',
      level: 'مبتدئ',
      instructor: '',
      duration: '',
      requiredPlan: 'free',
      tags: [],
      featured: false,
      status: 'draft'
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview(null);
    setThumbnailPreview(null);
    setEditingVideo(null);
  };

  // Handle video actions
  const handleEdit = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      category: video.category,
      level: video.level,
      instructor: video.instructor,
      duration: video.duration,
      requiredPlan: video.requiredPlan,
      tags: video.tags || [],
      featured: video.featured || false,
      status: video.status || 'published'
    });
    setShowEditModal(true);
  };

  const handleDelete = (videoId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      const updatedVideos = videos.filter(v => v.id !== videoId);
      saveVideos(updatedVideos);
    }
  };

  const handleStatusChange = (videoId, newStatus) => {
    const updatedVideos = videos.map(v => 
      v.id === videoId ? { ...v, status: newStatus } : v
    );
    saveVideos(updatedVideos);
  };

  const handleBulkAction = (action) => {
    if (selectedVideos.length === 0) return;

    switch (action) {
      case 'publish':
        const publishedVideos = videos.map(v => 
          selectedVideos.includes(v.id) ? { ...v, status: 'published' } : v
        );
        saveVideos(publishedVideos);
        break;
      case 'draft':
        const draftVideos = videos.map(v => 
          selectedVideos.includes(v.id) ? { ...v, status: 'draft' } : v
        );
        saveVideos(draftVideos);
        break;
      case 'delete':
        if (window.confirm(`هل أنت متأكد من حذف ${selectedVideos.length} فيديو؟`)) {
          const remainingVideos = videos.filter(v => !selectedVideos.includes(v.id));
          saveVideos(remainingVideos);
        }
        break;
    }
    setSelectedVideos([]);
  };

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'الكل' || video.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!videoForm.tags.includes(newTag)) {
        setVideoForm(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setVideoForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      }>
        {/* ✅ استخدام النافبار الموحد */}
        <UnifiedNavbar />
        
        {/* ✅ إضافة مساحة للنافبار الثابت */}
        <div className="min-h-screen flex bg-gray-50 pt-20">
          <Suspense fallback={<div className="w-64 bg-white"></div>}>
          </Suspense>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">وصول محظور</h2>
              <p className="text-gray-600 mb-6">
                هذه الصفحة متاحة للمسؤولين فقط
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      {/* ✅ استخدام النافبار الموحد */}
      <UnifiedNavbar />
      
      {/* ✅ إضافة مساحة للنافبار الثابت */}
      <div className="min-h-screen flex bg-gray-50 pt-20">
        <Suspense fallback={<div className="w-64 bg-white"></div>}>
        </Suspense>
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة الفيديوهات</h1>
                <p className="text-gray-600 mt-1">رفع وإدارة المحتوى التعليمي</p>
              </div>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                رفع فيديو جديد
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الفيديوهات</p>
                    <p className="text-3xl font-bold text-gray-900">{videos.length}</p>
                  </div>
                  <Video className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">منشور</p>
                    <p className="text-3xl font-bold text-green-600">
                      {videos.filter(v => v.status === 'published').length}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مسودة</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {videos.filter(v => v.status === 'draft').length}
                    </p>
                  </div>
                  <Edit className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مجموع المشاهدات</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {videos.reduce((sum, v) => sum + (v.views || 0), 0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                
                {/* Search */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث في الفيديوهات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status === 'الكل' ? 'جميع الحالات' : 
                       status === 'draft' ? 'مسودة' :
                       status === 'published' ? 'منشور' : 'قيد المعالجة'}
                    </option>
                  ))}
                </select>

                <button
                  onClick={loadVideos}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Bulk Actions */}
              {selectedVideos.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-900">
                    تم اختيار {selectedVideos.length} فيديو
                  </span>
                  <button
                    onClick={() => handleBulkAction('publish')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    نشر
                  </button>
                  <button
                    onClick={() => handleBulkAction('draft')}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    مسودة
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => setSelectedVideos([])}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>

            {/* Videos List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredVideos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-right py-4 px-6">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVideos(filteredVideos.map(v => v.id));
                              } else {
                                setSelectedVideos([]);
                              }
                            }}
                            checked={selectedVideos.length === filteredVideos.length && filteredVideos.length > 0}
                          />
                        </th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">الفيديو</th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">الفئة</th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">المستوى</th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">الخطة</th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">الحالة</th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">المشاهدات</th>
                        <th className="text-right py-4 px-6 text-gray-700 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVideos.map((video) => (
                        <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              checked={selectedVideos.includes(video.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedVideos([...selectedVideos, video.id]);
                                } else {
                                  setSelectedVideos(selectedVideos.filter(id => id !== video.id));
                                }
                              }}
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 line-clamp-1">
                                  {video.title}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <Users className="w-3 h-3" />
                                  {video.instructor}
                                  <Clock className="w-3 h-3 mr-2" />
                                  {video.duration}
                                  {video.featured && (
                                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-700">
                              {categories.find(c => c.id === video.category)?.name || video.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-700">{video.level}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plans.find(p => p.id === video.requiredPlan)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {plans.find(p => p.id === video.requiredPlan)?.name || video.requiredPlan}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={video.status || 'draft'}
                              onChange={(e) => handleStatusChange(video.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded border-0 ${
                                video.status === 'published' ? 'bg-green-100 text-green-800' :
                                video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="draft">مسودة</option>
                              <option value="published">منشور</option>
                              <option value="processing">قيد المعالجة</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-700">{video.views || 0}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(video)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(video.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فيديوهات</h3>
                  <p className="text-gray-500 mb-6">ابدأ بإضافة فيديو تعليمي جديد</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    رفع فيديو جديد
                  </button>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {(showUploadModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVideo ? 'تعديل الفيديو' : 'رفع فيديو جديد'}
                </h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ملف الفيديو *
                  </label>
                  <div
                    onClick={() => videoFileRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    {videoPreview ? (
                      <div className="space-y-3">
                        <video
                          src={videoPreview}
                          className="w-full h-32 object-cover rounded"
                          controls
                        />
                        <p className="text-sm text-gray-600">{videoFile?.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Video className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-gray-600">اضغط لرفع ملف الفيديو</p>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={videoFileRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    صورة مصغرة *
                  </label>
                  <div
                    onClick={() => thumbnailFileRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    {thumbnailPreview ? (
                      <div className="space-y-3">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-gray-600">{thumbnailFile?.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Image className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-gray-600">اضغط لرفع صورة مصغرة</p>
                          <p className="text-xs text-gray-500">JPG, PNG (16:9)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={thumbnailFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الفيديو *
                  </label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل عنوان الفيديو..."
                    required
                  />
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المدرب *
                  </label>
                  <input
                    type="text"
                    value={videoForm.instructor}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, instructor: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اسم المدرب..."
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة *
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستوى *
                  </label>
                  <select
                    value={videoForm.level}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Required Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الخطة المطلوبة *
                  </label>
                  <select
                    value={videoForm.requiredPlan}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, requiredPlan: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مدة الفيديو
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15:30"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الفيديو *
                </label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="وصف مفصل للفيديو وما سيتعلمه المشاهد..."
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العلامات (Tags)
                </label>
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="اكتب علامة واضغط Enter..."
                />
                {videoForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {videoForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={videoForm.featured}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    فيديو مميز
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={videoForm.status}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                    <option value="processing">قيد المعالجة</option>
                  </select>
                </div>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-3">
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                    <div key={id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>جاري الرفع...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingVideo ? 'حفظ التعديلات' : 'رفع الفيديو'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Suspense>
  );
};

export default AdminVideoUpload;