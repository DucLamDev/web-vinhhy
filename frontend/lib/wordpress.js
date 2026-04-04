import { fallbackPosts } from "./mock-data";
import { stripHtml } from "./utils";

const getWordPressApiUrl = () => process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

const normalizePost = (post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title?.rendered || "Bài viết du lịch",
  excerpt: stripHtml(post.excerpt?.rendered || ""),
  content: post.content?.rendered || "",
  date: post.date,
  featuredImage:
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  yoastTitle: post.yoast_head_json?.title || "",
  yoastDescription: post.yoast_head_json?.description || ""
});

export const getBlogPosts = async (limit = 6) => {
  const apiUrl = getWordPressApiUrl();

  if (!apiUrl) {
    return fallbackPosts.slice(0, limit);
  }

  try {
    const response = await fetch(`${apiUrl}/posts?_embed&per_page=${limit}`, {
      next: { revalidate: 900, tags: ["blog"] }
    });

    if (!response.ok) {
      throw new Error("Unable to fetch WordPress posts");
    }

    const posts = await response.json();
    return posts.map(normalizePost);
  } catch (_error) {
    return fallbackPosts.slice(0, limit);
  }
};

export const getBlogPostBySlug = async (slug) => {
  const apiUrl = getWordPressApiUrl();

  if (!apiUrl) {
    return fallbackPosts.find((post) => post.slug === slug) || null;
  }

  try {
    const response = await fetch(`${apiUrl}/posts?_embed&slug=${slug}`, {
      next: { revalidate: 900, tags: [`blog-${slug}`] }
    });

    if (!response.ok) {
      throw new Error("Unable to fetch WordPress post");
    }

    const posts = await response.json();
    return posts.length > 0 ? normalizePost(posts[0]) : null;
  } catch (_error) {
    return fallbackPosts.find((post) => post.slug === slug) || null;
  }
};
