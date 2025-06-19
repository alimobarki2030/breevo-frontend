// utils/errorHandler.js
import toast from "react-hot-toast";

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

export const handleAPIError = (error, customMessage = null) => {
  console.error("API Error:", error);
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        toast.error(customMessage || "بيانات غير صحيحة");
        break;
      case 401:
        toast.error("انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى");
        localStorage.clear();
        window.location.href = "/manual-login";
        break;
      case 403:
        toast.error("ليس لديك صلاحية للقيام بهذا الإجراء");
        break;
      case 404:
        toast.error("العنصر المطلوب غير موجود");
        break;
      case 500:
        toast.error("خطأ في السيرفر. الرجاء المحاولة لاحقاً");
        break;
      default:
        toast.error(customMessage || error.message || "حدث خطأ غير متوقع");
    }
  } else if (error.name === "TypeError" && error.message.includes("fetch")) {
    toast.error("فشل في الاتصال بالسيرفر. تحقق من اتصال الإنترنت");
  } else {
    toast.error(customMessage || "حدث خطأ غير متوقع");
  }
};

export const apiRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.detail || errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(error.message || "فشل في تنفيذ الطلب");
  }
};