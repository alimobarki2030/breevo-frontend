import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Search, 
  Filter, 
  Clock, 
  User, 
  BookmarkPlus, 
  BookmarkCheck,
  Crown,
  Lock,
  CheckCircle,
  Star,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Globe,
  Users,
  Award,
  Download,
  Share,
  Eye,
  Calendar
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Videos = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedLevel, setSelectedLevel] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
  const [userPlan, setUserPlan] = useState('free');
  const [watchedVideos, setWatchedVideos] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh function
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Load user data and preferences
  useEffect(() => {
    const user = safeLocalStorageGet("user", {});
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    const plan = subscription.plan || user.plan || "free";
    
    // Check if this is the site owner
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    setUserPlan(isOwner ? "owner" : plan);

    // Load user preferences
    const savedBookmarks = JSON.parse(localStorage.getItem("video_bookmarks") || "[]");
    const savedProgress = JSON.parse(localStorage.getItem("video_progress") || "{}");
    setBookmarkedVideos(savedBookmarks);
    setWatchedVideos(savedProgress);
  }, []);

  // Video categories with access control
  const videoCategories = [
    { id: 'الكل', name: 'جميع الفيديوهات', icon: '📚', plan: 'free' },
    { id: 'البداية', name: 'البداية والأساسيات', icon: '🚀', plan: 'free' },
    { id: 'السيو-الأساسي', name: 'السيو الأساسي', icon: '📊', plan: 'free' },
    { id: 'المنتجات', name: 'تحسين المنتجات', icon: '📦', plan: 'free' },
    { id: 'الكلمات-المفتاحية', name: 'بحث الكلمات المفتاحية', icon: '🔍', plan: 'professional' },
    { id: 'المنافسين', name: 'تحليل المنافسين', icon: '⚔️', plan: 'business' },
    { id: 'متقدم', name: 'استراتيجيات متقدمة', icon: '🎯', plan: 'business' },
    { id: 'تقارير', name: 'التقارير والتحليل', icon: '📈', plan: 'enterprise' }
  ];

  const levelOptions = [
    { id: 'الكل', name: 'جميع المستويات' },
    { id: 'مبتدئ', name: 'مبتدئ' },
    { id: 'متوسط', name: 'متوسط' },
    { id: 'متقدم', name: 'متقدم' }
  ];

  // Load videos from admin panel + some sample videos
  const [videoData, setVideoData] = useState([]);

  // Load videos when component mounts
  useEffect(() => {
    const loadVideos = () => {
      // Get videos from admin panel
      const adminVideos = JSON.parse(localStorage.getItem("admin_videos") || "[]");
      
      // Filter to only show published videos
      const publishedVideos = adminVideos.filter(video => video.status === 'published');
      
      // Sample videos (will be hidden if you have uploaded videos)
      const sampleVideos = [
        {
          id: 1,
          title: 'مقدمة في تحسين محركات البحث للمبتدئين',
          description: 'تعلم الأساسيات الضرورية لفهم السيو وكيفية تطبيقه على منتجاتك',
          duration: '15:30',
          category: 'البداية',
          level: 'مبتدئ',
          instructor: 'أحمد محمد',
          thumbnail: '/api/placeholder/320/180',
          views: 1250,
          rating: 4.8,
          requiredPlan: 'free',
          tags: ['سيو', 'مبتدئين', 'أساسيات'],
          createdAt: '2024-01-15',
          featured: true,
          status: 'published'
        },
        {
          id: 2,
          title: 'كيفية كتابة أوصاف منتجات محسنة للسيو',
          description: 'دليل شامل لكتابة أوصاف منتجات تجذب العملاء وتحسن ترتيبك في نتائج البحث',
          duration: '22:45',
          category: 'المنتجات',
          level: 'مبتدئ',
          instructor: 'سارة أحمد',
          thumbnail: '/api/placeholder/320/180',
          views: 890,
          rating: 4.9,
          requiredPlan: 'free',
          tags: ['منتجات', 'كتابة', 'أوصاف'],
          createdAt: '2024-01-10',
          status: 'published'
        },
        {
          id: 3,
          title: 'استراتيجيات البحث عن الكلمات المفتاحية الفعالة',
          description: 'تعلم كيفية العثور على أفضل الكلمات المفتاحية لمنتجاتك باستخدام أدوات احترافية',
          duration: '28:15',
          category: 'الكلمات-المفتاحية',
          level: 'متوسط',
          instructor: 'محمد علي',
          thumbnail: '/api/placeholder/320/180',
          views: 670,
          rating: 4.7,
          requiredPlan: 'professional',
          tags: ['كلمات مفتاحية', 'بحث', 'أدوات'],
          createdAt: '2024-01-05',
          status: 'published'
        }
      ];
      
      // If you have uploaded videos, show them. Otherwise show sample videos
      if (publishedVideos.length > 0) {
        setVideoData(publishedVideos);
      } else {
        setVideoData(sampleVideos);
      }
    };

    loadVideos();
    
    // Listen for storage changes (when videos are added in admin panel)
    const handleStorageChange = () => {
      loadVideos();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for focus events (when switching between tabs)
    window.addEventListener('focus', loadVideos);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadVideos);
    };
  }, [refreshKey]); // Added refreshKey dependency

  // Helper functions
  const canAccessVideo = (video) => {
    const planHierarchy = {
      'free': 0,
      'professional': 1,
      'business': 2,
      'enterprise': 3,
      'owner': 4
    };
    
    const requiredLevel = planHierarchy[video.requiredPlan] || 0;
    const userLevel = planHierarchy[userPlan] || 0;
    
    return userLevel >= requiredLevel;
  };

  const toggleBookmark = (videoId) => {
    const newBookmarks = bookmarkedVideos.includes(videoId)
      ? bookmarkedVideos.filter(id => id !== videoId)
      : [...bookmarkedVideos, videoId];
    
    setBookmarkedVideos(newBookmarks);
    localStorage.setItem("video_bookmarks", JSON.stringify(newBookmarks));
  };

  const markAsWatched = (videoId) => {
    const newWatchedVideos = { ...watchedVideos, [videoId]: true };
    setWatchedVideos(newWatchedVideos);
    localStorage.setItem("video_progress", JSON.stringify(newWatchedVideos));
  };

  const getFilteredVideos = useMemo(() => {
    return videoData.filter(video => {
      const matchesCategory = selectedCategory === 'الكل' || video.category === selectedCategory;
      const matchesLevel = selectedLevel === 'الكل' || video.level === selectedLevel;
      const matchesSearch = !searchQuery || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const featuredVideos = videoData.filter(video => video.featured && canAccessVideo(video));
  const recentVideos = videoData.slice(0, 3);

  const getPlanBadge = (plan) => {
    const badges = {
      'free': { text: 'مجاني', color: 'bg-gray-100 text-gray-800', icon: '📚' },
      'professional': { text: 'احترافي', color: 'bg-blue-100 text-blue-800', icon: '💎' },
      'business': { text: 'أعمال', color: 'bg-purple-100 text-purple-800', icon: '👑' },
      'enterprise': { text: 'مؤسسي', color: 'bg-green-100 text-green-800', icon: '🏢' }
    };
    return badges[plan] || badges.free;
  };

  const formatDuration = (duration) => {
    return duration; // Already formatted as "MM:SS"
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'ألف';
    }
    return views.toString();
  };

  const VideoCard = ({ video, featured = false }) => {
    const hasAccess = canAccessVideo(video);
    const isBookmarked = bookmarkedVideos.includes(video.id);
    const isWatched = watchedVideos[video.id];
    const badge = getPlanBadge(video.requiredPlan);

    // Get actual thumbnail URL
    const getThumbnailUrl = (video) => {
      if (video.thumbnail && video.thumbnail.startsWith('local_thumbnail_')) {
        const videoId = video.thumbnail.replace('local_thumbnail_', '');
        const thumbnails = JSON.parse(localStorage.getItem("video_thumbnails") || "{}");
        return thumbnails[videoId]?.data || null;
      }
      return video.thumbnail;
    };

    const thumbnailUrl = getThumbnailUrl(video);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg ${
          featured ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
        }`}
      >
        {/* Thumbnail */}
        <div className="relative">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={video.title}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                // Fallback to gradient background
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
               style={{ display: thumbnailUrl ? 'none' : 'flex' }}>
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
          
          {/* Overlay badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                مميز
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.icon} {badge.text}
            </span>
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duration)}
          </div>

          {/* Access overlay */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">ترقية مطلوبة</p>
              </div>
            </div>
          )}

          {/* Watched indicator */}
          {isWatched && (
            <div className="absolute top-3 left-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 flex-1">
              {video.title}
            </h3>
            <button
              onClick={() => toggleBookmark(video.id)}
              className="mr-3 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-yellow-500" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {video.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {video.instructor}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViews(video.views)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{video.rating}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(video.tags || []).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action button */}
          {hasAccess ? (
            <button
              onClick={() => {
                markAsWatched(video.id);
                // Here you would normally open a video player
                alert(`سيتم تشغيل الفيديو: ${video.title}`);
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Play className="w-4 h-4" />
              {isWatched ? 'مشاهدة مرة أخرى' : 'بدء المشاهدة'}
            </button>
          ) : (
            <Link
              to="/pricing"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Crown className="w-4 h-4" />
              ترقية للمشاهدة
            </Link>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6"
              >
                <span className="text-2xl">📹</span>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                شروحات الفيديو التعليمية
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                تعلم كيفية تحسين منتجاتك وتحقيق أفضل النتائج في محركات البحث من خلال فيديوهات تعليمية احترافية
              </p>
              
              {/* Admin hint + refresh button */}
              {userPlan === "owner" && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Link
                    to="/admin/videos"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    🎬 إدارة الفيديوهات
                  </Link>
                  <button
                    onClick={forceRefresh}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    🔄 تحديث
                  </button>
                  <button
                    onClick={() => {
                      const adminVideos = JSON.parse(localStorage.getItem("admin_videos") || "[]");
                      const videoFiles = JSON.parse(localStorage.getItem("video_files") || "{}");
                      const thumbnails = JSON.parse(localStorage.getItem("video_thumbnails") || "{}");
                      console.log("Debug Info:");
                      console.log("Admin Videos:", adminVideos);
                      console.log("Video Files:", Object.keys(videoFiles));
                      console.log("Thumbnails:", Object.keys(thumbnails));
                      alert(`المخزن: ${adminVideos.length} فيديو، ${Object.keys(videoFiles).length} ملف، ${Object.keys(thumbnails).length} صورة مصغرة`);
                    }}
                    className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    🔍 فحص التخزين
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-2xl font-bold text-gray-900">{videoData.length}</div>
                <div className="text-sm text-gray-600">إجمالي الفيديوهات</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-gray-900">8+</div>
                <div className="text-sm text-gray-600">ساعات محتوى</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">مدربين خبراء</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">متوسط التقييم</div>
              </div>
            </div>

            {/* Featured Videos */}
            {featuredVideos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  الفيديوهات المميزة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVideos.map(video => (
                    <VideoCard key={video.id} video={video} featured={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث في الفيديوهات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  تصفية
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الفئة
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {videoCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المستوى
                      </label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {levelOptions.map(level => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Video Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  جميع الفيديوهات
                  <span className="text-lg text-gray-500 font-normal mr-2">
                    ({getFilteredVideos.length} فيديو)
                  </span>
                </h2>
                
                {/* Show source indicator for debugging */}
                {userPlan === "owner" && (
                  <div className="text-sm text-gray-500">
                    {JSON.parse(localStorage.getItem("admin_videos") || "[]").filter(v => v.status === 'published').length > 0 
                      ? "📂 من المحتوى المرفوع" 
                      : "📋 عينات تجريبية"}
                  </div>
                )}
              </div>

              {getFilteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredVideos.map(video => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد فيديوهات</h3>
                  <p className="text-gray-500">
                    {searchQuery || selectedCategory !== 'الكل' || selectedLevel !== 'الكل'
                      ? 'لم يتم العثور على فيديوهات تطابق البحث أو التصفية المحددة'
                      : 'لم يتم إضافة فيديوهات بعد'
                    }
                  </p>
                </div>
              )}
            </section>

            {/* Learning Path Suggestion */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                مسار التعلم المقترح
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">البداية</h4>
                  <p className="text-gray-600">تعلم الأساسيات وفهم المنصة</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">التطبيق</h4>
                  <p className="text-gray-600">تحسين منتجاتك وكتابة محتوى فعال</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">التقدم</h4>
                  <p className="text-gray-600">استراتيجيات متقدمة وتحليل المنافسين</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default Videos;