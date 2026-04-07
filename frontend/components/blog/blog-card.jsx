import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white">
      <img src={post.featuredImage} alt={post.title} className="h-60 w-full object-cover" loading="lazy" />
      <CardContent className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{formatDate(post.date)}</p>
        <div>
          <h3 className="text-2xl font-semibold text-ink">
            <Link href={`/blog/${post.slug}`} prefetch className="transition hover:text-ocean">
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        </div>
        <Link href={`/blog/${post.slug}`} prefetch className="inline-flex text-sm font-semibold text-ocean">
          Đọc bài viết
        </Link>
      </CardContent>
    </Card>
  );
}
