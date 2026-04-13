"use client";

import { useMemo, useRef, useState } from "react";
import { Code2, Eye, ImagePlus, LayoutGrid } from "lucide-react";

import { MediaLibraryModal } from "@/components/admin/cms/media-library-modal";
import { Button } from "@/components/ui/button";
import { normalizeHtmlForEditing, normalizeHtmlForRendering } from "@/lib/blog-content";
import { cn } from "@/lib/utils";

const DEFAULT_TABLE_TEMPLATE = `<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="border: 1px solid #dbe4ee; padding: 12px; background: #15304a; color: #ffffff; text-align: left;">Cột 1</th>
      <th style="border: 1px solid #dbe4ee; padding: 12px; background: #15304a; color: #ffffff; text-align: left;">Cột 2</th>
      <th style="border: 1px solid #dbe4ee; padding: 12px; background: #15304a; color: #ffffff; text-align: left;">Cột 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dbe4ee; padding: 12px;">Nội dung</td>
      <td style="border: 1px solid #dbe4ee; padding: 12px;">Nội dung</td>
      <td style="border: 1px solid #dbe4ee; padding: 12px;">Nội dung</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dbe4ee; padding: 12px;">Nội dung</td>
      <td style="border: 1px solid #dbe4ee; padding: 12px;">Nội dung</td>
      <td style="border: 1px solid #dbe4ee; padding: 12px;">Nội dung</td>
    </tr>
  </tbody>
</table>`;

const buildImageSnippet = (asset = {}) =>
  `<figure class="content-image">
  <img src="${asset.url || ""}" alt="${asset.alt || ""}" loading="lazy" decoding="async" />
  ${asset.alt ? `<figcaption>${asset.alt}</figcaption>` : ""}
</figure>`;

export function RawHtmlEditor({ value, onChange, placeholder = "Dán HTML tại đây..." }) {
  const textareaRef = useRef(null);
  const [mode, setMode] = useState("code");
  const [openMedia, setOpenMedia] = useState(false);

  const normalizedValue = useMemo(() => normalizeHtmlForEditing(value || ""), [value]);
  const previewHtml = useMemo(() => normalizeHtmlForRendering(value || ""), [value]);

  const updateValue = (nextValue) => {
    onChange(nextValue);
  };

  const insertAtCursor = (snippet) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      updateValue(`${normalizedValue}${normalizedValue ? "\n\n" : ""}${snippet}`);
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const nextValue = `${normalizedValue.slice(0, start)}${snippet}${normalizedValue.slice(end)}`;

    updateValue(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handlePaste = (event) => {
    const clipboardHtml = event.clipboardData?.getData("text/html");
    const clipboardText = event.clipboardData?.getData("text/plain");
    const incoming = normalizeHtmlForEditing(clipboardHtml || clipboardText || "");

    if (!incoming) return;

    event.preventDefault();
    insertAtCursor(incoming);
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", mode === "code" ? "bg-ink text-white" : "bg-slate-100 text-slate-600")}
            onClick={() => setMode("code")}
          >
            <span className="inline-flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5" />
              HTML
            </span>
          </button>
          <button
            type="button"
            className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", mode === "preview" ? "bg-ink text-white" : "bg-slate-100 text-slate-600")}
            onClick={() => setMode("preview")}
          >
            <span className="inline-flex items-center gap-2">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => insertAtCursor(DEFAULT_TABLE_TEMPLATE)}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Chen bang
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setOpenMedia(true)}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Chen anh
          </Button>
        </div>
      </div>

      {mode === "code" ? (
        <div className="space-y-3 p-4">
          <div className="rounded-[18px] bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
            Dán trực tiếp HTML vào đây. Hỗ trợ table, iframe, figure, img và nội dung format tự do. Khi dùng
            <span className="mx-1 font-semibold text-ink">Ctrl + V</span>
            hệ thống sẽ cố giữ nguyên HTML gốc thay vì biến nó thành ký tự escaped.
          </div>
          <textarea
            ref={textareaRef}
            className="admin-input min-h-[320px] rounded-[20px] font-mono text-xs leading-7"
            value={normalizedValue}
            placeholder={placeholder}
            onChange={(event) => updateValue(event.target.value)}
            onPaste={handlePaste}
          />
        </div>
      ) : (
        <div className="space-y-3 p-4">
          <div className="rounded-[18px] bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
            Preview render thật của khối HTML. Nếu nội dung trước đó bị lưu dưới dạng `&lt;p&gt;...&lt;/p&gt;`,
            preview này sẽ tự giải mã để bạn kiểm tra đúng layout.
          </div>
          <div className="prose-blog min-h-[320px] max-w-none rounded-[20px] border border-slate-100 bg-white p-5">
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-[16px] bg-slate-50 text-sm text-slate-500">
                Chua co HTML de preview.
              </div>
            )}
          </div>
        </div>
      )}

      <MediaLibraryModal
        open={openMedia}
        onOpenChange={setOpenMedia}
        onSelect={(asset) => {
          insertAtCursor(buildImageSnippet(asset));
          setOpenMedia(false);
        }}
      />
    </div>
  );
}
