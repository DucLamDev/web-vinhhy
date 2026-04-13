import { fallbackPosts } from "./mock-data";
import { absoluteUrl, stripHtml } from "./utils";

const DEFAULT_WORDPRESS_API_ROOT = "https://letsflytravel.vn/wp-json/wp/v2";
const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
const BLOG_REVALIDATE_SECONDS = 60;
const TAXONOMY_REVALIDATE_SECONDS = 300;
const DEFAULT_POSTS_PER_PAGE = 9;

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " "
};

const decodeHtmlEntities = (value = "") =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&(amp|lt|gt|quot|nbsp);|&#39;/g, (match) => ENTITY_MAP[match] || match);

const clampPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const normalizeApiRoot = (value) => {
  const source = `${value || ""}`.trim();

  if (!source) {
    return DEFAULT_WORDPRESS_API_ROOT;
  }

  const trimmed = source.replace(/\/+$/, "");

  if (trimmed.endsWith("/wp-json/wp/v2/posts")) {
    return trimmed.replace(/\/posts$/, "");
  }

  if (trimmed.endsWith("/wp-json/wp/v2")) {
    return trimmed;
  }

  if (trimmed.endsWith("/wp-json")) {
    return `${trimmed}/wp/v2`;
  }

  if (trimmed.endsWith("/posts")) {
    return trimmed.replace(/\/posts$/, "");
  }

  return `${trimmed}/wp-json/wp/v2`;
};

const getWordPressApiBaseUrl = () =>
  normalizeApiRoot(
    process.env.WORDPRESS_API_URL ||
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      process.env.NEXT_PUBLIC_WORDPRESS_API_ROOT ||
      DEFAULT_WORDPRESS_API_ROOT
  );

const buildWordPressUrl = (endpoint, searchParams = {}) => {
  const url = new URL(`${getWordPressApiBaseUrl()}/${endpoint.replace(/^\/+/, "")}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

const withLazyImages = (html = "") =>
  html
    .replace(/<img(?![^>]*\sloading=)/gi, '<img loading="lazy"')
    .replace(/<img(?![^>]*\sdecoding=)/gi, '<img decoding="async"')
    .replace(/<img(?![^>]*\sclass=)/gi, '<img class="wp-content-image"');

const getReadingTimeMinutes = (html = "") => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const normalizeImage = (image, fallbackAlt = "") => {
  if (!image) {
    return {
      url: DEFAULT_BLOG_IMAGE,
      alt: fallbackAlt,
      width: 1200,
      height: 800
    };
  }

  if (typeof image === "string") {
    return {
      url: image,
      alt: fallbackAlt,
      width: 1200,
      height: 800
    };
  }

  return {
    url:
      image.source_url ||
      image.url ||
      image.media_details?.sizes?.full?.source_url ||
      image.media_details?.sizes?.large?.source_url ||
      DEFAULT_BLOG_IMAGE,
    alt: image.alt_text || image.alt || fallbackAlt,
    width:
      image.media_details?.width ||
      image.media_details?.sizes?.full?.width ||
      image.width ||
      1200,
    height:
      image.media_details?.height ||
      image.media_details?.sizes?.full?.height ||
      image.height ||
      800
  };
};

const getEmbeddedTerms = (post, taxonomy) => {
  const termGroups = Array.isArray(post?._embedded?.["wp:term"]) ? post._embedded["wp:term"] : [];
  return termGroups.flat().filter((term) => term?.taxonomy === taxonomy);
};

const normalizeTerm = (term = {}) => ({
  id: term.id || term.term_id || 0,
  slug: term.slug || "",
  name: decodeHtmlEntities(stripHtml(term.name || "")),
  count: Number(term.count || 0),
  link: term.link || "",
  taxonomy: term.taxonomy || ""
});

const extractMetaTag = (html = "", attribute, value) => {
  const attrPattern = `${attribute}=["']${value}["']`;
  const contentAfterAttr = new RegExp(
    `<meta[^>]*${attrPattern}[^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const contentBeforeAttr = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*${attrPattern}[^>]*>`,
    "i"
  );

  return decodeHtmlEntities(
    html.match(contentAfterAttr)?.[1] ||
      html.match(contentBeforeAttr)?.[1] ||
      ""
  );
};

const extractCanonical = (html = "") =>
  decodeHtmlEntities(html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || "");

const extractTitleFromHead = (html = "") =>
  decodeHtmlEntities(stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ""));

const extractJsonLd = (html = "") => html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim() || "";

const normalizeSeo = (post, fallbackTitle, fallbackDescription, fallbackImage) => {
  const yoast = post?.yoast_head_json || {};
  const headHtml = post?.yoast_head || post?.rank_math_head || "";
  const meta = post?.meta || {};

  const rankMathTitle =
    meta.rank_math_title ||
    meta._rank_math_title ||
    "";
  const rankMathDescription =
    meta.rank_math_description ||
    meta._rank_math_description ||
    "";

  const ogImage = normalizeImage(
    yoast.og_image?.[0]?.url
      ? {
          url: yoast.og_image[0].url,
          width: yoast.og_image[0].width,
          height: yoast.og_image[0].height,
          alt: yoast.og_image[0].alt
        }
      : extractMetaTag(headHtml, "property", "og:image") ||
          extractMetaTag(headHtml, "name", "twitter:image") ||
          meta.rank_math_facebook_image ||
          meta._rank_math_facebook_image ||
          fallbackImage,
    fallbackTitle
  );

  return {
    metaTitle:
      decodeHtmlEntities(
        yoast.title ||
          rankMathTitle ||
          extractTitleFromHead(headHtml) ||
          fallbackTitle
      ) || fallbackTitle,
    metaDescription:
      decodeHtmlEntities(
        yoast.description ||
          rankMathDescription ||
          extractMetaTag(headHtml, "name", "description") ||
          extractMetaTag(headHtml, "property", "og:description") ||
          fallbackDescription
      ) || fallbackDescription,
    canonicalUrl:
      yoast.canonical ||
      meta.rank_math_canonical_url ||
      meta._rank_math_canonical_url ||
      extractCanonical(headHtml) ||
      absoluteUrl(`/blog/${post?.slug || ""}`),
    ogImage,
    jsonLd:
      (yoast.schema ? JSON.stringify(yoast.schema) : "") ||
      extractJsonLd(headHtml)
  };
};

const normalizeAuthor = (author = {}) => ({
  id: author.id || 0,
  name: author.name || "Tour Vinh Hy",
  slug: author.slug || "",
  avatar:
    author.avatar_urls?.["96"] ||
    author.avatar_urls?.["48"] ||
    ""
});

const normalizeWordPressPost = (post = {}) => {
  const title = decodeHtmlEntities(stripHtml(post.title?.rendered || post.title || "Cam nang du lich"));
  const excerpt = decodeHtmlEntities(stripHtml(post.excerpt?.rendered || post.excerpt || ""));
  const contentHtml = withLazyImages(post.content?.rendered || post.content || "");
  const featuredImage = normalizeImage(post?._embedded?.["wp:featuredmedia"]?.[0], title);
  const categories = getEmbeddedTerms(post, "category").map(normalizeTerm);
  const tags = getEmbeddedTerms(post, "post_tag").map(normalizeTerm);
  const seo = normalizeSeo(post, title, excerpt, featuredImage);

  return {
    id: post.id || 0,
    slug: post.slug || "",
    title,
    excerpt,
    contentHtml,
    content: contentHtml,
    date: post.date || post.modified || null,
    publishedAt: post.date || null,
    updatedAt: post.modified || post.date || null,
    link: post.link || absoluteUrl(`/blog/${post.slug || ""}`),
    featuredImage,
    categories,
    categoryIds: Array.isArray(post.categories) ? post.categories : categories.map((item) => item.id),
    tags,
    tagIds: Array.isArray(post.tags) ? post.tags : tags.map((item) => item.id),
    author: normalizeAuthor(post?._embedded?.author?.[0]),
    readingTime: getReadingTimeMinutes(contentHtml),
    seo
  };
};

const normalizeFallbackPost = (post = {}) => {
  const title = decodeHtmlEntities(stripHtml(post.title || "Cam nang du lich"));
  const excerpt = decodeHtmlEntities(stripHtml(post.excerpt || ""));
  const featuredImage = normalizeImage(post.featuredImage, title);

  return {
    id: post.id || 0,
    slug: post.slug || "",
    title,
    excerpt,
    contentHtml: withLazyImages(post.content || ""),
    content: withLazyImages(post.content || ""),
    date: post.date || null,
    publishedAt: post.date || null,
    updatedAt: post.date || null,
    link: absoluteUrl(`/blog/${post.slug || ""}`),
    featuredImage,
    categories: Array.isArray(post.categories) ? post.categories.map(normalizeTerm) : [],
    categoryIds: Array.isArray(post.categories) ? post.categories.map((item) => item.id).filter(Boolean) : [],
    tags: Array.isArray(post.tags) ? post.tags.map(normalizeTerm) : [],
    tagIds: Array.isArray(post.tags) ? post.tags.map((item) => item.id).filter(Boolean) : [],
    author: {
      id: 0,
      name: "Tour Vinh Hy",
      slug: "",
      avatar: ""
    },
    readingTime: getReadingTimeMinutes(post.content || ""),
    seo: {
      metaTitle: `${title} | Blog du lich Vinh Hy`,
      metaDescription: excerpt,
      canonicalUrl: absoluteUrl(`/blog/${post.slug || ""}`),
      ogImage: featuredImage,
      jsonLd: ""
    }
  };
};

const fallbackBlogPosts = fallbackPosts.map(normalizeFallbackPost);

const fetchWordPressJson = async (
  endpoint,
  { searchParams = {}, revalidate = BLOG_REVALIDATE_SECONDS, tags = [] } = {}
) => {
  const response = await fetch(buildWordPressUrl(endpoint, searchParams), {
    next: {
      revalidate,
      tags: ["wordpress", ...tags]
    }
  });

  if (!response.ok) {
    throw new Error(`WordPress request failed: ${response.status}`);
  }

  return {
    data: await response.json(),
    total: Number(response.headers.get("x-wp-total") || 0),
    totalPages: Number(response.headers.get("x-wp-totalpages") || 0)
  };
};

const getFilteredFallbackPosts = ({ category, tag }) =>
  fallbackBlogPosts.filter((post) => {
    const matchCategory = !category || post.categories.some((item) => item.slug === category);
    const matchTag = !tag || post.tags.some((item) => item.slug === tag);
    return matchCategory && matchTag;
  });

const paginateItems = (items, page, perPage) => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * perPage;

  return {
    items: items.slice(startIndex, startIndex + perPage),
    pagination: {
      page: safePage,
      perPage,
      total,
      totalPages,
      hasPreviousPage: safePage > 1,
      hasNextPage: safePage < totalPages
    }
  };
};

const resolveFilterTerms = async ({ category, tag }) => {
  if (!category && !tag) {
    return {
      categoryId: null,
      tagId: null,
      selectedCategory: null,
      selectedTag: null
    };
  }

  const [categories, tags] = await Promise.all([getBlogCategories(), getBlogTags()]);
  const selectedCategory = category ? categories.find((item) => item.slug === category) || null : null;
  const selectedTag = tag ? tags.find((item) => item.slug === tag) || null : null;

  return {
    categoryId: selectedCategory?.id || null,
    tagId: selectedTag?.id || null,
    selectedCategory,
    selectedTag
  };
};

export async function getBlogCategories() {
  try {
    const { data } = await fetchWordPressJson("categories", {
      searchParams: {
        per_page: 100,
        orderby: "count",
        order: "desc"
      },
      revalidate: TAXONOMY_REVALIDATE_SECONDS,
      tags: ["wordpress-categories"]
    });

    return data.map(normalizeTerm);
  } catch (_error) {
    const categories = fallbackBlogPosts.flatMap((post) => post.categories);
    return Array.from(new Map(categories.map((item) => [item.slug, item])).values());
  }
}

export async function getBlogTags() {
  try {
    const { data } = await fetchWordPressJson("tags", {
      searchParams: {
        per_page: 100,
        orderby: "count",
        order: "desc"
      },
      revalidate: TAXONOMY_REVALIDATE_SECONDS,
      tags: ["wordpress-tags"]
    });

    return data.map(normalizeTerm);
  } catch (_error) {
    const tags = fallbackBlogPosts.flatMap((post) => post.tags);
    return Array.from(new Map(tags.map((item) => [item.slug, item])).values());
  }
}

export async function getBlogPostsPage({
  page = 1,
  perPage = DEFAULT_POSTS_PER_PAGE,
  category = "",
  tag = ""
} = {}) {
  const resolvedPage = clampPositiveInteger(page, 1);
  const resolvedPerPage = clampPositiveInteger(perPage, DEFAULT_POSTS_PER_PAGE);
  const filterTerms = await resolveFilterTerms({ category, tag });

  if ((category && !filterTerms.selectedCategory) || (tag && !filterTerms.selectedTag)) {
    return {
      items: [],
      pagination: {
        page: 1,
        perPage: resolvedPerPage,
        total: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      },
      filters: filterTerms
    };
  }

  try {
    const { data, total, totalPages } = await fetchWordPressJson("posts", {
      searchParams: {
        _embed: 1,
        page: resolvedPage,
        per_page: resolvedPerPage,
        orderby: "date",
        order: "desc",
        categories: filterTerms.categoryId,
        tags: filterTerms.tagId
      },
      tags: [
        "wordpress-posts",
        `wordpress-posts-page-${resolvedPage}`,
        filterTerms.categoryId ? `wordpress-category-${filterTerms.categoryId}` : "",
        filterTerms.tagId ? `wordpress-tag-${filterTerms.tagId}` : ""
      ].filter(Boolean)
    });

    return {
      items: data.map(normalizeWordPressPost),
      pagination: {
        page: resolvedPage,
        perPage: resolvedPerPage,
        total,
        totalPages: Math.max(totalPages, 1),
        hasPreviousPage: resolvedPage > 1,
        hasNextPage: resolvedPage < Math.max(totalPages, 1)
      },
      filters: filterTerms
    };
  } catch (_error) {
    const { items, pagination } = paginateItems(
      getFilteredFallbackPosts({ category, tag }),
      resolvedPage,
      resolvedPerPage
    );

    return {
      items,
      pagination,
      filters: filterTerms
    };
  }
}

export async function getBlogPostBySlug(slug) {
  if (!slug) return null;

  try {
    const { data } = await fetchWordPressJson("posts", {
      searchParams: {
        _embed: 1,
        slug
      },
      tags: [`wordpress-post-${slug}`]
    });

    return data.length > 0 ? normalizeWordPressPost(data[0]) : null;
  } catch (_error) {
    return fallbackBlogPosts.find((post) => post.slug === slug) || null;
  }
}

export async function getRelatedBlogPosts(post, limit = 3) {
  if (!post?.id) return [];

  try {
    const { data } = await fetchWordPressJson("posts", {
      searchParams: {
        _embed: 1,
        per_page: limit,
        exclude: post.id,
        categories: post.categoryIds?.[0] || undefined,
        orderby: "date",
        order: "desc"
      },
      tags: [`wordpress-related-${post.id}`]
    });

    return data.map(normalizeWordPressPost).filter((item) => item.slug !== post.slug).slice(0, limit);
  } catch (_error) {
    return fallbackBlogPosts.filter((item) => item.slug !== post.slug).slice(0, limit);
  }
}

export async function getBlogSlugs(limit = 50) {
  try {
    const { data } = await fetchWordPressJson("posts", {
      searchParams: {
        per_page: clampPositiveInteger(limit, 50),
        _fields: "slug"
      },
      tags: ["wordpress-slugs"]
    });

    return data.map((item) => item.slug).filter(Boolean);
  } catch (_error) {
    return fallbackBlogPosts.map((item) => item.slug).filter(Boolean);
  }
}

export const getBlogPosts = async (limit = 6) => {
  const { items } = await getBlogPostsPage({ perPage: limit });
  return items;
};
