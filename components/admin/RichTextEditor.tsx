"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExt from "@tiptap/extension-image";
import { useState } from "react";
import {
  HiOutlineBold, HiOutlineItalic, HiOutlineUnderline,
  HiOutlineStrikethrough, HiOutlineListBullet, HiOutlineQueueList,
  HiOutlineLink, HiOutlinePhoto, HiOutlineCodeBracket,
  HiOutlineBars3BottomLeft, HiOutlineBars3BottomRight, HiOutlineBars3,
  HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineArrowUturnLeft, HiOutlineArrowUturnRight,
} from "react-icons/hi2";
import { BsQuote } from "react-icons/bs";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
};

const highlightColors = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#fecaca"];
const textColors = ["#111827", "#dc2626", "#16a34a", "#2563eb", "#ca8a04", "#9333ea"];

export default function RichTextEditor({ value, onChange, dir = "rtl", placeholder }: RichTextEditorProps) {
  const [showTextColors, setShowTextColors] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-aura-accent underline" } }),
      ImageExt,
      Placeholder.configure({ placeholder: placeholder || "اكتب المحتوى هنا" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        dir,
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-aura-dark",
      },
    },
  });

  if (!editor) return null;

  const btnCls = (active: boolean) =>
    `p-2 rounded-lg text-xs transition-all shrink-0 ${active ? "bg-aura-dark text-white" : "text-aura-muted hover:bg-aura-canvas hover:text-aura-dark"}`;

  const setLink = () => {
    const url = window.prompt("رابط اللينك:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("رابط الصورة:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rounded-2xl border border-aura-border bg-white overflow-hidden focus-within:border-aura-accent transition-all">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-aura-border bg-aura-canvas flex-wrap">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnCls(false)} title="تراجع">
          <HiOutlineArrowUturnLeft className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnCls(false)} title="إعادة">
          <HiOutlineArrowUturnRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnCls(editor.isActive("bold"))} title="عريض">
          <HiOutlineBold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnCls(editor.isActive("italic"))} title="مائل">
          <HiOutlineItalic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnCls(editor.isActive("underline"))} title="تسطير">
          <HiOutlineUnderline className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnCls(editor.isActive("strike"))} title="يتوسطه خط">
          <HiOutlineStrikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btnCls(editor.isActive("heading", { level: 1 }))} font-bold text-[11px]`}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btnCls(editor.isActive("heading", { level: 2 }))} font-bold text-[11px]`}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btnCls(editor.isActive("heading", { level: 3 }))} font-bold text-[11px]`}>H3</button>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnCls(editor.isActive("bulletList"))} title="قائمة نقطية">
          <HiOutlineListBullet className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnCls(editor.isActive("orderedList"))} title="قائمة مرقمة">
          <HiOutlineQueueList className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnCls(editor.isActive({ textAlign: "right" }))} title="محاذاة يمين">
          <HiOutlineBars3BottomRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnCls(editor.isActive({ textAlign: "center" }))} title="توسيط">
          <HiOutlineBars3 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnCls(editor.isActive({ textAlign: "left" }))} title="محاذاة يسار">
          <HiOutlineBars3BottomLeft className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().liftListItem("listItem").run()} className={btnCls(false)} title="تقليل مسافة بادئة">
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().sinkListItem("listItem").run()} className={btnCls(false)} title="زيادة مسافة بادئة">
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <div className="relative">
          <button type="button" onClick={() => { setShowTextColors((v) => !v); setShowHighlights(false); }} className={btnCls(false)} title="لون الخط">
            <span className="text-[13px] font-bold" style={{ color: "#dc2626" }}>A</span>
          </button>
          {showTextColors && (
            <div className="absolute top-full mt-1 z-20 flex gap-1 p-2 bg-white rounded-xl border border-aura-border shadow-lg">
              {textColors.map((c) => (
                <button key={c} type="button" onClick={() => { editor.chain().focus().setColor(c).run(); setShowTextColors(false); }} className="w-5 h-5 rounded-full border border-aura-border shrink-0" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button type="button" onClick={() => { setShowHighlights((v) => !v); setShowTextColors(false); }} className={btnCls(false)} title="تظليل">
            <span className="text-[13px] px-0.5 rounded" style={{ backgroundColor: "#fef08a" }}>A</span>
          </button>
          {showHighlights && (
            <div className="absolute top-full mt-1 z-20 flex gap-1 p-2 bg-white rounded-xl border border-aura-border shadow-lg">
              {highlightColors.map((c) => (
                <button key={c} type="button" onClick={() => { editor.chain().focus().toggleHighlight({ color: c }).run(); setShowHighlights(false); }} className="w-5 h-5 rounded-full border border-aura-border shrink-0" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-aura-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnCls(editor.isActive("blockquote"))} title="اقتباس">
          <BsQuote className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnCls(editor.isActive("codeBlock"))} title="كود">
          <HiOutlineCodeBracket className="w-4 h-4" />
        </button>
        <button type="button" onClick={setLink} className={btnCls(editor.isActive("link"))} title="لينك">
          <HiOutlineLink className="w-4 h-4" />
        </button>
        <button type="button" onClick={addImage} className={btnCls(false)} title="صورة">
          <HiOutlinePhoto className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}