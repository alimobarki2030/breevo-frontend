import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Lock, ArrowLeft } from 'lucide-react';
import DataForSEOService from '../services/DataForSEOService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const KeywordResearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

    // Professional plan and above have access to keyword research
    const allowedPlans = ["professional", "business", "enterprise", "owner"];
    setHasAccess(allowedPlans.includes(currentPlan));
  }, []);

  const searchKeywords = async () => {
    if (!hasAccess) {
      setError('تحتاج لترقية خطتك للوصول لهذه الميزة');
      return;
    }

    if (!keyword.trim()) {
      setError('يرجى إدخال كلمة مفتاحية');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use DataForSEO Service instead of direct API calls
      const [keywordDataResponse, relatedKeywordsResponse] = await Promise.all([
        DataForSEOService.getKeywordData([keyword]),
        DataForSEOService.getRelatedKeywords(keyword)
      ]);

      setResults({
        mainKeyword: keywordDataResponse.tasks?.[0]?.result?.[0] || null,
        relatedKeywords: relatedKeywordsResponse.tasks?.[0]?.result || []
      });

    } catch (err) {
      setError('حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'غير متوفر';
    return DataForSEOService.formatArabicNumber(num);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 30) return 'text-green-400';
    if (difficulty <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyLabel = (difficulty) => {
    if (!difficulty) return 'غير محدد';
    if (difficulty <= 30) return 'سهل';
    if (difficulty <= 60) return 'متوسط';
    return 'صعب';
  };

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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ميزة متقدمة</h2>
              <p className="text-gray-600 mb-6">
                بحث الكلمات المفتاحية متاح للخطة الاحترافية وما فوق
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">خطتك الحالية: {userPlan === "free" ? "مجانية" : userPlan}</h3>
                <p className="text-sm text-blue-700">
                  ترقى للخطة الاحترافية للحصول على:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• بحث الكلمات المفتاحية</li>
                  <li>• تحليل حجم البحث</li>
                  <li>• مستوى المنافسة</li>
                  <li>• اقتراحات ذكية</li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link 
                  to="/pricing"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  ترقية الخطة
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
                بحث الكلمات المفتاحية
              </h1>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                خطة {userPlan === "professional" ? "احترافية" : userPlan === "business" ? "أعمال" : "مميزة"}
              </div>
            </div>

            <div className="space-y-8">
              {/* Header Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-3xl font-extrabold mb-4 text-gray-900">
                  اكتشف أفضل الكلمات المفتاحية
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  اكتشف أفضل الكلمات المفتاحية لمنتجاتك وحقق ظهورًا أفضل في محركات البحث
                </p>
              </motion.div>

              {/* Search Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              >
                <div className="max-w-2xl mx-auto">
                  <label className="block text-lg font-semibold mb-4 text-gray-800">
                    أدخل الكلمة المفتاحية المراد تحليلها
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="مثال: هاتف ذكي، ملابس نسائية، منتجات تجميل..."
                      className="flex-1 px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && searchKeywords()}
                    />
                    <button
                      onClick={searchKeywords}
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-[120px]"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                          جاري البحث
                        </div>
                      ) : (
                        'ابدأ التحليل'
                      )}
                    </button>
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
                </div>
              </motion.div>

              {/* Results */}
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-8"
                >
                  {/* Main Keyword Stats */}
                  {results.mainKeyword && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                      <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
                        <span className="ml-3">📊</span>
                        نظرة عامة على الكلمة المفتاحية
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="text-3xl mb-2">📈</div>
                          <p className="text-sm text-blue-600 mb-2">حجم البحث الشهري</p>
                          <p className="text-3xl font-bold text-blue-700">
                            {formatNumber(results.mainKeyword.search_volume)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                          <div className="text-3xl mb-2">💰</div>
                          <p className="text-sm text-green-600 mb-2">تكلفة النقرة (ريال)</p>
                          <p className="text-3xl font-bold text-green-700">
                            {DataForSEOService.formatSaudiPrice(results.mainKeyword.cpc)}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="text-3xl mb-2">⚔️</div>
                          <p className="text-sm text-yellow-600 mb-2">مستوى المنافسة</p>
                          <p className="text-3xl font-bold text-yellow-700">
                            {results.mainKeyword.competition === 'LOW' ? 'منخفض' :
                             results.mainKeyword.competition === 'MEDIUM' ? 'متوسط' :
                             results.mainKeyword.competition === 'HIGH' ? 'عالي' : 'غير محدد'}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
                          <div className="text-3xl mb-2">🎯</div>
                          <p className="text-sm text-purple-600 mb-2">الكلمة المستهدفة</p>
                          <p className="text-lg font-bold text-purple-700 break-words">
                            {results.mainKeyword.keyword || keyword}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Related Keywords */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
                      <span className="ml-3">🔗</span>
                      الكلمات المفتاحية ذات الصلة
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-4">
                        {results.relatedKeywords.length} كلمة
                      </span>
                    </h2>
                    
                    {results.relatedKeywords.length > 0 ? (
                      <div className="overflow-hidden rounded-xl border border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-right py-4 px-6 text-gray-700 font-semibold">الكلمة المفتاحية</th>
                                <th className="text-right py-4 px-6 text-gray-700 font-semibold">حجم البحث</th>
                                <th className="text-right py-4 px-6 text-gray-700 font-semibold">الصعوبة</th>
                                <th className="text-right py-4 px-6 text-gray-700 font-semibold">تكلفة النقرة</th>
                                <th className="text-right py-4 px-6 text-gray-700 font-semibold">المنافسة</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {results.relatedKeywords.slice(0, 20).map((kw, index) => (
                                <motion.tr 
                                  key={index} 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="py-4 px-6 font-medium text-gray-900">{kw.keyword}</td>
                                  <td className="py-4 px-6 text-blue-600">{formatNumber(kw.search_volume)}</td>
                                  <td className="py-4 px-6">
                                    <span className={`font-semibold ${getDifficultyColor(kw.keyword_difficulty)}`}>
                                      {getDifficultyLabel(kw.keyword_difficulty)}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6 text-green-600">
                                    {DataForSEOService.formatSaudiPrice(kw.cpc)}
                                  </td>
                                  <td className="py-4 px-6 text-yellow-600">
                                    {kw.competition === 'LOW' ? 'منخفض' :
                                     kw.competition === 'MEDIUM' ? 'متوسط' :
                                     kw.competition === 'HIGH' ? 'عالي' : 'غير محدد'}
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl">لم يتم العثور على كلمات مفتاحية ذات صلة</p>
                        <p className="text-sm mt-2">جرب كلمة مفتاحية أخرى أو تأكد من صحة الإملاء</p>
                      </div>
                    )}
                  </div>

                  {/* Success Tips */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8"
                  >
                    <h3 className="font-bold text-blue-800 mb-4 text-xl flex items-center">
                      <span className="ml-3">💡</span>
                      نصائح لاستخدام النتائج بفعالية
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                      <div className="space-y-3">
                        <p className="flex items-start">
                          <span className="text-blue-600 ml-2 mt-1">✓</span>
                          ركز على الكلمات ذات المنافسة المنخفضة وحجم البحث العالي
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 ml-2 mt-1">✓</span>
                          استخدم الكلمات الطويلة لاستهداف أكثر دقة
                        </p>
                      </div>
                      <div className="space-y-3">
                        <p className="flex items-start">
                          <span className="text-blue-600 ml-2 mt-1">✓</span>
                          ادمج الكلمات في عناوين ووصف المنتجات
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 ml-2 mt-1">✓</span>
                          راقب الأداء وقم بالتحسين المستمر
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
                  <div className="text-8xl mb-6">🎯</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-700">ابدأ رحلة اكتشاف الكلمات المفتاحية</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    أدخل كلمة مفتاحية أعلاه واحصل على تحليل شامل يساعدك في تحسين ظهور منتجاتك
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

export default KeywordResearch;