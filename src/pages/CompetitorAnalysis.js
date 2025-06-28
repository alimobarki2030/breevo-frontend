import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Lock, ArrowLeft } from 'lucide-react';
import DataForSEOService from '../services/DataForSEOService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const CompetitorAnalysis = () => {
  const [domain, setDomain] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [userPlan, setUserPlan] = useState("free");
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  // ✅ التحقق من صلاحية الوصول
  useEffect(() => {
    const user = safeLocalStorageGet("user", {});
    const subscription = JSON.parse(localStorage.getItem("subscription") || "{}");
    const plan = subscription.plan || user.plan || "free";
    
    // Check if this is the site owner - full access always
    const isOwner = user.email === "alimobarki.ad@gmail.com" || 
                   user.email === "owner@breevo.com" || 
                   user.role === "owner" || 
                   user.id === "1";
    
    const currentPlan = isOwner ? "owner" : plan;
    setUserPlan(currentPlan);

    // Business plan and above have access to competitor analysis
    const allowedPlans = ["business", "enterprise", "owner"];
    setHasAccess(allowedPlans.includes(currentPlan));
  }, []);

  const analyzeCompetitors = async () => {
    if (!hasAccess) {
      setError('تحتاج لترقية خطتك للوصول لهذه الميزة');
      return;
    }

    if (!domain.trim()) {
      setError('يرجى إدخال اسم النطاق الخاص بك');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use DataForSEO Service with parallel API calls for better performance
      const [domainOverviewResponse, competitorsResponse, rankedKeywordsResponse, backlinksResponse] = await Promise.all([
        DataForSEOService.getDomainOverview(domain),
        DataForSEOService.getCompetitors(domain),
        DataForSEOService.getRankedKeywords(domain),
        DataForSEOService.getBacklinksSummary(domain)
      ]);

      setResults({
        overview: domainOverviewResponse.tasks?.[0]?.result?.[0] || null,
        competitors: competitorsResponse.tasks?.[0]?.result || [],
        keywords: rankedKeywordsResponse.tasks?.[0]?.result || [],
        backlinks: backlinksResponse.tasks?.[0]?.result?.[0] || null
      });

    } catch (err) {
      setError('حدث خطأ في تحليل المنافسين. يرجى المحاولة مرة أخرى.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const compareWithCompetitor = async () => {
    if (!hasAccess) {
      setError('تحتاج لترقية خطتك للوصول لهذه الميزة');
      return;
    }

    if (!competitor.trim()) {
      setError('يرجى إدخال نطاق المنافس');
      return;
    }

    setLoading(true);
    try {
      // Domain intersection analysis using service
      const intersectionResponse = await DataForSEOService.getDomainIntersection([domain, competitor]);
      
      setResults(prev => ({
        ...prev,
        intersection: intersectionResponse.tasks?.[0]?.result || []
      }));

    } catch (err) {
      setError('فشل في مقارنة النطاقات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'غير متوفر';
    return DataForSEOService.formatArabicNumber(num);
  };

  const formatTraffic = (traffic) => {
    if (!traffic) return 'غير متوفر';
    if (traffic >= 1000000) return (traffic / 1000000).toFixed(1) + ' مليون';
    if (traffic >= 1000) return (traffic / 1000).toFixed(1) + ' ألف';
    return traffic.toString();
  };

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      <span className="ml-2">{icon}</span>
      {label}
    </button>
  );

  // ✅ عرض رسالة منع الوصول
  if (!hasAccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ميزة متقدمة</h2>
              <p className="text-gray-600 mb-6">
                تحليل المنافسين متاح لخطة الأعمال وما فوق
              </p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-900 mb-2">
                  خطتك الحالية: {
                    userPlan === "free" ? "مجانية" : 
                    userPlan === "professional" ? "احترافية" : 
                    userPlan
                  }
                </h3>
                <p className="text-sm text-purple-700">
                  ترقى لخطة الأعمال للحصول على:
                </p>
                <ul className="text-sm text-purple-700 mt-2 space-y-1">
                  <li>• تحليل شامل للمنافسين</li>
                  <li>• مقارنة الكلمات المفتاحية</li>
                  <li>• تحليل الروابط الخلفية</li>
                  <li>• مراقبة أداء المنافسين</li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link 
                  to="/pricing"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  ترقية لخطة الأعمال
                </Link>
                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للمنتجات
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  // ✅ العرض العادي للمستخدمين المصرح لهم
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with breadcrumb */}
            <div className="flex items-center gap-4 mb-6">
              <Link 
                to="/products" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للمنتجات
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                تحليل المنافسين
              </h1>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                خطة {userPlan === "business" ? "أعمال" : userPlan === "enterprise" ? "مؤسسية" : "مميزة"}
              </div>
            </div>

            <div className="space-y-8">
              {/* Header Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
                  <span className="text-2xl">⚔️</span>
                </div>
                <h2 className="text-3xl font-extrabold mb-4 text-gray-900">
                  اكتشف استراتيجيات منافسيك
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  اكتشف استراتيجيات منافسيك وحدد الفرص لتحسين موقعك في نتائج البحث
                </p>
              </motion.div>

              {/* Search Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-semibold mb-3 text-gray-800">
                      نطاق موقعك
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-3 text-gray-800">
                      نطاق المنافس (اختياري)
                    </label>
                    <input
                      type="text"
                      value={competitor}
                      onChange={(e) => setCompetitor(e.target.value)}
                      placeholder="competitor.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={analyzeCompetitors}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        جاري التحليل
                      </div>
                    ) : (
                      '🔍 تحليل النطاق'
                    )}
                  </button>
                  {competitor && (
                    <button
                      onClick={compareWithCompetitor}
                      disabled={loading || !results}
                      className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      ⚖️ مقارنة النطاقات
                    </button>
                  )}
                </div>
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 mt-4 text-center bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>

              {/* Results */}
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-8"
                >
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <TabButton 
                      id="overview" 
                      label="نظرة عامة" 
                      icon="📊"
                      active={activeTab === 'overview'} 
                      onClick={setActiveTab} 
                    />
                    <TabButton 
                      id="competitors" 
                      label="المنافسون" 
                      icon="🏆"
                      active={activeTab === 'competitors'} 
                      onClick={setActiveTab} 
                    />
                    <TabButton 
                      id="keywords" 
                      label="الكلمات المفتاحية" 
                      icon="🎯"
                      active={activeTab === 'keywords'} 
                      onClick={setActiveTab} 
                    />
                    <TabButton 
                      id="backlinks" 
                      label="الروابط الخلفية" 
                      icon="🔗"
                      active={activeTab === 'backlinks'} 
                      onClick={setActiveTab} 
                    />
                    {results.intersection && (
                      <TabButton 
                        id="intersection" 
                        label="المقارنة المتقدمة" 
                        icon="⚖️"
                        active={activeTab === 'intersection'} 
                        onClick={setActiveTab} 
                      />
                    )}
                  </div>

                  {/* Overview Tab */}
                  {activeTab === 'overview' && results.overview && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                      <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
                        <span className="ml-3">📊</span>
                        تحليل شامل للنطاق: {domain}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="text-3xl mb-3">🌊</div>
                          <p className="text-sm text-blue-600 mb-2">الزيارات العضوية</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {formatTraffic(results.overview.organic_etv)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                          <div className="text-3xl mb-3">🔑</div>
                          <p className="text-sm text-green-600 mb-2">الكلمات العضوية</p>
                          <p className="text-2xl font-bold text-green-700">
                            {formatNumber(results.overview.organic_count)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="text-3xl mb-3">💰</div>
                          <p className="text-sm text-yellow-600 mb-2">الكلمات المدفوعة</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {formatNumber(results.overview.paid_count)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
                          <div className="text-3xl mb-3">👑</div>
                          <p className="text-sm text-purple-600 mb-2">تصنيف النطاق</p>
                          <p className="text-2xl font-bold text-purple-700">
                            {results.overview.rank || 'غير محدد'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Competitors Tab */}
                  {activeTab === 'competitors' && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                      <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
                        <span className="ml-3">🏆</span>
                        أقوى المنافسين
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-4">
                          {results.competitors.length} منافس
                        </span>
                      </h2>
                      
                      {results.competitors.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">النطاق</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">متوسط الترتيب</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">الكلمات المشتركة</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">كلمات البحث</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">قيمة الزيارات</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {results.competitors.slice(0, 10).map((comp, index) => (
                                  <motion.tr 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="py-4 px-6 font-medium text-gray-900 flex items-center">
                                      <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm ml-3">
                                        {index + 1}
                                      </span>
                                      {comp.domain}
                                    </td>
                                    <td className="py-4 px-6 text-blue-600">{comp.avg_position?.toFixed(1) || 'غير محدد'}</td>
                                    <td className="py-4 px-6 text-green-600">{formatNumber(comp.intersections)}</td>
                                    <td className="py-4 px-6 text-yellow-600">{formatNumber(comp.se_keywords)}</td>
                                    <td className="py-4 px-6 text-purple-600">{formatTraffic(comp.etv)}</td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-6xl mb-4">🏆</div>
                          <p className="text-xl">لم يتم العثور على منافسين</p>
                          <p className="text-sm mt-2">تأكد من صحة النطاق أو جرب نطاق آخر</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Keywords Tab */}
                  {activeTab === 'keywords' && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                      <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
                        <span className="ml-3">🎯</span>
                        أفضل الكلمات المفتاحية
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-4">
                          {results.keywords.length} كلمة
                        </span>
                      </h2>
                      
                      {results.keywords.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">الكلمة المفتاحية</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">الترتيب</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">حجم البحث</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">تكلفة النقرة</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">الرابط</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {results.keywords.slice(0, 15).map((kw, index) => (
                                  <motion.tr 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="py-4 px-6 font-medium text-gray-900">{kw.keyword}</td>
                                    <td className="py-4 px-6">
                                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                        kw.se_results_pos <= 3 ? 'bg-green-100 text-green-800 border border-green-200' :
                                        kw.se_results_pos <= 10 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                        'bg-red-100 text-red-800 border border-red-200'
                                      }`}>
                                        #{kw.se_results_pos}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-blue-600">{formatNumber(kw.search_volume)}</td>
                                    <td className="py-4 px-6 text-green-600">
                                      {DataForSEOService.formatSaudiPrice(kw.cpc)}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                                      {kw.se_results_url}
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-6xl mb-4">🎯</div>
                          <p className="text-xl">لم يتم العثور على كلمات مفتاحية</p>
                          <p className="text-sm mt-2">قد يحتاج النطاق لوقت أطول لتجميع البيانات</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Backlinks Tab */}
                  {activeTab === 'backlinks' && results.backlinks && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                      <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
                        <span className="ml-3">🔗</span>
                        تحليل الروابط الخلفية
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="text-3xl mb-3">🔗</div>
                          <p className="text-sm text-blue-600 mb-2">إجمالي الروابط</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {formatNumber(results.backlinks.backlinks)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                          <div className="text-3xl mb-3">🌐</div>
                          <p className="text-sm text-green-600 mb-2">النطاقات المرجعية</p>
                          <p className="text-2xl font-bold text-green-700">
                            {formatNumber(results.backlinks.referring_domains)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="text-3xl mb-3">⭐</div>
                          <p className="text-sm text-yellow-600 mb-2">تصنيف النطاق</p>
                          <p className="text-2xl font-bold text-yellow-700">
                            {results.backlinks.rank || 'غير محدد'}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl">
                          <div className="text-3xl mb-3">💔</div>
                          <p className="text-sm text-red-600 mb-2">الروابط المكسورة</p>
                          <p className="text-2xl font-bold text-red-700">
                            {formatNumber(results.backlinks.broken_backlinks)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Domain Intersection Tab */}
                  {activeTab === 'intersection' && results.intersection && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                      <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
                        <span className="ml-3">⚖️</span>
                        مقارنة متقدمة: {domain} مقابل {competitor}
                      </h2>
                      
                      {results.intersection.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">الكلمة المفتاحية</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">ترتيبك</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">ترتيب المنافس</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">حجم البحث</th>
                                  <th className="text-right py-4 px-6 text-gray-700 font-semibold">الفرصة</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {results.intersection.slice(0, 20).map((item, index) => {
                                  const yourPos = item.first_domain_serp_element?.rank_absolute;
                                  const compPos = item.second_domain_serp_element?.rank_absolute;
                                  const isOpportunity = compPos && yourPos && compPos < yourPos;
                                  const isWinning = yourPos && compPos && yourPos < compPos;
                                  
                                  return (
                                    <motion.tr 
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="py-4 px-6 font-medium text-gray-900">{item.keyword}</td>
                                      <td className="py-4 px-6 text-blue-600">
                                        {yourPos ? `#${yourPos}` : 'غير مصنف'}
                                      </td>
                                      <td className="py-4 px-6 text-yellow-600">
                                        {compPos ? `#${compPos}` : 'غير مصنف'}
                                      </td>
                                      <td className="py-4 px-6 text-green-600">{formatNumber(item.search_volume)}</td>
                                      <td className="py-4 px-6">
                                        {isOpportunity && (
                                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full border border-red-200">
                                            متأخر بـ {yourPos - compPos} مراكز
                                          </span>
                                        )}
                                        {isWinning && (
                                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full border border-green-200">
                                            متقدم بـ {compPos - yourPos} مراكز
                                          </span>
                                        )}
                                      </td>
                                    </motion.tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-6xl mb-4">⚖️</div>
                          <p className="text-xl">لا توجد كلمات مشتركة</p>
                          <p className="text-sm mt-2">جرب منافس آخر أو تأكد من صحة النطاقات</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success Tips */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8"
                  >
                    <h3 className="font-bold text-purple-800 mb-4 text-xl flex items-center">
                      <span className="ml-3">💡</span>
                      استراتيجيات للتفوق على المنافسين
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                      <div className="space-y-3">
                        <p className="flex items-start">
                          <span className="text-purple-600 ml-2 mt-1">✓</span>
                          ركز على الكلمات التي يتفوق عليك فيها المنافسون
                        </p>
                        <p className="flex items-start">
                          <span className="text-purple-600 ml-2 mt-1">✓</span>
                          ادرس المحتوى الذي يحتل المراكز الأولى
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p className="flex items-start">
                          <span className="text-purple-600 ml-2 mt-1">✓</span>
                          ابني روابط خلفية عالية الجودة
                        </p>
                        <p className="flex items-start">
                          <span className="text-purple-600 ml-2 mt-1">✓</span>
                          حدث المحتوى بانتظام وحسن تجربة المستخدم
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Empty State */}
              {!results && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center py-16"
                >
                  <div className="text-8xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-700">ابدأ تحليل منافسيك الآن</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    أدخل نطاق موقعك أعلاه واحصل على تحليل شامل لموقعك ومنافسيك في السوق
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CompetitorAnalysis;