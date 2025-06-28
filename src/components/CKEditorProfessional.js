import React, { useRef } from 'react';
import { Bold, Italic, List, Link2, Type, Quote } from 'lucide-react';

const CKEditorProfessional = ({ 
  value = '', 
  onChange, 
  placeholder = 'اكتب وصف المنتج هنا...'
}) => {
  const textareaRef = useRef(null);

  // دوال التنسيق البسيطة
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   before + selectedText + after + 
                   value.substring(end);
    
    onChange(newText);
    
    // العودة للتركيز
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  return (
    <div className="simple-editor">
      
      {/* شريط أدوات بسيط */}
      <div className="toolbar">
        <button
          type="button"
          onClick={() => insertText('**', '**')}
          className="tool-btn"
          title="غامق"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertText('*', '*')}
          className="tool-btn"
          title="مائل"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="separator"></div>
        
        <button
          type="button"
          onClick={() => insertAtCursor('\n## ')}
          className="tool-btn"
          title="عنوان رئيسي"
        >
          <Type className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertAtCursor('\n### ')}
          className="tool-btn"
          title="عنوان فرعي"
        >
          <Type className="w-3 h-3" />
        </button>
        
        <div className="separator"></div>
        
        <button
          type="button"
          onClick={() => insertAtCursor('\n- ')}
          className="tool-btn"
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertText('[', '](https://example.com)')}
          className="tool-btn"
          title="رابط"
        >
          <Link2 className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertAtCursor('\n> ')}
          className="tool-btn"
          title="اقتباس"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      {/* المحرر */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="editor-textarea"
        dir="rtl"
      />
      
      {/* أزرار سريعة */}
      <div className="quick-buttons">
        <button
          type="button"
          onClick={() => insertAtCursor('\n\n## ✨ مميزات المنتج:\n- ميزة رائعة\n- ميزة مذهلة\n- ميزة استثنائية\n')}
          className="quick-btn"
        >
          ✨ قائمة مميزات
        </button>
        
        <button
          type="button"
          onClick={() => insertAtCursor('\n\n## 🛍️ طريقة الاستخدام:\n1. الخطوة الأولى\n2. الخطوة الثانية\n3. الخطوة الثالثة\n')}
          className="quick-btn"
        >
          📋 دليل الاستخدام
        </button>
        
        <button
          type="button"
          onClick={() => insertAtCursor('\n\nتصفح [منتجاتنا الأخرى](/products) أو اقرأ [تقييمات العملاء](/reviews).\n')}
          className="quick-btn"
        >
          🔗 روابط داخلية
        </button>
      </div>

      <style jsx>{`
        .simple-editor {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          overflow: hidden;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .tool-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
        }

        .tool-btn:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .separator {
          width: 1px;
          height: 20px;
          background: #d1d5db;
          margin: 0 4px;
        }

        .editor-textarea {
          width: 100%;
          min-height: 300px;
          padding: 16px;
          border: none;
          outline: none;
          resize: vertical;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          background: white;
          direction: rtl;
          text-align: right;
        }

        .editor-textarea::placeholder {
          color: #9ca3af;
          font-style: italic;
        }

        .quick-buttons {
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .quick-btn {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .quick-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .toolbar, .quick-buttons {
            justify-content: center;
          }
          
          .quick-btn {
            font-size: 11px;
            padding: 5px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default CKEditorProfessional;