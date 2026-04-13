import Link from "next/link";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { buildMetadata } from "@/lib/seo";
import { getBlogCategories, getBlogPostsPage, getBlogTags } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

const buildBlogHref = ({ page, category, tag }) => {
  const searchParams = new URLSearchParams();

  if (page && page > 1) searchParams.set("page", String(page));
  if (category) searchParams.set("category", category);
  if (tag) searchParams.set("tag", tag);

  const query = searchParams.toString();
  return query ? `/blog?${query}` : "/blog";
};

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 1) return [];

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
};

export async function generateMetadata() {
  return buildMetadata({
    title: "Blog du lich Vinh Hy | Cam nang, lich trinh va kinh nghiem",
    description:
      "Tap hop bai viet du lich Vinh Hy tu WordPress headless: lich trinh, kinh nghiem di tour, an gi, o dau va meo len ke hoach cho Ninh Thuan.",
    path: "/blog"
  });
}

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams?.page || "1", 10) || 1;
  const category = resolvedSearchParams?.category || "";
  const tag = resolvedSearchParams?.tag || "";

  const [{ items: posts, pagination, filters }, categories, tags] = await Promise.all([
    getBlogPostsPage({ page, perPage: 8, category, tag }),
    getBlogCategories(),
    getBlogTags()
  ]);

  const [featuredPost, ...remainingPosts] = posts;
  const spotlightPosts = remainingPosts.slice(0, 2);
  const gridPosts = remainingPosts.slice(2);
  const paginationItems = getPaginationItems(pagination.page, pagination.totalPages);
  const breadcrumbs = [
    { name: "Trang chu", href: "/" },
    { name: "Blog", href: "/blog" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(15,142,164,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(255,122,26,0.14),transparent_20%),linear-gradient(135deg,#ecfbff_0%,#fff8ef_52%,#ffffff_100%)] px-6 py-8 shadow-[0_30px_90px_rgba(21,48,74,0.08)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute -right-16 top-6 h-56 w-56 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute left-10 top-24 h-44 w-44 rounded-full bg-ocean/10 blur-3xl" />

        <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <div>
            <BlogBreadcrumbs items={breadcrumbs} />

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-ocean">
              WordPress Headless Blog
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
              Cam nang du lich Vinh Hy theo phong cach tap chi du lich hien dai, doc nhanh tren mobile va toi uu SEO.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Blog duoc lay truc tiep tu WordPress REST API, con cac luong tour va booking van giu nguyen tren Node.js.
              Noi dung uu tien nhung bai viet thuc dung de giup khach hang len lich trinh de hon.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                {pagination.total} bai viet
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                {categories.length} category
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                {tags.length} tag
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                ISR 60 giay
              </span>
            </div>

            {filters.selectedCategory || filters.selectedTag ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {filters.selectedCategory ? (
                  <span className="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white">
                    Category: {filters.selectedCategory.name}
                  </span>
                ) : null}
                {filters.selectedTag ? (
                  <span className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white">
                    Tag: #{filters.selectedTag.name}
                  </span>
                ) : null}
                <Link
                  href="/blog"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean"
                >
                  Xoa bo loc
                </Link>
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Moi cap nhat</p>
            <div className="mt-4 space-y-4">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-[24px] border border-slate-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{formatDate(post.date)}</p>
                  <h2 className="mt-2 text-lg font-semibold text-ink">{post.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                </Link>
              ))}

              {posts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
                  Chua tim thay bai viet phu hop voi bo loc hien tai.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-wrap gap-3">
          <Link
            href={buildBlogHref({ page: 1, tag })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !category ? "bg-ink text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-ocean hover:text-ocean"
            }`}
          >
            Tat ca category
          </Link>
          {categories.slice(0, 8).map((item) => (
            <Link
              key={item.id || item.slug}
              href={buildBlogHref({ page: 1, category: item.slug, tag })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item.slug
                  ? "bg-ink text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-ocean hover:text-ocean"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:justify-end">
          <Link
            href={buildBlogHref({ page: 1, category })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !tag ? "bg-sand text-coral" : "border border-slate-200 bg-white text-slate-600 hover:border-coral hover:text-coral"
            }`}
          >
            Tat ca tag
          </Link>
          {tags.slice(0, 6).map((item) => (
            <Link
              key={item.id || item.slug}
              href={buildBlogHref({ page: 1, category, tag: item.slug })}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                tag === item.slug
                  ? "bg-sand text-coral"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-coral hover:text-coral"
              }`}
            >
              #{item.name}
            </Link>
          ))}
        </div>
      </section>

      {featuredPost ? (
        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
          <BlogCard post={featuredPost} featured />

          <div className="space-y-6">
            {spotlightPosts.map((post) => (
              <BlogCard key={post.slug} post={post} compact />
            ))}

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Doc theo chu de</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.slice(0, 10).map((item) => (
                  <Link
                    key={item.id || item.slug}
                    href={buildBlogHref({ page: 1, category: item.slug, tag })}
                    className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky hover:text-ocean"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {gridPosts.length > 0 ? (
        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Tat ca bai viet</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Bo suu tap cam nang du lich</h2>
            </div>
            <p className="text-sm leading-7 text-slate-500">
              Trang {pagination.page}/{pagination.totalPages}
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gridPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 rounded-[32px] border border-slate-200 bg-white px-5 py-6 shadow-soft sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Pagination</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Dieu huong ISR cho blog headless. Moi trang se tu dong cap nhat lai sau 60 giay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildBlogHref({ page: Math.max(1, pagination.page - 1), category, tag })}
              aria-disabled={!pagination.hasPreviousPage}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pagination.hasPreviousPage
                  ? "border border-slate-200 bg-white text-slate-700 hover:border-ocean hover:text-ocean"
                  : "pointer-events-none cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Trang truoc
            </Link>

            {paginationItems.map((item) => (
              <Link
                key={item}
                href={buildBlogHref({ page: item, category, tag })}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                  item === pagination.page
                    ? "bg-ink text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-ocean hover:text-ocean"
                }`}
              >
                {item}
              </Link>
            ))}

            <Link
              href={buildBlogHref({ page: Math.min(pagination.totalPages, pagination.page + 1), category, tag })}
              aria-disabled={!pagination.hasNextPage}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pagination.hasNextPage
                  ? "border border-slate-200 bg-white text-slate-700 hover:border-ocean hover:text-ocean"
                  : "pointer-events-none cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Trang sau
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
