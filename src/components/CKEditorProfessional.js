import React, { useRef } from 'react';
import { Bold, Italic, List, Link2, Type, Quote } from 'lucide-react';

const CKEditorProfessional = ({ 
  value = '', 
  onChange, 
  placeholder = 'اكتب وصف المنتج هنا...'
}) => {
  const textareaRef = useRef(null);

  // دوال التنسيق البسيطة - تعطي HTML صحيح
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
          onClick={() => insertText('<strong>', '</strong>')}
          className="tool-btn"
          title="غامق"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertText('<em>', '</em>')}
          className="tool-btn"
          title="مائل"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="separator"></div>
        
        <button
          type="button"
          onClick={() => insertAtCursor('<h2></h2>')}
          className="tool-btn"
          title="عنوان رئيسي"
        >
          <Type className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertAtCursor('<h3></h3>')}
          className="tool-btn"
          title="عنوان فرعي"
        >
          <Type className="w-3 h-3" />
        </button>
        
        <div className="separator"></div>
        
        <button
          type="button"
          onClick={() => insertAtCursor('<ul><li></li><li></li><li></li></ul>')}
          className="tool-btn"
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertText('<a href="">', '</a>')}
          className="tool-btn"
          title="رابط"
        >
          <Link2 className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => insertAtCursor('<blockquote><p></p></blockquote>')}
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

        .editor-textarea:focus {
          box-shadow: inset 0 0 0 2px #3b82f6;
        }

        @media (max-width: 768px) {
          .toolbar {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CKEditorProfessional;