import {
  descriptionPrompt,
  seoTitlePrompt,
  metaDescriptionPrompt,
  seoAltPrompt
} from "./generationPrompts";

import { generateProductSEO } from "./generateProductSEO";

export const generateAllFields = async (product) => {
  const description = await generateProductSEO(descriptionPrompt(product));
  const meta_title = await generateProductSEO(seoTitlePrompt(product)); // ✅ هذا هو المهم
  const meta_description = await generateProductSEO(metaDescriptionPrompt(product));
  const imageAlt = await generateProductSEO(seoAltPrompt(product));

  return {
    description,
    meta_title,
    meta_description,
    imageAlt,
  };
};
