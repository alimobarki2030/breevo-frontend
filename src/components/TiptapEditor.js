import React, { useCallback, useState, useEffect } from 'react';
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
  Quote
} from 'lucide-react';

const TiptapEditor = ({ value = '', onChange, placeholder = '' }) => {
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
        style: 'direction: rtl; text-align: right;'
      },
    },
  });

  // 🔧 الإصلاح: مراقبة تغييرات value من الخارج
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // تجنب التحديث إذا كان المستخدم يكتب حالياً
      if (!editor.isFocused) {
        editor.commands.setContent(value, false);
      }
    }
  }, [editor, value]);

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

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        active 
          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
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

  return (
    <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Text Formatting */}
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

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Headings */}
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

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Lists */}
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

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Quote */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="اقتباس"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Links */}
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

        {/* SEO Tips */}
        <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
          <strong>💡 نصائح السيو:</strong> استخدم <strong>H2</strong> و <strong>H3</strong> لتنظيم المحتوى، 
          أضف <strong>قوائم نقطية</strong> للمميزات، وأدرج <strong>روابط داخلية 🔗</strong> للصفحات الأخرى
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
        className="min-h-[200px]"
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">إضافة رابط</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الرابط (URL)
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com أو /products"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLinkSubmit();
                  } else if (e.key === 'Escape') {
                    setShowLinkDialog(false);
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                سيتم فتح الرابط في نافذة جديدة تلقائياً
              </p>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 أمثلة على الروابط الداخلية المفيدة:</h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>• <code>/products</code> - صفحة المنتجات الأخرى</div>
                <div>• <code>/about</code> - من نحن</div>
                <div>• <code>/contact</code> - اتصل بنا</div>
                <div>• <code>/reviews</code> - مراجعات العملاء</div>
                <div>• <code>/shipping</code> - الشحن والتوصيل</div>
                <div>• <code>/warranty</code> - ضمان المنتج</div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {linkUrl === '' ? 'إزالة الرابط' : 'إضافة الرابط'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character Count */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            <span className="font-medium">عدد الكلمات:</span> {wordCount}
            <span className="mx-2">•</span>
            <span className="font-medium">الأحرف:</span> {charCount}
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-medium px-3 py-1 rounded-full ${
              wordCount >= 120 
                ? 'text-green-600 bg-green-100' 
                : 'text-amber-600 bg-amber-100'
            }`}>
              {wordCount >= 120 
                ? '✅ المعيار الأساسي مكتمل' 
                : `يحتاج ${120 - wordCount} كلمة إضافية`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        .ProseMirror {
          direction: rtl !important;
          text-align: right !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          outline: none;
          min-height: 200px;
          padding: 16px;
        }
        
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1.5em 0 0.75em 0;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.25em;
        }
        
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 1.25em 0 0.5em 0;
          color: #374151;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          margin: 1em 0;
          padding-right: 1.5em;
        }
        
        .ProseMirror li {
          margin: 0.5em 0;
          line-height: 1.6;
        }
        
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8;
          background-color: #dbeafe;
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        .ProseMirror blockquote {
          border-right: 4px solid #3b82f6;
          margin: 1em 0;
          padding: 0.75em 1em;
          background-color: #f8fafc;
          font-style: italic;
          color: #475569;
          border-radius: 0 8px 8px 0;
        }
        
        .ProseMirror code {
          background-color: #f1f5f9;
          color: #1e293b;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.9em;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: right;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;