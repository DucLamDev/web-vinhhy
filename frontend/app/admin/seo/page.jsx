"use client";

import { useEffect, useState } from "react";

import { MediaLibraryModal } from "@/components/admin/cms/media-library-modal";
import { Button } from "@/components/ui/button";
import { cmsApi } from "@/lib/cms-api";
import { createEmptyMediaAsset } from "@/lib/blog-content";

export default function AdminSeoPage() {
  const [settings, setSettings] = useState({
    blogIndexTitle: "",
    blogIndexDescription: "",
    blogSchemaType: "Blog",
    defaultOgImage: createEmptyMediaAsset()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await cmsApi.getSeoSettings();
        setSettings({
          blogIndexTitle: result.blogIndexTitle || "",
          blogIndexDescription: result.blogIndexDescription || "",
          blogSchemaType: result.blogSchemaType || "Blog",
          defaultOgImage: result.defaultOgImage || createEmptyMediaAsset()
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-500">Đang tải SEO settings...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">SEO</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">SEO Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Cấu hình metadata mặc định cho trang blog index và OG image mặc định.</p>
        </div>

        <div className="max-w-3xl space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <input
            className="admin-input"
            placeholder="Blog index title"
            value={settings.blogIndexTitle}
            onChange={(event) => setSettings({ ...settings, blogIndexTitle: event.target.value })}
          />
          <textarea
            className="admin-input min-h-28"
            placeholder="Blog index description"
            value={settings.blogIndexDescription}
            onChange={(event) => setSettings({ ...settings, blogIndexDescription: event.target.value })}
          />
          <select
            className="admin-input"
            value={settings.blogSchemaType}
            onChange={(event) => setSettings({ ...settings, blogSchemaType: event.target.value })}
          >
            <option value="Blog">Blog</option>
            <option value="CollectionPage">CollectionPage</option>
            <option value="WebPage">WebPage</option>
          </select>

          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4">
            {settings.defaultOgImage?.url ? (
              <img src={settings.defaultOgImage.url} alt={settings.defaultOgImage.alt || "OG"} className="h-56 w-full rounded-[20px] object-cover" />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-slate-500">Chưa chọn ảnh OG mặc định.</div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPickerOpen(true)}>
              Chọn OG image
            </Button>
            <Button
              onClick={async () => {
                setSaving(true);
                setError("");
                setNotice("");

                try {
                  const result = await cmsApi.updateSeoSettings(settings);
                  setSettings({
                    blogIndexTitle: result.blogIndexTitle || "",
                    blogIndexDescription: result.blogIndexDescription || "",
                    blogSchemaType: result.blogSchemaType || "Blog",
                    defaultOgImage: result.defaultOgImage || createEmptyMediaAsset()
                  });
                  setNotice("SEO settings đã được cập nhật.");
                } catch (requestError) {
                  setError(requestError.message);
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
            >
              Lưu cài đặt
            </Button>
          </div>

          {notice ? <div className="rounded-[22px] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div> : null}
          {error ? <div className="rounded-[22px] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
        </div>
      </div>

      <MediaLibraryModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(asset) => {
          setSettings((current) => ({
            ...current,
            defaultOgImage: asset
          }));
          setPickerOpen(false);
        }}
      />
    </>
  );
}
