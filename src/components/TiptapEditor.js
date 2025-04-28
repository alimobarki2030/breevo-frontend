import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

export default function TiptapEditor({ value, onChange }) {
  const editorRef = useRef();
  const [linkPopover, setLinkPopover] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),

      
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose tiptap-editor p-4 bg-white rounded-xl border min-h-[300px] focus:outline-none focus:ring",
      },
    },
  });

  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);
  

  const buttonClass = (active) =>
    `p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 ${active ? "bg-green-100 text-green-700" : ""}`;

  const handleLinkClick = () => {
    const { from, to } = editor.state.selection;
    if (from === to) {
      alert("الرجاء تحديد نص لإضافة الرابط.");
      return;
    }

    const selectionRect = window.getSelection()?.getRangeAt(0)?.getBoundingClientRect();
    if (selectionRect) {
      setLinkPopover({
        x: selectionRect.left + window.scrollX,
        y: selectionRect.bottom + window.scrollY,
        href: editor.getAttributes("link").href || "",
      });
    }
  };

  const applyLink = (href) => {
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkPopover(null);
  };

  if (!editor) return <p>تحميل المحرر...</p>;

  return (
    <div className="my-4 space-y-2 relative" ref={editorRef}>
      <EditorContent editor={editor} />

      {/* Toolbar under editor */}
      <div className="flex gap-2 flex-wrap bg-gray-50 border border-gray-200 rounded-xl p-2 mt-2 shadow-sm justify-center">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive("bold"))}><Bold size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive("italic"))}><Italic size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive("underline"))}><UnderlineIcon size={18} /></button>

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={buttonClass(editor.isActive({ textAlign: "left" }))}><AlignLeft size={18} /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={buttonClass(editor.isActive({ textAlign: "center" }))}><AlignCenter size={18} /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={buttonClass(editor.isActive({ textAlign: "right" }))}><AlignRight size={18} /></button>

        <button onClick={handleLinkClick} className={buttonClass(false)}><LinkIcon size={18} /></button>
      </div>

      {linkPopover && createPortal(
        <div
          className="absolute z-50 bg-white border border-gray-300 shadow-xl rounded-xl p-3 flex gap-2 items-center"
          style={{
            position: "absolute",
            top: linkPopover.y + 8,
            left: linkPopover.x,
          }}
        >
          <input
            type="text"
            defaultValue={linkPopover.href}
            placeholder="https://"
            className="border px-2 py-1 rounded text-sm w-60"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink(e.target.value);
              if (e.key === "Escape") setLinkPopover(null);
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector("input[type='text']");
              applyLink(input.value);
            }}
            className="bg-green-600 text-white text-sm px-3 py-1 rounded"
          >
            حفظ
          </button>
          <button
            onClick={() => setLinkPopover(null)}
            className="text-gray-400 text-sm"
          >
            إلغاء
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}