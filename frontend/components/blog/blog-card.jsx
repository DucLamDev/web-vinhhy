import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { getPostImage } from "@/lib/blog-content";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post, featured = false, compact = false }) {
  const cover = getPostImage(post);
  const categories = Array.isArray(post.categories) ? post.categories.slice(0, featured ? 3 : 2) : [];

  return (
    <Card
      className={`group overflow-hidden border-white/70 bg-white/90 backdrop-blur-sm ${
        featured ? "shadow-[0_30px_90px_rgba(21,48,74,0.16)]" : "shadow-soft"
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={`relative overflow-hidden ${compact ? "h-56" : featured ? "h-[440px]" : "h-72"}`}>
          <Image
            src={cover?.url}
            alt={cover?.alt || post.title}
            fill
            sizes={featured ? "(max-width: 1280px) 100vw, 60vw" : compact ? "(max-width: 1024px) 100vw, 30vw" : "(max-width: 1024px) 100vw, 33vw"}
            className="object-cover transition duration-700 group-hover:scale-105"
            priority={featured}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5">
            {categories.length > 0 ? (
              categories.map((category) => (
                <span
                  key={category.id || category.slug || category.name}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur"
                >
                  {category.name}
                </span>
              ))
            ) : (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur">
                Cam nang
              </span>
            )}
          </div>
        </div>
      </Link>

      <CardContent className={featured ? "space-y-4 p-8" : "space-y-4 p-6"}>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
          <span>{formatDate(post.date)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{post.readingTime || 1} phut doc</span>
        </div>

        <div>
          <h3 className={featured ? "text-4xl font-semibold leading-tight text-ink" : "text-2xl font-semibold text-ink"}>
            <Link href={`/blog/${post.slug}`} className="transition hover:text-ocean">
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ocean transition hover:gap-3"
        >
          Xem bai viet
          <span aria-hidden="true">+</span>
        </Link>
      </CardContent>
    </Card>
  );
}
