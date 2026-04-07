import Link from "next/link";

import { formatDate } from "@/lib/utils";

export function BlogPreviewSection({ posts }) {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-[1.2rem] tracking-[0.24em] text-ocean">Cẩm nang du lịch</p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Mẹo đi lại, món ngon nên thử và lịch trình 2 ngày 1 đêm giúp bạn dễ hình dung chuyến đi hơn.
          </p>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:hidden">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-soft"
            >
              <img src={post.featuredImage} alt={post.title} className="h-40 w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">{formatDate(post.date)}</p>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                  <Link href={`/blog/${post.slug}`} prefetch className="transition hover:text-ocean">
                    {post.title}
                  </Link>
                </h3>
                <p className="line-clamp-2 text-xs leading-5 text-slate-500">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} prefetch className="mt-auto pt-2 text-xs font-semibold text-ocean">
                  Đọc bài viết →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft"
            >
              <img src={post.featuredImage} alt={post.title} className="h-60 w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{formatDate(post.date)}</p>
                <h3 className="line-clamp-2 text-xl font-bold leading-snug text-ink">
                  <Link href={`/blog/${post.slug}`} prefetch className="transition hover:text-ocean">
                    {post.title}
                  </Link>
                </h3>
                <p className="line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} prefetch className="mt-auto pt-1 text-sm font-semibold text-ocean">
                  Đọc bài viết →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
