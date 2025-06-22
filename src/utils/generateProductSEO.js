// src/utils/generateProductSEO.js

export const generateProductSEO = async (prompt) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("فشل في الاتصال بسيرفر الذكاء الاصطناعي");
    }

    const data = await response.json();
    return data.text?.trim() || ""; // يرجع النص الناتج من الذكاء
  } catch (error) {
    console.error("❌ Error in generateProductSEO:", error);
    throw error;
  }
};
