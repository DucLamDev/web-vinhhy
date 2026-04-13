const createId = (prefix = "section") => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const HTML_ENTITY_MAP = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " "
};

export const SECTION_TYPES = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "html", label: "Custom HTML" }
];

export const createEmptyMediaAsset = () => ({
  url: "",
  publicId: "",
  alt: "",
  width: null,
  height: null,
  format: ""
});

export const createSection = (type = "text") => ({
  id: createId(type),
  type,
  headingLevel: "h2",
  body: "",
  image: createEmptyMediaAsset(),
  caption: "",
  imageDisplay: {
    width: "wide",
    ratio: "landscape"
  }
});

export const normalizeMediaAsset = (asset) => {
  if (!asset) return createEmptyMediaAsset();

  if (typeof asset === "string") {
    return {
      ...createEmptyMediaAsset(),
      url: asset
    };
  }

  return {
    ...createEmptyMediaAsset(),
    ...asset
  };
};

export const decodeStoredHtml = (value = "") =>
  `${value || ""}`
    .replace(/&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;/g, (match) => HTML_ENTITY_MAP[match] || match)
    .replace(/&amp;(?=(lt;|gt;|quot;|#39;|nbsp;))/g, "&");

export const normalizeHtmlForRendering = (value = "") => {
  const source = `${value || ""}`.trim();
  if (!source) return "";

  if (/&lt;(p|div|h[1-6]|table|tbody|tr|td|th|ul|ol|li|figure|img|iframe|blockquote|br|strong|em)\b/i.test(source)) {
    return decodeStoredHtml(source);
  }

  return source;
};

export const normalizeHtmlForEditing = (value = "") => normalizeHtmlForRendering(value);

export const normalizeSection = (section, index = 0) => ({
  id: section?.id || createId(`${section?.type || "section"}-${index}`),
  type: ["heading", "text", "image", "html"].includes(section?.type) ? section.type : "text",
  headingLevel: ["h1", "h2", "h3", "h4"].includes(section?.headingLevel) ? section.headingLevel : "h2",
  body: section?.type === "html" ? normalizeHtmlForEditing(section?.body || "") : section?.body || "",
  image: normalizeMediaAsset(section?.image),
  caption: section?.caption || "",
  imageDisplay: {
    width: ["full", "wide", "narrow"].includes(section?.imageDisplay?.width) ? section.imageDisplay.width : "wide",
    ratio: ["original", "landscape", "square", "portrait"].includes(section?.imageDisplay?.ratio) ? section.imageDisplay.ratio : "landscape"
  }
});

export const normalizePost = (post = {}) => {
  const legacySections =
    Array.isArray(post.contentSections) && post.contentSections.length > 0
      ? post.contentSections
      : post.content
        ? [{ id: createId("legacy"), type: "text", body: post.content, headingLevel: "h2", image: createEmptyMediaAsset(), caption: "" }]
        : [createSection("text")];

  return {
    _id: post._id || "",
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    status: post.status || (post.published ? "published" : "draft"),
    contentSections: legacySections.map(normalizeSection),
    featuredImage: normalizeMediaAsset(post.featuredImage),
    categories: Array.isArray(post.categories) ? post.categories : [],
    tags: Array.isArray(post.tags) ? post.tags : [],
    seo: {
      metaTitle: post.seo?.metaTitle || "",
      metaDescription: post.seo?.metaDescription || "",
      canonicalUrl: post.seo?.canonicalUrl || "",
      jsonLd: post.seo?.jsonLd || "",
      ogImage: normalizeMediaAsset(post.seo?.ogImage)
    },
    scheduledAt: post.scheduledAt || "",
    publishedAt: post.publishedAt || "",
    previewToken: post.previewToken || "",
    author: post.author || null,
    createdAt: post.createdAt || "",
    updatedAt: post.updatedAt || ""
  };
};

export const getPostImage = (post = {}) => {
  const featured = normalizeMediaAsset(post.featuredImage);
  if (featured.url) return featured;
  const ogImage = normalizeMediaAsset(post.seo?.ogImage);
  if (ogImage.url) return ogImage;
  const imageSection = (post.contentSections || []).find((section) => section.type === "image" && section.image?.url);
  return normalizeMediaAsset(imageSection?.image);
};

export const extractPlainText = (post = {}) => {
  const fromSections = (post.contentSections || [])
    .map((section) => {
      if (section.type === "image") {
        return section.caption || section.image?.alt || "";
      }

      return normalizeHtmlForRendering(section.body || "").replace(/<[^>]+>/g, " ");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return fromSections || (post.excerpt || "");
};
