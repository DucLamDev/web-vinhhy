"use client";

import { useEffect } from "react";
import { ImagePlus, Search, Trash2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMediaLibrary } from "@/hooks/use-media-library";

export function MediaLibraryModal({ open, onOpenChange, onSelect }) {
  const library = useMediaLibrary(open);

  useEffect(() => {
    library.setIsOpen(open);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/35 p-4">
      <div className="flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">Cloudinary Media</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Media Library</h2>
          </div>
          <button type="button" className="rounded-full bg-slate-100 p-2 text-slate-600" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white">
            <UploadCloud className="h-4 w-4" />
            {library.uploading ? "Đang upload..." : "Upload ảnh"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                await library.uploadFile(file);
                event.target.value = "";
              }}
            />
          </label>

          <div className="flex min-w-[280px] flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={library.search}
              onChange={(event) => library.setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  library.loadMedia(event.currentTarget.value);
                }
              }}
              placeholder="Tìm theo tên file"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <Button variant="secondary" onClick={() => library.loadMedia()}>
            Làm mới
          </Button>
        </div>

        {library.error ? <div className="px-6 py-3 text-sm text-red-600">{library.error}</div> : null}

        <div className="grid flex-1 gap-4 overflow-y-auto px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
          {library.loading ? (
            <div className="col-span-full text-sm text-slate-500">Đang tải media...</div>
          ) : library.media.length === 0 ? (
            <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 text-center">
              <ImagePlus className="h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-600">Chưa có ảnh nào trong thư viện.</p>
            </div>
          ) : (
            library.media.map((item) => (
              <div key={item.publicId} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  className="block w-full"
                  onClick={() => {
                    onSelect(item);
                    onOpenChange(false);
                  }}
                >
                  <img src={item.url} alt={item.alt || item.publicId} className="h-48 w-full object-cover" />
                </button>
                <div className="space-y-3 px-4 py-4">
                  <div>
                    <p className="truncate text-sm font-semibold text-ink">{item.publicId}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.width} x {item.height}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        onSelect(item);
                        onOpenChange(false);
                      }}
                    >
                      Chọn ảnh
                    </Button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600"
                      onClick={async () => {
                        await library.removeMedia(item.publicId);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
