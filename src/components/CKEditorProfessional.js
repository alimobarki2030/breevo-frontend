import React, { useState, useEffect, useRef } from 'react';

const CKEditorProfessional = ({ 
  value = '', 
  onChange, 
  placeholder = 'اكتب وصف المنتج هنا...'
}) => {
  const editorRef = useRef();
  const [editorInstance, setEditorInstance] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Calculate word count
  const calculateWordCount = (text) => {
    const plainText = text.replace(/<[^>]*>/g, ' ').trim();
    if (!plainText) return 0;
    return plainText.split(/\s+/).filter(word => word.length > 0).length;
  };

  useEffect(() => {
    // Load CKEditor 5 from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js';
    script.async = true;
    
    script.onload = () => {
      if (window.ClassicEditor && editorRef.current) {
        window.ClassicEditor
          .create(editorRef.current, {
            language: 'ar',
            toolbar: {
              items: [
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                '|',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'blockQuote',
                'insertTable',
                '|',
                'undo',
                'redo'
              ],
              shouldNotGroupWhenFull: true
            },
            // RTL interface configuration
            ui: {
              language: 'ar'
            },
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading2', view: 'h2', title: 'عنوان رئيسي', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'عنوان فرعي', class: 'ck-heading_heading3' }
              ]
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
              ]
            },
            placeholder: placeholder,
            // RTL support
            content: {
              styles: [
                {
                  name: 'Arabic text',
                  element: 'p',
                  classes: ['rtl-content']
                }
              ]
            }
          })
          .then(editor => {
            setEditorInstance(editor);
            setIsReady(true);
            
            // Set initial content
            if (value) {
              editor.setData(value);
            }
            
            // Listen for changes
            editor.model.document.on('change:data', () => {
              const data = editor.getData();
              const words = calculateWordCount(data);
              const chars = data.replace(/<[^>]*>/g, '').length;
              
              setWordCount(words);
              setCharCount(chars);
              onChange(data);
            });

            // Set RTL direction
            editor.editing.view.change(writer => {
              writer.setAttribute('dir', 'rtl', editor.editing.view.document.getRoot());
            });
          })
          .catch(error => {
            console.error('CKEditor initialization error:', error);
          });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
      // Clean up script
      const existingScript = document.querySelector('script[src*="ckeditor"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorInstance && isReady && editorInstance.getData() !== value) {
      editorInstance.setData(value || '');
    }
  }, [value, editorInstance, isReady]);

  // Quick insert functions
  const insertFeaturesList = () => {
    if (editorInstance) {
      const content = `
        <h3>✨ مميزات المنتج:</h3>
        <ul>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
        </ul>
      `;
      editorInstance.model.change(writer => {
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        const fragment = editorInstance.data.htmlProcessor.toView(content);
        const modelFragment = editorInstance.data.toModel(fragment);
        editorInstance.model.insertContent(modelFragment, insertPosition);
      });
    }
  };

  const insertUsageGuide = () => {
    if (editorInstance) {
      const content = `
        <h3>🛍️ طريقة الاستخدام:</h3>
        <ol>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
        </ol>
      `;
      editorInstance.model.change(writer => {
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        const fragment = editorInstance.data.htmlProcessor.toView(content);
        const modelFragment = editorInstance.data.toModel(fragment);
        editorInstance.model.insertContent(modelFragment, insertPosition);
      });
    }
  };

  const insertInternalLink = () => {
    if (editorInstance) {
      const url = prompt('أدخل رابط داخلي (مثل: /products، /about)');
      if (url) {
        const linkText = prompt('نص الرابط') || url;
        editorInstance.model.change(writer => {
          const insertPosition = editorInstance.model.document.selection.getFirstPosition();
          const linkElement = writer.createElement('paragraph');
          const linkContent = writer.createText(linkText, { linkHref: url });
          writer.append(linkContent, linkElement);
          editorInstance.model.insertContent(linkElement, insertPosition);
        });
      }
    }
  };

  return (
    <div className="ckeditor-professional-container">
      {/* Clean Header */}
      <div className="editor-header">
        <div className="header-title">
          <span className="editor-icon">✍️</span>
          <span>وصف المنتج</span>
        </div>
        <div className="stats">
          <span className="stat">{wordCount} كلمة</span>
          <span className="stat">{charCount} حرف</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={insertFeaturesList} className="action-btn">
          ➕ قائمة مميزات
        </button>
        <button onClick={insertUsageGuide} className="action-btn">
          📋 طريقة استخدام
        </button>
        <button onClick={insertInternalLink} className="action-btn">
          🔗 رابط داخلي
        </button>
      </div>

      {/* CKEditor Container */}
      <div className="editor-container">
        <div ref={editorRef}></div>
      </div>

      {/* Loading indicator */}
      {!isReady && (
        <div className="loading">
          <div className="spinner"></div>
          <span>جاري تحميل المحرر...</span>
        </div>
      )}

      <style jsx>{`
        .ckeditor-professional-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .editor-header {
          background: #f8f9fa;
          padding: 12px 16px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #495057;
        }

        .editor-icon {
          font-size: 18px;
        }

        .stats {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #6c757d;
        }

        .stat {
          background: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .quick-actions {
          background: #f8f9fa;
          padding: 8px 16px;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 13px;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .editor-container {
          min-height: 300px;
          position: relative;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px;
          color: #6c757d;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .editor-header {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }

          .stats {
            justify-content: center;
          }

          .quick-actions {
            justify-content: center;
          }
        }
      `}</style>

      {/* CKEditor 5 Custom Styles */}
      <style jsx global>{`
        .ck.ck-editor {
          border: none !important;
        }

        .ck.ck-toolbar {
          border: none !important;
          border-bottom: 1px solid #dee2e6 !important;
          background: #f8f9fa !important;
          border-radius: 0 !important;
        }

        .ck.ck-content {
          border: none !important;
          padding: 20px !important;
          min-height: 250px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          direction: rtl !important;
          text-align: right !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        }

        .ck.ck-content h2 {
          font-size: 1.5em !important;
          font-weight: 600 !important;
          color: #212529 !important;
          margin: 1.5em 0 0.5em 0 !important;
          border-bottom: 2px solid #dee2e6 !important;
          padding-bottom: 0.3em !important;
        }

        .ck.ck-content h3 {
          font-size: 1.25em !important;
          font-weight: 600 !important;
          color: #495057 !important;
          margin: 1.25em 0 0.5em 0 !important;
        }

        .ck.ck-content ul, .ck.ck-content ol {
          margin: 1em 0 !important;
          padding-right: 2em !important;
        }

        .ck.ck-content li {
          margin: 0.5em 0 !important;
        }

        .ck.ck-content a {
          color: #007bff !important;
          text-decoration: underline !important;
        }

        .ck.ck-content a:hover {
          color: #0056b3 !important;
          text-decoration: none !important;
        }

        .ck.ck-content blockquote {
          border-right: 4px solid #007bff !important;
          border-left: none !important;
          margin: 1em 0 !important;
          padding: 0.5em 1em !important;
          background: #f8f9fa !important;
          font-style: italic !important;
          border-radius: 0 4px 4px 0 !important;
        }

        .ck.ck-content table {
          border-collapse: collapse !important;
          margin: 1em 0 !important;
          width: 100% !important;
        }

        .ck.ck-content table td, .ck.ck-content table th {
          border: 1px solid #dee2e6 !important;
          padding: 8px 12px !important;
          text-align: right !important;
        }

        .ck.ck-content table th {
          background: #f8f9fa !important;
          font-weight: 600 !important;
        }

        /* Placeholder styling */
        .ck.ck-content.ck-placeholder::before {
          color: #6c757d !important;
          right: 20px !important;
          left: auto !important;
          font-style: italic !important;
        }

        /* Toolbar styling - RTL direction */
        .ck.ck-toolbar .ck-toolbar__items {
          direction: rtl !important;
          justify-content: flex-start !important;
        }

        .ck.ck-toolbar {
          direction: rtl !important;
          text-align: right !important;
        }

        /* Toolbar groups alignment */
        .ck.ck-toolbar .ck-toolbar__line {
          direction: rtl !important;
        }

        /* Dropdown menus RTL */
        .ck.ck-dropdown__panel {
          direction: rtl !important;
          text-align: right !important;
        }

        .ck.ck-button {
          border-radius: 4px !important;
        }

        .ck.ck-button:hover {
          background: #e9ecef !important;
        }

        .ck.ck-button.ck-on {
          background: #007bff !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default CKEditorProfessional;