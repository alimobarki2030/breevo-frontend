// تنفيذ التوليد الذكي مع الخيارات المحددة - يستخدم البرومبت المخصص فقط
const executeSmartGeneration = useCallback(async () => {
  setGenerating(true);
  setShowGenerateModal(false);
  setErrors(prev => ({ ...prev, generate: null }));

  try {
    toast.loading("🧠 جاري التوليد الذكي مع خياراتك...", { id: 'generating' });

    if (userPlan === "free") {
      incrementTrialUsage();
    }

    // تحديد الكلمة المفتاحية حسب اختيار المستخدم
    let finalKeyword = "";
    if (generateOptions.keywordAction === "use_existing") {
      finalKeyword = generateOptions.customKeyword.trim();
    } else {
      // توليد كلمة مفتاحية جديدة باستخدام البرومبت المخصص
      try {
        const keywordResult = await generateWithCustomPrompt({
          product_name: product.name,
          task_type: "keyword_only",
          audience: generateOptions.audience,
          tone: generateOptions.tone
        });
        
        // استخراج الكلمة المفتاحية من النتيجة
        const cleanKeyword = keywordResult.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
        finalKeyword = cleanKeyword.split('\n')[0].replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\w]/g, '').trim();
      } catch (error) {
        console.error("Keyword generation failed:", error);
        finalKeyword = product.name; // استخدام اسم المنتج كـ fallback
      }
    }

    // تحديد اسم المنتج حسب اختيار المستخدم
    let finalProductName = product.name;
    if (generateOptions.productNameAction === "add_keyword") {
      finalProductName = `${product.name} ${finalKeyword}`;
    } else if (generateOptions.productNameAction === "regenerate") {
      try {
        const nameResult = await generateWithCustomPrompt({
          product_name: product.name,
          keyword: finalKeyword,
          task_type: "product_name_only",
          audience: generateOptions.audience,
          tone: generateOptions.tone
        });
        
        const cleanName = nameResult.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
        finalProductName = cleanName.split('\n')[0].trim();
      } catch (error) {
        console.error("Product name generation failed:", error);
        finalProductName = `${product.name} ${finalKeyword}`; // fallback
      }
    }

    // **التوليد الرئيسي باستخدام البرومبت المخصص**
    const generated = await generateWithCustomPrompt({
      product_name: finalProductName,
      keyword: finalKeyword,
      audience: generateOptions.audience,
      tone: generateOptions.tone,
      task_type: "complete_seo" // إشارة للبرومبت أن هذا توليد شامل
    });
    
    // تنظيف النص المُولد قبل تحليل JSON
    let cleanedGenerated = generated
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // إزالة أحرف التحكم
      .replace(/\n/g, '\\n') // تحويل أسطر جديدة لصيغة JSON صالحة
      .replace(/\r/g, '\\r') // تحويل carriage returns
      .replace(/\t/g, '\\t') // تحويل tabs
      .trim();
    
    const jsonMatch = cleanedGenerated.match(/{[\s\S]*}/);
    
    if (!jsonMatch) {
      throw new Error("فشل في توليد المحتوى - لم يتم العثور على JSON صالح");
    }

    let fields;
    try {
      fields = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Generated content:", generated);
      console.error("Cleaned content:", cleanedGenerated);
      throw new Error("فشل في تحليل المحتوى المُولد - يرجى المحاولة مرة أخرى");
    }

    const processedFields = {
      keyword: finalKeyword,
      name: finalProductName,
      description: fields.description || "",
      meta_title: truncateText(fields.meta_title, FIELD_LIMITS.meta_title),
      meta_description: truncateText(fields.meta_description, FIELD_LIMITS.meta_description),
      url_path: fields.url_path?.trim() || "",
      imageAlt: fields.imageAlt?.trim() || ""
    };

    setProduct(prev => ({
      ...prev,
      ...processedFields,
    }));

    toast.success("🎉 تم إنشاء محتوى احترافي بالبرومبت المخصص!", { id: 'generating' });
    
    if (userPlan === "free") {
      const remaining = trialUsage.limit - trialUsage.used - 1;
      toast.success(`✨ ${remaining} توليدة مجانية متبقية هذا الشهر`, { duration: 4000 });
    }

  } catch (error) {
    console.error("Error generating fields:", error);
    
    let errorMessage = "فشل في التوليد الذكي. حاول مرة أخرى.";
    
    if (error.message.includes("JSON")) {
      errorMessage = "خطأ في تحليل المحتوى المُولد. يرجى المحاولة مرة أخرى.";
    } else if (error.message.includes("فشل في توليد المحتوى")) {
      errorMessage = "لم يتم توليد محتوى صالح. تأكد من صحة اسم المنتج والمحاولة مرة أخرى.";
    } else if (error.name === "TypeError" || error.message.includes("fetch")) {
      errorMessage = "مشكلة في الاتصال. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.";
    }
    
    toast.error("❌ " + errorMessage, { id: 'generating' });
    setErrors(prev => ({ ...prev, generate: errorMessage }));
  } finally {
    setGenerating(false);
  }
}, [userPlan, trialUsage.used, trialUsage.limit, product.name, generateOptions, checkTrialAccess]);

// التوليد لحقل واحد - يستخدم البرومبت المخصص أيضاً
const handleGenerateField = useCallback(async (fieldType) => {
  setFieldLoading(fieldType);
  setErrors(prev => ({ ...prev, [fieldType]: null }));

  try {
    // استخدام البرومبت المخصص لتوليد حقل واحد
    const response = await generateWithCustomPrompt({
      product_name: product.name,
      keyword: product.keyword || '',
      field_type: fieldType, // إخبار البرومبت أي حقل نريد توليده
      audience: generateOptions.audience,
      tone: generateOptions.tone,
      task_type: "single_field"
    });
    
    let value = response.trim();

    // تنظيف القيمة
    value = value.replace(/^["']|["']$/g, '');
    value = value.replace(/^`+|`+$/g, '');
    value = value.split('\n')[0].trim(); // أخذ السطر الأول فقط

    // تطبيق حدود الأحرف
    if (fieldType === "meta_title") {
      value = truncateText(value, FIELD_LIMITS.meta_title);
    } else if (fieldType === "meta_description") {
      value = truncateText(value, FIELD_LIMITS.meta_description);
    }

    setProduct(prev => ({
      ...prev,
      [fieldType]: value,
    }));

    const fieldLabels = {
      keyword: 'الكلمة المفتاحية',
      description: 'الوصف',
      meta_title: 'Page Title',
      meta_description: 'Page Description',
      url_path: 'مسار الرابط',
      imageAlt: 'النص البديل للصورة'
    };

    toast.success(`تم التوليد الذكي لـ${fieldLabels[fieldType]} بالبرومبت المخصص! 🎯`);

  } catch (error) {
    console.error(`Error generating ${fieldType}:`, error);
    const errorMessage = error?.response?.data?.message || error?.message || `فشل في التوليد الذكي لـ${fieldType}`;
    setErrors(prev => ({ ...prev, [fieldType]: errorMessage }));
    toast.error("❌ " + errorMessage);
  } finally {
    setFieldLoading("");
  }
}, [product.name, product.keyword, generateOptions]);

// دالة للتوليد باستخدام البرومبت المخصص - محدثة
const generateWithCustomPrompt = async (variables) => {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("OpenAI API Key غير موجود في متغيرات البيئة");
  }

  try {
    // استخدام API الخاص بالبرومبتات المخصصة
    const response = await fetch(`https://api.openai.com/v1/prompts/${CUSTOM_PROMPT_CONFIG.promptId}/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variables: variables
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI Custom Prompt Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error calling OpenAI Custom Prompt:', error);
    
    // Fallback: إذا فشل البرومبت المخصص، استخدم الطريقة العادية
    console.log('Custom Prompt failed, falling back to regular Chat Completions...');
    return await generateWithFallback(variables);
  }
};

// Fallback function - مبسطة للحالات الطارئة فقط
const generateWithFallback = async (variables) => {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "أنت خبير كتابة محتوى وتسويق إلكتروني محترف للسوق العربي."
        },
        {
          role: "user",
          content: `اكتب محتوى SEO شامل لهذا المنتج:

المنتج: ${variables.product_name}
الكلمة المفتاحية: ${variables.keyword || ''}
الجمهور: ${variables.audience || 'العملاء العرب'}
النبرة: ${variables.tone || 'احترافية'}

أعد JSON فقط:
{
  "description": "الوصف HTML",
  "meta_title": "عنوان الصفحة", 
  "meta_description": "وصف الميتا",
  "url_path": "short-url-path",
  "imageAlt": "النص البديل للصورة"
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error('Fallback API also failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};