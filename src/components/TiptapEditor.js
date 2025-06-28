import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  Unlink,
  Code,
  Quote,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';

const TiptapEditor = ({ value = '', onChange, placeholder = '', minWords = 120 }) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-6',
        style: 'direction: rtl; text-align: right;'
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setShowLinkDialog(true);
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;

    // Empty
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkDialog(false);
      return;
    }

    // Update link
    let finalUrl = linkUrl;
    if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://') && !linkUrl.startsWith('/')) {
      finalUrl = 'https://' + linkUrl;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    setShowLinkDialog(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  // Quick insert functions
  const insertFeaturesList = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent(`
      <h3>✨ مميزات المنتج:</h3>
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    `).run();
  }, [editor]);

  const insertUsageGuide = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent(`
      <h3>🛍️ طريقة الاستخدام:</h3>
      <ol>
        <li></li>
        <li></li>
        <li></li>
      </ol>
    `).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${
        active 
          ? 'bg-blue-500 text-white shadow-md border border-blue-600' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {children}
    </button>
  );

  // Calculate word count
  const text = editor.getText();
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const isMinWordsMet = wordCount >= minWords;
  const progressPercentage = Math.min((wordCount / minWords) * 100, 100);

  return (
    <div className="professional-editor-container">
      {/* Header with Professional Design */}
      <div className="editor-header">
        <div className="header-content">
          <div className="title-section">
            <div className="editor-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="editor-title">محرر المحتوى الاحترافي</h3>
              <div className="editor-subtitle">
                <span className="pro-badge">PRO</span>
                <span className="separator">•</span>
                <span>مخصص لمنصات التجارة الإلكترونية</span>
              </div>
            </div>
          </div>
          
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-number">{wordCount}</div>
                <div className="stat-label">كلمة</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{charCount}</div>
                <div className="stat-label">حرف</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-title">معيار السيو الأساسي</span>
            <span className={`progress-status ${isMinWordsMet ? 'status-complete' : 'status-pending'}`}>
              {isMinWordsMet ? '✅ مكتمل' : `${minWords - wordCount} كلمة متبقية`}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${isMinWordsMet ? 'fill-complete' : 'fill-pending'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* SEO Tips Banner */}
      <div className="seo-banner">
        <div className="banner-icon">
          <Target className="w-5 h-5" />
        </div>
        <div className="banner-content">
          <strong>💡 نصائح السيو المتقدمة:</strong> استخدم <strong>H2</strong> و <strong>H3</strong> لتنظيم المحتوى، 
          أضف <strong>قوائم نقطية</strong> للمميزات، وأدرج <strong>روابط داخلية 🔗</strong> للصفحات الأخرى
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="enhanced-toolbar">
        <div className="toolbar-group">
          <span className="group-label">التنسيق</span>
          <div className="button-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="غامق (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="مائل (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              title="كود"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        <div className="toolbar-group">
          <span className="group-label">العناوين</span>
          <div className="button-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="عنوان رئيسي (H2)"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
              title="عنوان فرعي (H3)"
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        <div className="toolbar-group">
          <span className="group-label">القوائم</span>
          <div className="button-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="قائمة نقطية"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="قائمة مرقمة"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        <div className="toolbar-group">
          <span className="group-label">إضافات</span>
          <div className="button-group">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="اقتباس"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={setLink}
              active={editor.isActive('link')}
              title="إضافة رابط (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={unsetLink}
              disabled={!editor.isActive('link')}
              title="إزالة الرابط"
            >
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <button onClick={insertFeaturesList} className="quick-btn features-btn">
          <Sparkles className="w-4 h-4" />
          ➕ إضافة قائمة مميزات
        </button>
        <button onClick={insertUsageGuide} className="quick-btn usage-btn">
          <BarChart3 className="w-4 h-4" />
          📋 إضافة طريقة استخدام
        </button>
      </div>

      {/* Editor Content */}
      <div className="editor-content-wrapper">
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          className="editor-content"
        />
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="link-dialog-overlay">
          <div className="link-dialog">
            <h3 className="dialog-title">إضافة رابط داخلي</h3>
            
            <div className="input-section">
              <label className="input-label">
                عنوان الرابط (URL)
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com أو /products"
                className="url-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLinkSubmit();
                  } else if (e.key === 'Escape') {
                    setShowLinkDialog(false);
                  }
                }}
              />
            </div>

            <div className="examples-section">
              <h4 className="examples-title">💡 أمثلة على الروابط الداخلية المفيدة:</h4>
              <div className="examples-list">
                <div>• <code>/products</code> - صفحة المنتجات الأخرى</div>
                <div>• <code>/about</code> - من نحن</div>
                <div>• <code>/contact</code> - اتصل بنا</div>
                <div>• <code>/reviews</code> - مراجعات العملاء</div>
                <div>• <code>/shipping</code> - الشحن والتوصيل</div>
              </div>
            </div>

            <div className="dialog-actions">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="btn-cancel"
              >
                إلغاء
              </button>
              <button
                onClick={handleLinkSubmit}
                className="btn-primary"
              >
                {linkUrl === '' ? 'إزالة الرابط' : 'إضافة الرابط'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Styles */}
      <style jsx>{`
        .professional-editor-container {
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          background: white;
          transition: all 0.3s ease;
        }

        .professional-editor-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        /* Enhanced Header */
        .editor-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 24px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .editor-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .editor-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .editor-subtitle {
          font-size: 14px;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .pro-badge {
          background: rgba(255, 255, 255, 0.25);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .separator {
          opacity: 0.6;
        }

        .stats-section {
          display: flex;
          gap: 16px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.15);
          padding: 12px 16px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 80px;
        }

        .stat-icon {
          font-size: 18px;
        }

        .stat-number {
          font-size: 18px;
          font-weight: 700;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.8;
        }

        /* Progress Section */
        .progress-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-title {
          font-size: 14px;
          font-weight: 600;
        }

        .progress-status {
          font-size: 13px;
          font-weight: 500;
        }

        .status-complete {
          color: #10b981;
        }

        .status-pending {
          color: #f59e0b;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .fill-complete {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .fill-pending {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        /* SEO Banner */
        .seo-banner {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .banner-icon {
          color: #d97706;
        }

        .banner-content {
          color: #92400e;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Enhanced Toolbar */
        .enhanced-toolbar {
          background: #fafafa;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }

        .toolbar-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .group-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .button-group {
          display: flex;
          gap: 6px;
        }

        /* Quick Actions */
        .quick-actions {
          background: #f9fafb;
          padding: 12px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .quick-btn {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .quick-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .features-btn:hover {
          background: #ecfdf5;
          border-color: #10b981;
          color: #059669;
        }

        .usage-btn:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #2563eb;
        }

        /* Editor Content */
        .editor-content-wrapper {
          background: white;
          min-height: 300px;
        }

        .editor-content {
          min-height: 300px;
        }

        /* Link Dialog */
        .link-dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .link-dialog {
          background: white;
          border-radius: 20px;
          padding: 24px;
          width: 480px;
          max-width: 90vw;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .dialog-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 20px 0;
        }

        .input-section {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .url-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .url-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .examples-section {
          background: #fef3c7;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .examples-title {
          font-size: 14px;
          font-weight: 600;
          color: #92400e;
          margin: 0 0 12px 0;
        }

        .examples-list {
          font-size: 13px;
          color: #78350f;
          line-height: 1.6;
        }

        .examples-list code {
          background: rgba(120, 53, 15, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
        }

        .dialog-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .stats-section {
            justify-content: center;
          }

          .enhanced-toolbar {
            flex-direction: column;
            gap: 16px;
          }

          .toolbar-group {
            align-items: center;
          }

          .quick-actions {
            justify-content: center;
          }
        }
      `}</style>

      {/* Custom ProseMirror Styles */}
      <style jsx global>{`
        .ProseMirror {
          direction: rtl !important;
          text-align: right !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.8;
          outline: none;
          min-height: 300px;
          padding: 24px;
          font-size: 16px;
        }
        
        .ProseMirror h2 {
          font-size: 1.6em;
          font-weight: 700;
          margin: 2em 0 1em 0;
          color: #1f2937;
          border-bottom: 3px solid #e5e7eb;
          padding-bottom: 0.5em;
        }
        
        .ProseMirror h3 {
          font-size: 1.3em;
          font-weight: 600;
          margin: 1.5em 0 0.75em 0;
          color: #374151;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          margin: 1.5em 0;
          padding-right: 2em;
        }
        
        .ProseMirror li {
          margin: 0.75em 0;
          line-height: 1.8;
        }
        
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          padding: 3px 6px;
          border-radius: 6px;
          text-decoration: none;
        }
        
        .ProseMirror blockquote {
          border-right: 4px solid #3b82f6;
          margin: 2em 0;
          padding: 1em 1.5em;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          font-style: italic;
          color: #475569;
          border-radius: 0 12px 12px 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .ProseMirror code {
          background: #f1f5f9;
          color: #1e293b;
          padding: 3px 6px;
          border-radius: 6px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.9em;
          border: 1px solid #e2e8f0;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: right;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }

        .ProseMirror p {
          margin: 1em 0;
        }

        .ProseMirror strong {
          font-weight: 600;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;