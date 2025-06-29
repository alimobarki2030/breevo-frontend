// Pure SEO Analysis Functions Only
// تم حذف دوال الذكاء الاصطناعي والاعتماد على البرومبت المخصص فقط

const analyzeSEO = (product) => {
  
  // ===========================================
  // 📊 Core SEO Analysis Functions
  // ===========================================

  // Core SEO Criteria Checker
  const checkCoreCriteria = (product) => {
    const criteria = [];
    const keyword = product.keyword?.trim().toLowerCase() || "";
    const title = product.name?.trim().toLowerCase() || "";
    const description = product.description?.trim() || "";
    const metaTitle = product.meta_title?.trim().toLowerCase() || "";
    const metaDescription = product.meta_description?.trim() || "";
    const imageAlt = product.imageAlt?.trim().toLowerCase() || "";
    
    // Remove HTML tags for word counting
    const cleanDescription = description.replace(/<[^>]*>/g, ' ').trim();
    const descriptionWords = cleanDescription.split(/\s+/).filter(word => word.length > 0);
    const first25Words = descriptionWords.slice(0, 25).join(' ').toLowerCase();

    // 1. Using the ideal focus keyword
    criteria.push({
      id: 'focus_keyword',
      text: 'استخدام الكلمة المفتاحية المثالية',
      status: keyword ? 'pass' : 'fail'
    });

    // 2. Including focus keyword in product title
    criteria.push({
      id: 'keyword_in_title',
      text: 'تضمين الكلمة المفتاحية في عنوان المنتج',
      status: keyword && title.includes(keyword) ? 'pass' : 'fail'
    });

    // 3. Including focus keyword in first 25 words of description
    criteria.push({
      id: 'keyword_in_first_25',
      text: 'تضمين الكلمة المفتاحية في أول 25 كلمة من الوصف',
      status: keyword && first25Words.includes(keyword) ? 'pass' : 'fail'
    });

    // 4. Including focus keyword in SEO title (Page Title)
    criteria.push({
      id: 'keyword_in_meta_title',
      text: 'تضمين الكلمة المفتاحية في Page Title عنوان السيو',
      status: keyword && metaTitle.includes(keyword) ? 'pass' : 'fail'
    });

    // 5. Using meta description (Page Description)
    criteria.push({
      id: 'has_meta_description',
      text: 'استخدام Page Description وصف الميتا',
      status: metaDescription.length > 0 ? 'pass' : 'fail'
    });

    // 6. Description length at least 120 words
    criteria.push({
      id: 'description_length',
      text: `طول الوصف لا يقل عن 100 كلمة (حالياً: ${descriptionWords.length} كلمة)`,
      status: descriptionWords.length >= 100 ? 'pass' : 'fail'
    });

    // 7. Using internal backlinks (check for any links in description)
    const hasLinks = /<a\s+[^>]*href=[^>]*>/i.test(description);
    criteria.push({
      id: 'internal_links',
      text: 'استخدام روابط داخلية',
      status: hasLinks ? 'pass' : 'fail'
    });

    // 8. Image ALT text includes focus keyword or product title
    const altIncludesKeyword = keyword && imageAlt.includes(keyword);
    const altIncludesTitle = product.name && imageAlt.includes(product.name.toLowerCase());
    criteria.push({
      id: 'image_alt_keyword',
      text: 'نص ALT للصورة يحتوي على الكلمة المفتاحية أو عنوان المنتج',
      status: altIncludesKeyword || altIncludesTitle ? 'pass' : 'fail'
    });

     // 9. Both Product title AND Page Title must contain numbers or sizes (stricter requirement)
    const nameHasNumber = /\d/.test(product.name || '');
    const metaTitleHasNumber = /\d/.test(product.meta_title || '');
    
    criteria.push({
      id: 'title_has_number',
      text: 'اسم المنتج و Page Title كلاهما يحتوي على حجم أو رقم',
      status: nameHasNumber && metaTitleHasNumber ? 'pass' : 'fail'
    });

    const passedCount = criteria.filter(c => c.status === 'pass').length;
    const totalCount = criteria.length;
    const score = Math.round((passedCount / totalCount) * 100);

    return {
      criteria,
      score,
      passedCount,
      totalCount
    };
  };

  // Additional SEO Criteria Generator
  const generateAdditionalCriteria = (product) => {
    const categories = {};

    // ===========================================
    // 🔗 URL Structure Criteria
    // ===========================================
    const urlChecks = [];
    if (product.url_path) {
      urlChecks.push({
        id: 'url_length',
        text: `طول الرابط مناسب (${product.url_path.length} حرف)`,
        status: product.url_path.length <= 60 ? 'pass' : 'fail'
      });
      
      urlChecks.push({
        id: 'url_hyphens',
        text: 'استخدام الشرطات في الرابط بدلاً من المسافات',
        status: !product.url_path.includes(' ') && !product.url_path.includes('_') ? 'pass' : 'fail'
      });
      
      urlChecks.push({
        id: 'url_lowercase',
        text: 'الرابط بأحرف صغيرة',
        status: product.url_path === product.url_path.toLowerCase() ? 'pass' : 'fail'
      });

      urlChecks.push({
        id: 'url_keywords',
        text: 'الرابط يحتوي على كلمات مفهومة',
        status: !/\d{4,}/.test(product.url_path) && product.url_path.split('-').length >= 2 ? 'pass' : 'warning'
      });
    }
    if (urlChecks.length > 0) {
      categories['هيكل الروابط'] = urlChecks;
    }

    // ===========================================
    // 📝 Content Quality Criteria
    // ===========================================
    const contentChecks = [];
    if (product.description) {
      const cleanDescription = product.description.replace(/<[^>]*>/g, ' ').trim();
      const words = cleanDescription.split(/\s+/).filter(word => word.length > 0);
      
      contentChecks.push({
        id: 'readability',
        text: `قابلية القراءة - متوسط طول الكلمة (${words.length > 0 ? Math.round(cleanDescription.length / words.length) : 0} حرف)`,
        status: words.length > 0 && (cleanDescription.length / words.length) <= 6 ? 'pass' : 'warning'
      });
      
      contentChecks.push({
        id: 'paragraph_structure',
        text: 'تنظيم الفقرات - استخدام عدة فقرات',
        status: (product.description.match(/<p>/g) || []).length >= 2 ? 'pass' : 'fail'
      });
      
      contentChecks.push({
        id: 'heading_structure',
        text: 'استخدام العناوين الفرعية (H2, H3)',
        status: /<h[2-6]>/i.test(product.description) ? 'pass' : 'fail'
      });

      contentChecks.push({
        id: 'list_structure',
        text: 'استخدام القوائم المنظمة (ul, ol)',
        status: /<[uo]l>/i.test(product.description) ? 'pass' : 'warning'
      });

      // فحص التنوع في الكلمات
      const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))];
      const vocabularyRichness = words.length > 0 ? (uniqueWords.length / words.length) : 0;
      
      contentChecks.push({
        id: 'vocabulary_richness',
        text: `تنوع المفردات (${Math.round(vocabularyRichness * 100)}% كلمات فريدة)`,
        status: vocabularyRichness >= 0.6 ? 'pass' : vocabularyRichness >= 0.4 ? 'warning' : 'fail'
      });
    }
    if (contentChecks.length > 0) {
      categories['جودة المحتوى'] = contentChecks;
    }

    // ===========================================
    // ⚙️ Technical SEO Criteria
    // ===========================================
    const technicalChecks = [];
    
    technicalChecks.push({
      id: 'meta_title_length',
      text: `طول Page Title مثالي (${(product.meta_title || '').length}/60 حرف)`,
      status: product.meta_title && product.meta_title.length >= 30 && product.meta_title.length <= 60 ? 'pass' : 'warning'
    });
    
    technicalChecks.push({
      id: 'meta_description_length',
      text: `طول Page Description مثالي (${(product.meta_description || '').length}/150 حرف)`,
      status: product.meta_description && product.meta_description.length >= 100 && product.meta_description.length <= 150 ? 'pass' : 'warning'
    });
    
    // فحص كثافة الكلمة المفتاحية
    if (product.keyword && product.description) {
      const cleanDescription = product.description.replace(/<[^>]*>/g, ' ').toLowerCase();
      const keywordCount = (cleanDescription.match(new RegExp(product.keyword.toLowerCase(), 'g')) || []).length;
      const totalWords = cleanDescription.split(/\s+/).filter(word => word.length > 0).length;
      const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
      
      technicalChecks.push({
        id: 'keyword_density',
        text: `كثافة الكلمة المفتاحية مناسبة (${density.toFixed(1)}%)`,
        status: density >= 1 && density <= 3 ? 'pass' : density > 3 ? 'warning' : 'fail'
      });
    }

    // فحص تنوع استخدام الكلمة المفتاحية
    if (product.keyword) {
      const keywordInTitle = product.name?.toLowerCase().includes(product.keyword.toLowerCase());
      const keywordInMeta = product.meta_title?.toLowerCase().includes(product.keyword.toLowerCase());
      const keywordInDescription = product.meta_description?.toLowerCase().includes(product.keyword.toLowerCase());
      
      const usageCount = [keywordInTitle, keywordInMeta, keywordInDescription].filter(Boolean).length;
      
      technicalChecks.push({
        id: 'keyword_distribution',
        text: `توزيع الكلمة المفتاحية عبر العناصر (${usageCount}/3)`,
        status: usageCount >= 3 ? 'pass' : usageCount >= 2 ? 'warning' : 'fail'
      });
    }

    if (technicalChecks.length > 0) {
      categories['السيو التقني'] = technicalChecks;
    }

    // ===========================================
    // 🎨 User Experience Criteria  
    // ===========================================
    const uxChecks = [];

    // فحص طول اسم المنتج
    if (product.name) {
      uxChecks.push({
        id: 'product_name_length',
        text: `طول اسم المنتج مناسب (${product.name.length} حرف)`,
        status: product.name.length >= 10 && product.name.length <= 60 ? 'pass' : 'warning'
      });
    }

    // فحص وجود call-to-action في الوصف
    if (product.description) {
      const ctaPatterns = ['اشتري', 'احصل', 'اطلب', 'تسوق', 'اكتشف', 'جرب', 'استفد'];
      const hasCTA = ctaPatterns.some(pattern => product.description.toLowerCase().includes(pattern));
      
      uxChecks.push({
        id: 'call_to_action',
        text: 'وجود دعوة واضحة لاتخاذ إجراء',
        status: hasCTA ? 'pass' : 'warning'
      });
    }

    // فحص استخدام الأرقام والإحصائيات
    if (product.description) {
      const hasNumbers = /\d+[%]?|\d+\s*(سنة|شهر|يوم|كيلو|متر|ريال)/.test(product.description);
      
      uxChecks.push({
        id: 'numbers_stats',
        text: 'استخدام الأرقام والإحصائيات',
        status: hasNumbers ? 'pass' : 'warning'
      });
    }

    if (uxChecks.length > 0) {
      categories['تجربة المستخدم'] = uxChecks;
    }

    return categories;
  };

  // Calculate Overall SEO Score
  const calculateOverallScore = (product) => {
    const coreResults = checkCoreCriteria(product);
    const additionalCategories = generateAdditionalCriteria(product);
    
    // حساب نقاط المعايير الإضافية
    let additionalScore = 0;
    let additionalTotal = 0;
    
    Object.values(additionalCategories).forEach(checks => {
      checks.forEach(check => {
        additionalTotal++;
        if (check.status === 'pass') additionalScore += 1;
        else if (check.status === 'warning') additionalScore += 0.5;
      });
    });
    
    // الوزن: 70% للمعايير الأساسية، 30% للإضافية
    const coreWeight = 0.7;
    const additionalWeight = 0.3;
    
    const finalScore = Math.round(
      (coreResults.score * coreWeight) + 
      (additionalTotal > 0 ? (additionalScore / additionalTotal * 100) * additionalWeight : 0)
    );
    
    return {
      score: finalScore,
      coreScore: coreResults.score,
      additionalScore: additionalTotal > 0 ? Math.round(additionalScore / additionalTotal * 100) : 0,
      coreResults,
      categories: additionalCategories
    };
  };

  // ===========================================
  // 🎯 Main Return Object
  // ===========================================
  
  // حساب النتائج
  const seoResults = calculateOverallScore(product);
  
  return {
    // 📊 SEO Analysis Results للاستخدام في EnhancedSEODisplay
    score: seoResults.score,
    coreScore: seoResults.coreScore,
    additionalScore: seoResults.additionalScore,
    categories: seoResults.categories,
    coreResults: seoResults.coreResults,
    
    // 🛠️ Utility Functions
    checkCoreCriteria: () => checkCoreCriteria(product),
    generateAdditionalCriteria: () => generateAdditionalCriteria(product)
  };
};

export default analyzeSEO;