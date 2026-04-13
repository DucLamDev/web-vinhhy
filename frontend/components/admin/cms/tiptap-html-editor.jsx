"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote
} from "lucide-react";

import { cn } from "@/lib/utils";

const TOOLBAR_ITEMS = [
  {
    label: "Paragraph",
    icon: Pilcrow,
    action: (editor) => editor.chain().focus().setParagraph().run(),
    active: (editor) => editor.isActive("paragraph")
  },
  {
    label: "H2",
    icon: Heading2,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    active: (editor) => editor.isActive("heading", { level: 2 })
  },
  {
    label: "Bold",
    icon: Bold,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    active: (editor) => editor.isActive("bold")
  },
  {
    label: "Italic",
    icon: Italic,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    active: (editor) => editor.isActive("italic")
  },
  {
    label: "Quote",
    icon: Quote,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    active: (editor) => editor.isActive("blockquote")
  },
  {
    label: "Bullets",
    icon: List,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    active: (editor) => editor.isActive("bulletList")
  },
  {
    label: "Numbers",
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    active: (editor) => editor.isActive("orderedList")
  },
  {
    label: "Code",
    icon: Code2,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    active: (editor) => editor.isActive("codeBlock")
  }
];

export function TiptapHtmlEditor({ value, onChange, placeholder = "Bắt đầu viết..." }) {
  const [mode, setMode] = useState("visual");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    immediatelyRender: false,
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] rounded-b-[22px] border-t border-slate-100 px-4 py-4 text-sm leading-7 text-slate-700 focus:outline-none"
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  const handleLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Nhập URL", previousUrl);

    if (url === null) return;

    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", mode === "visual" ? "bg-ink text-white" : "bg-slate-100 text-slate-600")}
            onClick={() => setMode("visual")}
          >
            Visual
          </button>
          <button
            type="button"
            className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", mode === "html" ? "bg-ink text-white" : "bg-slate-100 text-slate-600")}
            onClick={() => setMode("html")}
          >
            HTML
          </button>
        </div>

        {mode === "visual" ? (
          <div className="flex flex-wrap gap-1">
            {TOOLBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = editor ? item.active(editor) : false;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition",
                    isActive ? "bg-ocean text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                  onClick={() => item.action(editor)}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
            <button
              type="button"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition",
                editor?.isActive("link") ? "bg-ocean text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              onClick={handleLink}
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea className="admin-input min-h-[260px] rounded-none border-0" value={value || ""} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}
