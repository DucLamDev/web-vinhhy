"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarClock, ExternalLink, Eye, ImagePlus, Save, SearchCheck, Sparkles } from "lucide-react";

import { MediaLibraryModal } from "@/components/admin/cms/media-library-modal";
import { SeoContentAssistant } from "@/components/admin/cms/seo-content-assistant";
import { SeoScorePanel } from "@/components/admin/cms/seo-score-panel";
import { SectionBuilder } from "@/components/admin/cms/section-builder";
import { BlogRenderer } from "@/components/blog/blog-renderer";
import { Button } from "@/components/ui/button";
import { usePostEditor } from "@/hooks/use-post-editor";
import { extractPlainText, getPostImage } from "@/lib/blog-content";
import { formatDate } from "@/lib/utils";

function RelationSelector({ title, items, selected, onChange }) {
  const selectedIds = selected.map((item) => item._id || item);

  return (
    <div className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? <p className="text-sm text-slate-500">Chua co du lieu.</p> : null}
        {items.map((item) => {
          const active = selectedIds.includes(item._id);

          return (
            <button
              key={item._id}
              type="button"
              className={active ? "rounded-full bg-ocean px-3 py-2 text-sm font-semibold text-white" : "rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600"}
              onClick={() =>
                onChange(active ? selected.filter((entry) => (entry._id || entry) !== item._id) : [...selected, item])
              }
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ImageField({ title, asset, onOpenPicker, onUpdateAlt, helper }) {
  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
        {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
      </div>
      <div className="overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-slate-50">
        {asset?.url ? (
          <img src={asset.url} alt={asset.alt || title} className="h-52 w-full object-cover" />
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-3 text-slate-500">
            <ImagePlus className="h-8 w-8" />
            <p className="text-sm">Chua chon anh</p>
          </div>
        )}
      </div>
      <Button variant="secondary" onClick={onOpenPicker}>
        Chon tu Media Library
      </Button>
      {asset?.url ? <input className="admin-input" value={asset.alt || ""} onChange={(event) => onUpdateAlt(event.target.value)} placeholder="Alt text" /> : null}
    </div>
  );
}

export function PostEditorShell({ postId }) {
  const router = useRouter();
  const [mediaTarget, setMediaTarget] = useState("");
  const { post, loading, saving, error, notice, taxonomies, setField, setSeoField, setFeaturedImage, setSeoImage, setSections, setRelation, savePost, openPreview } =
    usePostEditor(postId);

  const handlePersist = async (nextStatus) => {
    const result = await savePost(nextStatus ? { status: nextStatus } : {});
    if (!postId && result?._id) {
      router.replace(`/admin/posts/${result._id}`);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Dang tai du lieu bai viet...</div>;
  }

  const previewImage = getPostImage(post);
  const previewDescription = post.excerpt || extractPlainText(post).slice(0, 180);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">WordPress-like Editor</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">{postId ? "Chinh sua bai viet" : "Tao bai viet moi"}</h1>
            <p className="mt-2 text-sm text-slate-500">Section-based editor voi preview realtime, Cloudinary media va SEO panel.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => openPreview()}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="secondary" onClick={() => handlePersist("draft")} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => handlePersist("published")} disabled={saving}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        {notice ? <div className="rounded-[22px] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div> : null}
        {error ? <div className="rounded-[22px] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <input
                className="w-full border-0 bg-transparent text-4xl font-semibold tracking-tight text-ink outline-none"
                placeholder="Nhap tieu de bai viet..."
                value={post.title}
                onChange={(event) => setField("title", event.target.value)}
              />
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
                <input className="admin-input" placeholder="Slug" value={post.slug} onChange={(event) => setField("slug", event.target.value)} />
                <select className="admin-input" value={post.status} onChange={(event) => setField("status", event.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {post.status === "scheduled" ? (
                <div className="mt-4">
                  <label className="text-sm font-medium text-ink">Lich publish</label>
                  <input
                    type="datetime-local"
                    className="admin-input mt-2"
                    value={post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ""}
                    onChange={(event) => setField("scheduledAt", event.target.value)}
                  />
                </div>
              ) : null}
              <textarea
                className="admin-input mt-4 min-h-28"
                placeholder="Excerpt / mo ta ngan cho list page"
                value={post.excerpt}
                onChange={(event) => setField("excerpt", event.target.value)}
              />
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-ink">Section Builder</h2>
                <p className="mt-2 text-sm text-slate-500">Add, delete, reorder va chinh sua tung block noi dung nhu Gutenberg.</p>
              </div>
              <SectionBuilder sections={post.contentSections} onChange={setSections} />
            </div>
          </div>

          <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ocean" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Publish Panel</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold capitalize text-ink">{post.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Updated</span>
                  <span>{formatDate(post.updatedAt) || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Preview token</span>
                  <span className="max-w-[170px] truncate text-right">{post.previewToken || "Tao sau lan save dau tien"}</span>
                </div>
              </div>
            </div>

            <ImageField
              title="Featured Image"
              asset={post.featuredImage}
              onOpenPicker={() => setMediaTarget("featured")}
              onUpdateAlt={(alt) =>
                setFeaturedImage({
                  ...post.featuredImage,
                  alt
                })
              }
              helper="Anh hero cua bai viet, dung o list page va detail page."
            />

            <RelationSelector title="Categories" items={taxonomies.categories} selected={post.categories} onChange={(value) => setRelation("categories", value)} />
            <RelationSelector title="Tags" items={taxonomies.tags} selected={post.tags} onChange={(value) => setRelation("tags", value)} />

            <SeoContentAssistant
              post={post}
              onApplyMeta={({ metaTitle, metaDescription, excerpt, jsonLd, introHtml }) => {
                setSeoField("metaTitle", metaTitle);
                setSeoField("metaDescription", metaDescription);
                if (!post.excerpt) {
                  setField("excerpt", excerpt);
                }
                if (!post.seo.jsonLd) {
                  setSeoField("jsonLd", jsonLd);
                }
                if (post.contentSections.length === 1 && !post.contentSections[0].body) {
                  setSections([
                    {
                      ...post.contentSections[0],
                      body: introHtml
                    }
                  ]);
                }
              }}
              onApplyOutline={({ sections, introHtml }) => {
                const shouldReplace =
                  post.contentSections.length <= 1 &&
                  post.contentSections.every((section) => !section.body && !section.image?.url && !section.caption);

                if (shouldReplace) {
                  setSections([
                    {
                      ...sections[1],
                      body: introHtml
                    },
                    ...sections.slice(0, 1),
                    ...sections.slice(2)
                  ]);
                  return;
                }

                setSections([...post.contentSections, ...sections]);
              }}
            />

            <SeoScorePanel post={post} />

            <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <SearchCheck className="h-4 w-4 text-ocean" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">SEO Settings</h3>
              </div>
              <input className="admin-input" placeholder="Meta title" value={post.seo.metaTitle} onChange={(event) => setSeoField("metaTitle", event.target.value)} />
              <textarea
                className="admin-input min-h-28"
                placeholder="Meta description"
                value={post.seo.metaDescription}
                onChange={(event) => setSeoField("metaDescription", event.target.value)}
              />
              <input className="admin-input" placeholder="Canonical URL" value={post.seo.canonicalUrl} onChange={(event) => setSeoField("canonicalUrl", event.target.value)} />
              <textarea
                className="admin-input min-h-32 font-mono text-xs"
                placeholder='{"@context":"https://schema.org"}'
                value={post.seo.jsonLd}
                onChange={(event) => setSeoField("jsonLd", event.target.value)}
              />

              <ImageField
                title="OG Image"
                asset={post.seo.ogImage}
                onOpenPicker={() => setMediaTarget("seo")}
                onUpdateAlt={(alt) =>
                  setSeoImage({
                    ...post.seo.ogImage,
                    alt
                  })
                }
                helper="Dung cho Open Graph / Facebook preview."
              />
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-ocean" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Realtime Preview</h3>
                </div>
              </div>
              <div className="space-y-4 p-5">
                {previewImage?.url ? <img src={previewImage.url} alt={previewImage.alt || post.title} className="h-56 w-full rounded-[22px] object-cover" /> : null}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">/blog/{post.slug || "your-slug"}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">{post.title || "Tieu de bai viet"}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{previewDescription || "Meta description / excerpt se hien thi o day."}</p>
                </div>
                <Link href={post.previewToken ? `/blog/preview/${post.previewToken}` : "#"} target="_blank" className="text-sm font-semibold text-ocean">
                  Mo preview SSR
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-ink">Full Preview</h2>
          <div className="mt-6 rounded-[28px] bg-slate-50 p-4 sm:p-6">
            <article className="mx-auto max-w-4xl">
              {previewImage?.url ? <img src={previewImage.url} alt={previewImage.alt || post.title} className="h-[360px] w-full rounded-[28px] object-cover" /> : null}
              <div className="mt-6 rounded-[28px] bg-white p-6 shadow-soft">
                <h1 className="text-4xl font-semibold text-ink">{post.title || "Preview title"}</h1>
                <p className="mt-4 text-sm leading-8 text-slate-600">{previewDescription || "Preview content will appear here."}</p>
              </div>
              <div className="mt-6">
                <BlogRenderer post={post} />
              </div>
            </article>
          </div>
        </div>
      </div>

      <MediaLibraryModal
        open={Boolean(mediaTarget)}
        onOpenChange={(open) => {
          if (!open) setMediaTarget("");
        }}
        onSelect={(asset) => {
          if (mediaTarget === "featured") setFeaturedImage(asset);
          if (mediaTarget === "seo") setSeoImage(asset);
          setMediaTarget("");
        }}
      />
    </>
  );
}
