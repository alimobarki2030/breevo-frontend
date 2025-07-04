import {
  descriptionPrompt,
  seoTitlePrompt,
  metaDescriptionPrompt,
  seoAltPrompt,
} from "./generationPrompts";


export const generateSingleField = aRefreshCw (fieldType, product) => {
  const fieldPromptMap = {
    description: descriptionPrompt,
    seo_title: seoTitlePrompt,
    meta_title: seoTitlePrompt, // ✅ يدعم توليد meta_title بنفس برومبت seo_title
    meta_description: metaDescriptionPrompt,
    imageAlt: seoAltPrompt,
  };

  const promptGenerator = fieldPromptMap[fieldType];
  if (!promptGenerator) throw new Error("لا يوجد برومبت لهذا الحقل");

  const prompt = promptGenerator(product);
  return result;
};
