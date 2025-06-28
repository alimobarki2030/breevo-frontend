import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EnhancedRichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'اكتب وصف المنتج هنا...',
  minWords = 120 
}) => {
  const quillRef = useRef(null);

  // Custom toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        'link': function(value) {
          if (value) {
            const href = prompt('أدخل الرابط:');
            if (href) {
              this.quill.format('link', href);
            }
          } else {
            this.quill.format('link', false);
          }
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background',
    'align', 'code-block'
  ];

  // Calculate word count
  const getWordCount = (text) => {
    const plainText = text.replace(/<[^>]*>/g, ' ').trim();
    if (!plainText) return 0;
    return plainText.split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = getWordCount(value);
  const charCount = value.replace(/<[^>]*>/g, '').length;
  const isMinWordsMet = wordCount >= minWords;

  return (
    <div className="enhanced-editor-container">
      {/* Header with stats */}
      <div className="editor-header">
        <div className="editor-title">
          <span className="editor-icon">✍️</span>
          وصف المنتج التفصيلي
          <span className="pro-badge">PRO</span>
        </div>
        <div className="editor-stats">
          <span className={`stat-item ${isMinWordsMet ? 'stat-success' : 'stat-warning'}`}>
            📝 {wordCount} كلمة
          </span>
          <span className="stat-item">
            📊 {charCount} حرف
          </span>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="seo-tips">
        <div className="tip-icon">💡</div>
        <div className="tip-content">
          <strong>نصائح السيو:</strong> استخدم <strong>العناوين الفرعية</strong> لتنظيم المحتوى، 
          أضف <strong>قوائم نقطية</strong> للمميزات، وأدرج <strong>روابط داخلية</strong> للصفحات الأخرى
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="editor-wrapper">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            direction: 'rtl',
            textAlign: 'right'
          }}
        />
      </div>

      {/* Footer with progress */}
      <div className="editor-footer">
        <div className="progress-section">
          <div className="progress-label">
            معيار السيو الأساسي ({minWords}+ كلمة)
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${isMinWordsMet ? 'progress-complete' : 'progress-incomplete'}`}
              style={{ width: `${Math.min((wordCount / minWords) * 100, 100)}%` }}
            ></div>
          </div>
          <div className={`progress-text ${isMinWordsMet ? 'text-success' : 'text-warning'}`}>
            {isMinWordsMet 
              ? '✅ المعيار الأساسي مكتمل!' 
              : `يحتاج ${minWords - wordCount} كلمة إضافية`
            }
          </div>
        </div>
        
        <div className="quick-actions">
          <button 
            className="action-btn"
            onClick={() => {
              const editor = quillRef.current?.getEditor();
              if (editor) {
                editor.insertText(editor.getLength(), '\n\n✨ مميزات المنتج:\n• \n• \n• ');
              }
            }}
          >
            ➕ إضافة قائمة مميزات
          </button>
          <button 
            className="action-btn"
            onClick={() => {
              const editor = quillRef.current?.getEditor();
              if (editor) {
                editor.insertText(editor.getLength(), '\n\n🛍️ طريقة الاستخدام:\n1. \n2. \n3. ');
              }
            }}
          >
            📋 إضافة طريقة استخدام
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .enhanced-editor-container {
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          background: white;
          transition: all 0.3s ease;
        }

        .enhanced-editor-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .editor-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .editor-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 16px;
        }

        .editor-icon {
          font-size: 20px;
        }

        .pro-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .editor-stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.15);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        .stat-success {
          background: rgba(34, 197, 94, 0.2);
        }

        .stat-warning {
          background: rgba(251, 191, 36, 0.2);
        }

        .seo-tips {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .tip-icon {
          font-size: 20px;
        }

        .tip-content {
          color: #92400e;
          font-size: 14px;
          line-height: 1.5;
        }

        .editor-wrapper {
          background: white;
        }

        .editor-footer {
          background: #f9fafb;
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
        }

        .progress-section {
          margin-bottom: 16px;
        }

        .progress-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .progress-complete {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .progress-incomplete {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .progress-text {
          font-size: 13px;
          font-weight: 500;
        }

        .text-success {
          color: #059669;
        }

        .text-warning {
          color: #d97706;
        }

        .quick-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          transform: translateY(-1px);
        }

        /* Quill Editor Custom Styles */
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #fafafa;
        }

        .ql-container.ql-snow {
          border: none;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          min-height: 250px;
        }

        .ql-editor {
          direction: rtl !important;
          text-align: right !important;
          padding: 20px;
          min-height: 250px;
        }

        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
          right: 20px;
          left: auto;
        }

        .ql-snow .ql-tooltip {
          direction: rtl;
        }

        .ql-editor h2 {
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          color: #1f2937;
        }

        .ql-editor h3 {
          color: #374151;
        }

        .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }

        .ql-editor blockquote {
          border-right: 4px solid #3b82f6;
          border-left: none;
          padding: 16px;
          background: #f8fafc;
          margin: 16px 0;
          border-radius: 0 8px 8px 0;
        }

        @media (max-width: 768px) {
          .editor-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .editor-stats {
            justify-content: center;
          }

          .quick-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedRichTextEditor;