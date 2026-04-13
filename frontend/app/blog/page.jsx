import Link from "next/link";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { buildMetadata } from "@/lib/seo";
import { getBlogCategories, getBlogPostsPage } from "@/lib/wordpress";

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
    title: "Cam nang du lich Vinh Hy | Lich trinh, kinh nghiem va diem dep nen di",
    description:
      "Tong hop bai viet huu ich cho chuyen di Vinh Hy: lich trinh de ap dung, diem tham quan noi bat, goi y an choi va kinh nghiem thuc te cho du khach.",
    path: "/blog"
  });
}

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams?.page || "1", 10) || 1;
  const category = resolvedSearchParams?.category || "";
  const tag = resolvedSearchParams?.tag || "";

  const [{ items: posts, pagination, filters }, categories] = await Promise.all([
    getBlogPostsPage({ page, perPage: 8, category, tag }),
    getBlogCategories()
  ]);

  const [featuredPost, ...remainingPosts] = posts;
  const spotlightPosts = remainingPosts.slice(0, 2);
  const gridPosts = remainingPosts.slice(2);
  const categoryLinks = categories.slice(0, 7);
  const latestPosts = posts.slice(0, 3);
  const paginationItems = getPaginationItems(pagination.page, pagination.totalPages);
  const breadcrumbs = [
    { name: "Trang chu", href: "/" },
    { name: "Cam nang", href: "/blog" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(15,142,164,0.12),transparent_26%),radial-gradient(circle_at_right,rgba(255,122,26,0.14),transparent_24%),linear-gradient(135deg,#f4fcff_0%,#fffaf4_52%,#ffffff_100%)] px-6 py-8 shadow-[0_30px_90px_rgba(21,48,74,0.08)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute -right-10 top-10 h-52 w-52 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-ocean/10 blur-3xl" />

        <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.3fr)_360px]">
          <div>
            <BlogBreadcrumbs items={breadcrumbs} />

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-ocean">
              Cam nang du lich Vinh Hy
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
              Bai viet gon, de doc va uu tien nhung goi y that su huu ich cho chuyen di Vinh Hy.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Tu lich trinh mot ngay, diem ngam san ho, Hang Rai cho den an gi o dau, tat ca duoc sap xep lai theo
              huong de tim, de doc va de ap dung ngay cho du khach.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                {pagination.total} bai viet huu ich
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                Goi y thuc te cho nguoi di lan dau
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm">
                Uu tien diem dep va lich trinh de ap dung
              </span>
            </div>

            {filters.selectedCategory || filters.selectedTag ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {filters.selectedCategory ? (
                  <span className="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white">
                    Dang xem chu de: {filters.selectedCategory.name}
                  </span>
                ) : null}
                {filters.selectedTag ? (
                  <span className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white">
                    Chu de lien quan: {filters.selectedTag.name}
                  </span>
                ) : null}
                <Link
                  href="/blog"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean"
                >
                  Xem tat ca bai viet
                </Link>
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Nen doc hom nay</p>
            <div className="mt-4 space-y-4">
              {latestPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-[24px] border border-slate-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                    <span>Lua chon {index + 1}</span>
                    <span>{post.readingTime || 1} phut doc</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold leading-snug text-ink">{post.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                </Link>
              ))}

              {posts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
                  Chua co bai viet phu hop voi chu de ban dang xem. Thu quay lai danh sach tat ca bai viet de kham pha
                  them.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href={buildBlogHref({ page: 1, tag })}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            !category ? "bg-ink text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-ocean hover:text-ocean"
          }`}
        >
          Tat ca chu de
        </Link>
        {categoryLinks.map((item) => (
          <Link
            key={item.id || item.slug}
            href={buildBlogHref({ page: 1, category: item.slug, tag })}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              category === item.slug
                ? "bg-ink text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-ocean hover:text-ocean"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </section>

      {featuredPost ? (
        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <BlogCard post={featuredPost} featured />

          <div className="space-y-6">
            {spotlightPosts.map((post) => (
              <BlogCard key={post.slug} post={post} compact />
            ))}

            <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#15304a_0%,#0f8ea4_100%)] p-6 text-white shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Goi y nhanh</p>
              <h2 className="mt-3 text-2xl font-semibold">Ban muon di Vinh Hy ma chua biet bat dau tu dau?</h2>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Bat dau tu bai viet noi bat, sau do xem them theo tung chu de nhu lich trinh, diem check-in, an uong
                va kinh nghiem dat tour de len ke hoach nhanh hon.
              </p>
              <Link
                href="/tour"
                className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sand"
              >
                Xem cac tour goi y
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-[34px] border border-slate-200 bg-white px-6 py-12 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Cam nang dang duoc cap nhat</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Chua co bai viet nao trong bo loc hien tai</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            Ban hay quay lai danh sach tong hoac chon mot chu de khac de xem them cac bai viet phu hop cho chuyen di
            sap toi.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ocean"
          >
            Tro ve danh sach bai viet
          </Link>
        </section>
      )}

      {gridPosts.length > 0 ? (
        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Danh sach bai viet</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Them nhieu goi y de ban de dang chon doc</h2>
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Dieu huong bai viet</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Di chuyen giua cac trang de xem them bai moi, kinh nghiem di bien va nhung goi y phu hop cho lich trinh
              cua ban.
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
