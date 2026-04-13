import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogRenderer } from "@/components/blog/blog-renderer";
import {
  getBlogMetadata,
  getBlogPostingStructuredData,
  getBreadcrumbStructuredData
} from "@/lib/seo";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Khong tim thay bai viet"
    };
  }

  return getBlogMetadata(post);
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post, 3);
  const primaryCategory = post.categories?.[0] || null;
  const breadcrumbs = [
    { name: "Trang chu", href: "/" },
    { name: "Blog", href: "/blog" },
    ...(primaryCategory
      ? [{ name: primaryCategory.name, href: `/blog?category=${primaryCategory.slug}` }]
      : []),
    { name: post.title, href: `/blog/${post.slug}` }
  ];
  const articleStructuredData = post.seo?.jsonLd || JSON.stringify(getBlogPostingStructuredData(post));
  const breadcrumbStructuredData = JSON.stringify(getBreadcrumbStructuredData(breadcrumbs));

  return (
    <article className="pb-16 lg:pb-20">
      <section className="relative overflow-hidden border-b border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(15,142,164,0.18),transparent_28%),radial-gradient(circle_at_right,rgba(255,122,26,0.12),transparent_22%),linear-gradient(180deg,#ecfbff_0%,#ffffff_58%,#fff8ef_100%)]">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute left-0 top-28 h-52 w-52 rounded-full bg-ocean/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:py-14">
          <div className="self-end">
            <BlogBreadcrumbs items={breadcrumbs} />

            <div className="mt-6 flex flex-wrap gap-2">
              {post.categories?.map((category) => (
                <Link
                  key={category.id || category.slug}
                  href={`/blog?category=${category.slug}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ocean shadow-sm transition hover:bg-ocean hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              {formatDate(post.date)} · {post.readingTime || 1} phut doc
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-[24px] border border-white/80 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tac gia</p>
                <p className="mt-2 text-sm font-semibold text-ink">{post.author?.name || "Tour Vinh Hy"}</p>
              </div>
              <div className="rounded-[24px] border border-white/80 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cap nhat</p>
                <p className="mt-2 text-sm font-semibold text-ink">{formatDate(post.updatedAt || post.date)}</p>
              </div>
              <div className="rounded-[24px] border border-white/80 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Danh muc</p>
                <p className="mt-2 text-sm font-semibold text-ink">{primaryCategory?.name || "Cam nang Vinh Hy"}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_28px_90px_rgba(21,48,74,0.14)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={post.featuredImage?.url}
                alt={post.featuredImage?.alt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div className="rounded-[36px] border border-slate-200 bg-white px-5 py-8 shadow-[0_24px_80px_rgba(21,48,74,0.08)] sm:px-8 lg:px-10">
          <BlogRenderer post={post} />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Thong tin nhanh</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Dang luc</span>
                <span className="text-right">{formatDate(post.publishedAt || post.date)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Cap nhat</span>
                <span className="text-right">{formatDate(post.updatedAt || post.date)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Reading time</span>
                <span className="text-right">{post.readingTime || 1} phut</span>
              </div>
            </div>
          </div>

          {post.tags?.length > 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Chu de lien quan</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id || tag.slug}
                    href={`/blog?tag=${tag.slug}`}
                    className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-sand hover:text-coral"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#15304a_0%,#0f8ea4_100%)] p-6 text-white shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Ke tiep cho chuyen di</p>
            <h2 className="mt-3 text-2xl font-semibold">Muon bien bai viet nay thanh mot lich trinh de di ngay?</h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Xem cac tour Vinh Hy dang co san de ghep nhanh voi diem den, thoi gian va ngan sach phu hop cho ban.
            </p>
            <Link
              href="/tour"
              className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sand"
            >
              Xem cac tour
            </Link>
          </div>
        </aside>
      </div>

      {relatedPosts.length > 0 ? (
        <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Doc them</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Bai viet cung chu de</h2>
            </div>
            {primaryCategory ? (
              <Link href={`/blog?category=${primaryCategory.slug}`} className="text-sm font-semibold text-ocean">
                Xem them trong {primaryCategory.name}
              </Link>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleStructuredData }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbStructuredData }} />
    </article>
  );
}
