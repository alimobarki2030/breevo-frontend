export default function analyzeSEO(product) {
  const {
    name = "",
    description = "",
    keyword = "",
    meta_title = "",
    meta_description = "",
    imageAlt = "",
  } = product;

  const checks = [];
  const keywordLower = keyword.trim().toLowerCase();
  const descLower = description.toLowerCase();
  const titleLower = name.toLowerCase();

  const isValidKeyword = keywordLower.length > 1;
  const isValidDescription = description.trim().length > 0;
  const isValidTitle = name.trim().length > 0;
  const isValidMetaTitle = meta_title.trim().length > 0;
  const isValidMetaDesc = meta_description.trim().length > 0;
  const isValidAlt = imageAlt.trim().length > 0;

  const firstWords = description.split(" ").slice(0, 25).join(" ").toLowerCase();

  checks.push({
    text: "أضف الكلمة المفتاحية في بداية المحتوى.",
    status: isValidKeyword && isValidDescription && firstWords.includes(keywordLower) ? "pass" : "fail",
  });

  checks.push({
    text: "استخدم الكلمة المفتاحية داخل المحتوى.",
    status: isValidKeyword && isValidDescription && descLower.includes(keywordLower) ? "pass" : "fail",
  });

  checks.push({
    text: "الوصف يحتوي على أكثر من 100 كلمة.",
    status: isValidDescription && description.split(" ").length > 100 ? "pass" : "fail",
  });

  checks.push({
    text: "العنوان يحتوي على الكلمة المفتاحية.",
    status: isValidKeyword && isValidTitle && titleLower.includes(keywordLower) ? "pass" : "fail",
  });

  checks.push({
    text: "وصف الميتا يحتوي على الكلمة المفتاحية.",
    status: isValidKeyword && isValidMetaDesc && meta_description.toLowerCase().includes(keywordLower) ? "pass" : "fail",
  });

  checks.push({
    text: "عنوان السيو يحتوي على الكلمة المفتاحية.",
    status: isValidKeyword && isValidMetaTitle && meta_title.toLowerCase().includes(keywordLower) ? "pass" : "fail",
  });

  checks.push({
    text: "العنوان لا يتجاوز 60 حرفًا.",
    status: isValidTitle && name.length <= 60 ? "pass" : "fail",
  });

  checks.push({
    text: "وصف الميتا لا يتجاوز 150 حرفًا.",
    status: isValidMetaDesc && meta_description.length <= 150 ? "pass" : "fail",
  });

  checks.push({
    text: "عنوان السيو لا يتجاوز 60 حرفًا.",
    status: isValidMetaTitle && meta_title.length <= 60 ? "pass" : "fail",
  });

  checks.push({
    text: "الصورة تحتوي على ALT فيه الكلمة المفتاحية.",
    status: isValidKeyword && isValidAlt && imageAlt.toLowerCase().includes(keywordLower) ? "pass" : "fail",
  });

  // مؤشرات إضافية تعزز تجربة العميل
  const ctaKeywords = ["اطلب", "اشترِ", "تسوق", "احصل", "جرّب", "لا تفوت", "سارع", "اختر", "استمتع"];
  const hasCTA = ctaKeywords.some((kw) => descLower.includes(kw));
  checks.push({
    text: "الوصف يحتوي على دعوة واضحة لاتخاذ إجراء (CTA).",
    status: hasCTA ? "pass" : "fail",
  });

  checks.push({
    text: "نغمة الكتابة متوافقة مع الجمهور المستهدف.",
    status: product.tone && product.audience_gender && product.tone.toLowerCase().includes("ناعمة") === (product.audience_gender === "أنثى") ? "pass" : "fail",
  });

  checks.push({
    text: "العنوان يحتوي على رقم أو وحدة قياس.",
    status: /\d+/.test(name) ? "pass" : "fail",
  });

  return {
    score: checks.filter((c) => c.status === "pass").length,
    checks,
  };
}