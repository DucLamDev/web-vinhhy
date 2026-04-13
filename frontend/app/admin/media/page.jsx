"use client";

import { ImagePlus, Search, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMediaLibrary } from "@/hooks/use-media-library";

export default function AdminMediaPage() {
  const media = useMediaLibrary(true);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">Media</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Cloudinary Media Library</h1>
        <p className="mt-2 text-sm text-slate-500">Không dùng `/public`. Tất cả ảnh được upload, lấy lại và xoá trực tiếp qua Cloudinary API.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white">
          <UploadCloud className="h-4 w-4" />
          {media.uploading ? "Đang upload..." : "Upload ảnh"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              await media.uploadFile(file);
              event.target.value = "";
            }}
          />
        </label>

        <div className="flex min-w-[280px] flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={media.search}
            onChange={(event) => media.setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") media.loadMedia(event.currentTarget.value);
            }}
            placeholder="Tìm theo public_id"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <Button variant="secondary" onClick={() => media.loadMedia()}>
          Làm mới
        </Button>
      </div>

      {media.error ? <div className="rounded-[22px] bg-red-50 px-4 py-3 text-sm text-red-600">{media.error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {media.loading ? (
          <div className="col-span-full text-sm text-slate-500">Đang tải media...</div>
        ) : media.media.length === 0 ? (
          <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 text-center">
            <ImagePlus className="h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-600">Chưa có ảnh nào.</p>
          </div>
        ) : (
          media.media.map((item) => (
            <div key={item.publicId} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <img src={item.url} alt={item.alt || item.publicId} className="h-56 w-full object-cover" />
              <div className="space-y-3 px-4 py-4">
                <div>
                  <p className="truncate text-sm font-semibold text-ink">{item.publicId}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.width} x {item.height}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"
                  onClick={async () => {
                    await media.removeMedia(item.publicId);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
