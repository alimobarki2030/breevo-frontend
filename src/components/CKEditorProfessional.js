import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { 
    ClassicEditor, 
    Essentials, 
    Bold, 
    Italic, 
    Underline,
    Paragraph,
    Heading,
    Link,
    List,
    BlockQuote,
    Indent,
    Table,
    TableToolbar,
    PasteFromOffice,
    Undo
} from 'ckeditor5';

const CKEditorProfessional = ({ 
  value = '', 
  onChange, 
  placeholder = 'اكتب وصف المنتج هنا...'
}) => {

  const editorConfiguration = {
    plugins: [
      Essentials,
      Bold,
      Italic,
      Underline,
      Paragraph,
      Heading,
      Link,
      List,
      BlockQuote,
      Indent,
      Table,
      TableToolbar,
      PasteFromOffice,
      Undo
    ],
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
    heading: {
      options: [
        { model: 'paragraph', title: 'فقرة', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'عنوان رئيسي (H2)', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'عنوان فرعي (H3)', class: 'ck-heading_heading3' }
      ]
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://'
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    placeholder: placeholder,
    language: 'ar'
  };

  return (
    <div className="ckeditor-simple-container">
      
      {/* CKEditor Only */}
      <div className="editor-wrapper">
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={value || ''}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
          onReady={(editor) => {
            console.log('✅ CKEditor جاهز للاستخدام');
            
            // Set RTL direction
            editor.editing.view.change(writer => {
              writer.setAttribute('dir', 'rtl', editor.editing.view.document.getRoot());
            });
          }}
          onError={(error, { willEditorRestart }) => {
            console.error('❌ خطأ في CKEditor:', error);
          }}
        />
      </div>

      {/* Minimal Styles */}
      <style jsx>{`
        .ckeditor-simple-container {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .editor-wrapper {
          min-height: 300px;
          background: white;
        }
      `}</style>

      {/* Global CKEditor Styles */}
      <style jsx global>{`
        .ck.ck-editor {
          border: none !important;
        }

        .ck.ck-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
          border-radius: 0 !important;
          direction: rtl !important;
          text-align: right !important;
        }

        .ck.ck-toolbar .ck-toolbar__items {
          direction: rtl !important;
          justify-content: flex-start !important;
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

        .ck.ck-content p {
          margin: 1em 0 !important;
        }

        .ck.ck-content strong {
          font-weight: 600 !important;
          color: #212529 !important;
        }

        /* Placeholder styling */
        .ck.ck-content.ck-placeholder::before {
          color: #6c757d !important;
          right: 20px !important;
          left: auto !important;
          font-style: italic !important;
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