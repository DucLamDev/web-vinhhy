import { BlogCard } from "@/components/blog/blog-card";
import { buildMetadata } from "@/lib/seo";
import { getBlogs } from "@/lib/api";

export const metadata = buildMetadata({
  title: "Cẩm nang du lịch Vĩnh Hy | Tour Vĩnh Hy",
  description: "Kinh nghiệm đi Vĩnh Hy, gợi ý lịch trình, món ngon và những điểm check-in đẹp của Ninh Thuận.",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-sky via-white to-sand px-6 py-10 shadow-soft sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Cẩm nang du lịch</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-4.5xl">Những bài viết để bạn hiểu Vĩnh Hy hơn trước khi lên đường.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600">
          Phần cẩm nang tập trung vào trải nghiệm thật: thời điểm đi đẹp, món ngon địa phương, lịch trình ngắn ngày và mẹo chụp ảnh.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
