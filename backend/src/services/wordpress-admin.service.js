import { Buffer } from "buffer";

import { ApiError } from "../utils/api-error.js";

const DEFAULT_WORDPRESS_API_ROOT = "https://letsflytravel.vn/wp-json/wp/v2";

const normalizeApiRoot = (value = "") => {
  const trimmed = value.trim().replace(/\/+$/, "");

  if (!trimmed) return DEFAULT_WORDPRESS_API_ROOT;
  if (trimmed.endsWith("/wp-json/wp/v2/posts")) return trimmed.replace(/\/posts$/, "");
  if (trimmed.endsWith("/wp-json/wp/v2")) return trimmed;
  if (trimmed.endsWith("/wp-json")) return `${trimmed}/wp/v2`;
  if (trimmed.endsWith("/posts")) return trimmed.replace(/\/posts$/, "");
  return `${trimmed}/wp-json/wp/v2`;
};

const getWordPressApiRoot = () =>
  normalizeApiRoot(process.env.WORDPRESS_API_URL || process.env.WORDPRESS_API_ROOT || DEFAULT_WORDPRESS_API_ROOT);

const getWordPressAuthHeader = () => {
  const username = process.env.WORDPRESS_USERNAME || "";
  const password = process.env.WORDPRESS_APP_PASSWORD || "";

  if (!username || !password) return "";

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
};

export const isWordPressAdminEnabled = () => Boolean(getWordPressAuthHeader());

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${getWordPressApiRoot()}/${endpoint.replace(/^\/+/, "")}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

const requestWordPress = async (endpoint, { method = "GET", params = {}, body, headers = {}, responseType = "json" } = {}) => {
  const authHeader = getWordPressAuthHeader();

  if (!authHeader) {
    throw new ApiError(500, "WordPress admin credentials are not configured");
  }

  const response = await fetch(buildUrl(endpoint, params), {
    method,
    headers: {
      Authorization: authHeader,
      ...(body !== undefined && !headers["Content-Type"] ? { "Content-Type": "application/json" } : {}),
      ...headers
    },
    ...(body !== undefined ? { body: headers["Content-Type"] ? body : JSON.stringify(body) } : {})
  });

  const responseBody =
    responseType === "json"
      ? await response.json().catch(() => ({}))
      : await response.text().catch(() => "");

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseBody?.message || "WordPress request failed"
    );
  }

  return {
    data: responseBody,
    total: Number(response.headers.get("x-wp-total") || 0),
    totalPages: Number(response.headers.get("x-wp-totalpages") || 0)
  };
};

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const toStatus = (status = "") => {
  if (status === "published") return "publish";
  if (status === "scheduled") return "future";
  return "draft";
};

const fromStatus = (status = "") => {
  if (status === "publish") return "published";
  if (status === "future") return "scheduled";
  return "draft";
};

const buildLegacyHtml = (contentSections = []) =>
  contentSections
    .map((section) => {
      if (section.type === "heading") {
        return `<${section.headingLevel}>${section.body || ""}</${section.headingLevel}>`;
      }

      if (section.type === "text" || section.type === "html") {
        return section.body || "";
      }

      if (section.type === "image" && section.image?.url) {
        const alt = section.image.alt || "";
        const caption = section.caption ? `<figcaption>${section.caption}</figcaption>` : "";
        return `<figure><img src="${section.image.url}" alt="${alt}" />${caption}</figure>`;
      }

      return "";
    })
    .join("\n");

const normalizeTerm = (term = {}) => ({
  _id: String(term.id || ""),
  id: term.id || 0,
  name: term.name || "",
  slug: term.slug || "",
  description: term.description || ""
});

const getEmbeddedTerms = (post, taxonomy) => {
  const groups = Array.isArray(post?._embedded?.["wp:term"]) ? post._embedded["wp:term"] : [];
  return groups.flat().filter((term) => term?.taxonomy === taxonomy).map(normalizeTerm);
};

const normalizeMedia = (media, fallbackTitle = "") => ({
  url: media?.source_url || "",
  publicId: media?.id ? String(media.id) : "",
  alt: media?.alt_text || fallbackTitle,
  width: media?.media_details?.width || null,
  height: media?.media_details?.height || null,
  format: media?.media_details?.file?.split(".").pop() || ""
});

const sanitizeFileName = (value = "image") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "image";

const guessFileExtension = (contentType = "", fallbackUrl = "") => {
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("svg")) return "svg";

  try {
    const pathname = new URL(fallbackUrl).pathname;
    const fromPath = pathname.split(".").pop();
    if (fromPath && fromPath.length <= 5) return fromPath.toLowerCase();
  } catch (_error) {
    return "";
  }

  return "";
};

const normalizeSeoInput = (seo = {}) => ({
  metaTitle: `${seo.metaTitle || ""}`.trim(),
  metaDescription: `${seo.metaDescription || ""}`.trim(),
  canonicalUrl: `${seo.canonicalUrl || seo.canonical || ""}`.trim(),
  ogImage: seo.ogImage || seo["og:image"] || {}
});

const buildSeoMetaPayload = ({ seo = {}, ogImageMediaId } = {}) => {
  const normalized = normalizeSeoInput(seo);
  const ogImageUrl = normalized.ogImage?.url || "";
  const meta = {};

  if (normalized.metaTitle) {
    meta.rank_math_title = normalized.metaTitle;
    meta._yoast_wpseo_title = normalized.metaTitle;
  }

  if (normalized.metaDescription) {
    meta.rank_math_description = normalized.metaDescription;
    meta._yoast_wpseo_metadesc = normalized.metaDescription;
  }

  if (normalized.canonicalUrl) {
    meta.rank_math_canonical_url = normalized.canonicalUrl;
    meta._yoast_wpseo_canonical = normalized.canonicalUrl;
  }

  if (ogImageUrl) {
    meta.rank_math_facebook_image = ogImageUrl;
    meta.rank_math_twitter_image = ogImageUrl;
    meta["_yoast_wpseo_opengraph-image"] = ogImageUrl;
    meta["_yoast_wpseo_twitter-image"] = ogImageUrl;
  }

  if (ogImageMediaId) {
    meta["_yoast_wpseo_opengraph-image-id"] = String(ogImageMediaId);
    meta["_yoast_wpseo_twitter-image-id"] = String(ogImageMediaId);
  }

  return meta;
};

const uploadWordPressMediaFromUrl = async (asset = {}, { fallbackTitle = "", cache = new Map() } = {}) => {
  const sourceUrl = `${asset?.url || ""}`.trim();
  if (!sourceUrl) return null;

  const cacheKey = `${sourceUrl}|${asset?.alt || ""}|${fallbackTitle}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const sourceResponse = await fetch(sourceUrl);
  if (!sourceResponse.ok) {
    throw new ApiError(sourceResponse.status, `Unable to fetch media source: ${sourceUrl}`);
  }

  const contentType = sourceResponse.headers.get("content-type") || "application/octet-stream";
  const arrayBuffer = await sourceResponse.arrayBuffer();
  const extension = guessFileExtension(contentType, sourceUrl);
  const baseName = sanitizeFileName(asset?.alt || fallbackTitle || "image");
  const fileName = extension ? `${baseName}.${extension}` : baseName;

  const { data } = await requestWordPress("media", {
    method: "POST",
    body: Buffer.from(arrayBuffer),
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`
    }
  });

  const mediaId = data?.id;
  if (!mediaId) {
    throw new ApiError(500, "WordPress media upload did not return an id");
  }

  const patchPayload = {
    alt_text: asset?.alt || fallbackTitle || "",
    title: { raw: asset?.alt || fallbackTitle || fileName }
  };

  const { data: updatedMedia } = await requestWordPress(`media/${mediaId}`, {
    method: "POST",
    body: patchPayload
  });

  cache.set(cacheKey, updatedMedia);
  return updatedMedia;
};

const normalizePost = (post = {}) => {
  const title = post.title?.raw || post.title?.rendered || "";
  const contentRaw = post.content?.raw || "";
  const contentRendered = post.content?.rendered || contentRaw;

  return {
    _id: String(post.id || ""),
    title,
    slug: post.slug || "",
    excerpt: stripHtml(post.excerpt?.raw || post.excerpt?.rendered || ""),
    content: contentRendered,
    contentSections: contentRaw
      ? [
          {
            id: `legacy-${post.id || "post"}`,
            type: "text",
            headingLevel: "h2",
            body: contentRaw,
            image: { url: "", publicId: "", alt: "", width: null, height: null, format: "" },
            caption: "",
            imageDisplay: {
              width: "wide",
              ratio: "landscape"
            }
          }
        ]
      : [],
    status: fromStatus(post.status),
    published: post.status === "publish",
    featuredImage: normalizeMedia(post?._embedded?.["wp:featuredmedia"]?.[0], title),
    categories: getEmbeddedTerms(post, "category"),
    tags: getEmbeddedTerms(post, "post_tag"),
    seo: {
      metaTitle: post.meta?.rank_math_title || post.meta?._yoast_wpseo_title || "",
      metaDescription: post.meta?.rank_math_description || post.meta?._yoast_wpseo_metadesc || "",
      ogImage: {
        url:
          post.meta?.rank_math_facebook_image ||
          post.meta?.rank_math_twitter_image ||
          post.meta?.["_yoast_wpseo_opengraph-image"] ||
          post.meta?.["_yoast_wpseo_twitter-image"] ||
          "",
        publicId: "",
        alt: "",
        width: null,
        height: null,
        format: ""
      },
      canonicalUrl: post.meta?.rank_math_canonical_url || post.meta?._yoast_wpseo_canonical || "",
      jsonLd: ""
    },
    scheduledAt: post.status === "future" ? post.date : "",
    publishedAt: post.date || "",
    previewToken: "",
    author: post?._embedded?.author?.[0]
      ? {
          name: post._embedded.author[0].name || "Admin"
        }
      : null,
    createdAt: post.date || "",
    updatedAt: post.modified || post.date || ""
  };
};

const extractRelationIds = (items = []) =>
  items
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string" || typeof item === "number") return Number(item);
      return Number(item.id || item._id || 0);
    })
    .filter((value) => Number.isFinite(value) && value > 0);

export const listWordPressPosts = async ({ search = "", status = "" } = {}) => {
  const params = {
    context: "edit",
    _embed: 1,
    per_page: 100,
    orderby: "date",
    order: "desc",
    search: search?.trim() || undefined
  };

  if (status) {
    params.status = toStatus(status);
  } else {
    params.status = "draft,publish,future";
  }

  const { data } = await requestWordPress("posts", { params });
  return data.map(normalizePost);
};

export const getWordPressPostById = async (id) => {
  const { data } = await requestWordPress(`posts/${id}`, {
    params: {
      context: "edit",
      _embed: 1
    }
  });

  return normalizePost(data);
};

export const createWordPressPost = async (input = {}) => {
  const title = `${input.title || ""}`.trim();

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const content = buildLegacyHtml(Array.isArray(input.contentSections) ? input.contentSections : []) || input.content || "";
  const mediaCache = new Map();
  const [featuredMedia, ogImageMedia] = await Promise.all([
    uploadWordPressMediaFromUrl(input.featuredImage, { fallbackTitle: title, cache: mediaCache }),
    uploadWordPressMediaFromUrl(input.seo?.ogImage, { fallbackTitle: `${title}-og`, cache: mediaCache })
  ]);

  const payload = {
    title,
    slug: input.slug || undefined,
    excerpt: input.excerpt || undefined,
    content,
    status: toStatus(input.status),
    featured_media: featuredMedia?.id || undefined
  };

  if (payload.status === "future" && input.scheduledAt) {
    payload.date = new Date(input.scheduledAt).toISOString();
  }

  const categoryIds = extractRelationIds(input.categories);
  const tagIds = extractRelationIds(input.tags);

  if (categoryIds.length) payload.categories = categoryIds;
  if (tagIds.length) payload.tags = tagIds;

  const seoMeta = buildSeoMetaPayload({
    seo: input.seo,
    ogImageMediaId: ogImageMedia?.id
  });

  if (Object.keys(seoMeta).length) {
    payload.meta = seoMeta;
  }

  const { data } = await requestWordPress("posts", {
    method: "POST",
    body: payload
  });

  return getWordPressPostById(data.id);
};

export const updateWordPressPost = async (id, input = {}) => {
  const existing = await getWordPressPostById(id);
  const content = buildLegacyHtml(Array.isArray(input.contentSections) ? input.contentSections : existing.contentSections) || input.content || existing.content || "";
  const mediaCache = new Map();
  const resolvedFeaturedImage = input.featuredImage || existing.featuredImage;
  const resolvedSeo = input.seo || existing.seo;
  const [featuredMedia, ogImageMedia] = await Promise.all([
    uploadWordPressMediaFromUrl(resolvedFeaturedImage, { fallbackTitle: input.title || existing.title, cache: mediaCache }),
    uploadWordPressMediaFromUrl(resolvedSeo?.ogImage, { fallbackTitle: `${input.title || existing.title}-og`, cache: mediaCache })
  ]);
  const payload = {
    title: input.title || existing.title,
    slug: input.slug || existing.slug,
    excerpt: input.excerpt ?? existing.excerpt,
    content,
    status: toStatus(input.status || existing.status),
    featured_media: featuredMedia?.id || 0
  };

  if (payload.status === "future" && input.scheduledAt) {
    payload.date = new Date(input.scheduledAt).toISOString();
  }

  if (input.categories) {
    payload.categories = extractRelationIds(input.categories);
  }

  if (input.tags) {
    payload.tags = extractRelationIds(input.tags);
  }

  const seoMeta = buildSeoMetaPayload({
    seo: resolvedSeo,
    ogImageMediaId: ogImageMedia?.id
  });

  payload.meta = seoMeta;

  const { data } = await requestWordPress(`posts/${id}`, {
    method: "POST",
    body: payload
  });

  return getWordPressPostById(data.id || id);
};

export const deleteWordPressPost = async (id) => {
  await requestWordPress(`posts/${id}`, {
    method: "DELETE",
    params: { force: true }
  });

  return { message: "Post deleted successfully" };
};

export const listWordPressTaxonomy = async (type) => {
  const { data } = await requestWordPress(type, {
    params: {
      context: "edit",
      per_page: 100,
      orderby: "name",
      order: "asc"
    }
  });

  return data.map(normalizeTerm);
};

export const createWordPressTaxonomy = async (type, payload = {}) => {
  const { data } = await requestWordPress(type, {
    method: "POST",
    body: {
      name: payload.name,
      slug: payload.slug || undefined,
      description: payload.description || ""
    }
  });

  return normalizeTerm(data);
};

export const updateWordPressTaxonomy = async (type, id, payload = {}) => {
  const { data } = await requestWordPress(`${type}/${id}`, {
    method: "POST",
    body: {
      name: payload.name,
      slug: payload.slug || undefined,
      description: payload.description || ""
    }
  });

  return normalizeTerm(data);
};

export const deleteWordPressTaxonomy = async (type, id) => {
  await requestWordPress(`${type}/${id}`, {
    method: "DELETE",
    params: { force: true }
  });

  return { message: "Deleted successfully" };
};
