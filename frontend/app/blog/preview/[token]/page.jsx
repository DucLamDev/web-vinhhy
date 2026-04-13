import { notFound } from "next/navigation";

import { BlogRenderer } from "@/components/blog/blog-renderer";
import { getPostImage } from "@/lib/blog-content";
import { getBlogPreview } from "@/lib/api";
import { getBlogMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const post = await getBlogPreview((await params).token);

  if (!post) {
    return {
      title: "Preview không tồn tại"
    };
  }

  return {
    ...getBlogMetadata(post),
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function BlogPreviewPage({ params }) {
  const post = await getBlogPreview((await params).token);

  if (!post) {
    notFound();
  }

  const cover = getPostImage(post);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[36px] border border-dashed border-ocean/30 bg-gradient-to-r from-sky via-white to-sand px-6 py-8 shadow-soft sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Draft Preview</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">{post.excerpt}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(post.date)}</p>
      </div>
      {cover?.url ? (
        <div className="mt-8 overflow-hidden rounded-[36px] shadow-soft">
          <img src={cover.url} alt={cover.alt || post.title} className="h-[420px] w-full object-cover" />
        </div>
      ) : null}
      <div className="mt-8">
        <BlogRenderer post={post} />
      </div>
    </article>
  );
}
