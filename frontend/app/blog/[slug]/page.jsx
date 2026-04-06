import { notFound } from "next/navigation";

import { getBlogMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getBlogBySlug, getBlogs } from "@/lib/api";

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getBlogBySlug((await params).slug);

  if (!post) {
    return getBlogMetadata({
      slug: (await params).slug,
      title: "Không tìm thấy bài viết",
      excerpt: "Bài viết bạn tìm không tồn tại.",
      featuredImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    });
  }

  return getBlogMetadata(post);
}

export default async function BlogDetailPage({ params }) {
  const post = await getBlogBySlug((await params).slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-sky via-white to-sand px-6 py-8 shadow-soft sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">{formatDate(post.date)}</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-sm leading-8 text-slate-600">{post.excerpt}</p>
      </div>
      <div className="mt-8 overflow-hidden rounded-[36px] shadow-soft">
        <img src={post.featuredImage} alt={post.title} className="h-[420px] w-full object-cover" />
      </div>
      <div className="prose-blog mt-8 rounded-[36px] border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
