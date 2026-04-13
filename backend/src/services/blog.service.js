import { randomBytes } from "crypto";

import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import { ApiError } from "../utils/api-error.js";
import { slugify } from "../utils/slugify.js";
import {
  createWordPressPost,
  deleteWordPressPost,
  getWordPressPostById,
  isWordPressAdminEnabled,
  listWordPressPosts,
  updateWordPressPost
} from "./wordpress-admin.service.js";

const createPreviewToken = () => randomBytes(24).toString("hex");

const createSectionId = () => randomBytes(6).toString("hex");

const normalizeMediaAsset = (asset = {}) => ({
  url: asset?.url || "",
  publicId: asset?.publicId || "",
  alt: asset?.alt || "",
  width: asset?.width || null,
  height: asset?.height || null,
  format: asset?.format || ""
});

const normalizeSection = (section = {}, index = 0) => ({
  id: section.id || `${section.type || "section"}-${index}-${createSectionId()}`,
  type: ["heading", "text", "image", "html"].includes(section.type) ? section.type : "text",
  headingLevel: ["h1", "h2", "h3", "h4"].includes(section.headingLevel) ? section.headingLevel : "h2",
  body: section.body || "",
  image: normalizeMediaAsset(section.image),
  caption: section.caption || "",
  imageDisplay: {
    width: ["full", "wide", "narrow"].includes(section.imageDisplay?.width) ? section.imageDisplay.width : "wide",
    ratio: ["original", "landscape", "square", "portrait"].includes(section.imageDisplay?.ratio) ? section.imageDisplay.ratio : "landscape"
  }
});

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const buildExcerpt = ({ excerpt = "", contentSections = [], content = "" }) => {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  const fromSections = contentSections
    .map((section) => {
      if (section.type === "heading") {
        return stripHtml(section.body);
      }

      if (section.type === "text" || section.type === "html") {
        return stripHtml(section.body);
      }

      if (section.type === "image") {
        return section.caption || section.image?.alt || "";
      }

      return "";
    })
    .join(" ")
    .trim();

  const source = fromSections || stripHtml(content);
  return source.slice(0, 180).trim();
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

const normalizeSeo = (seo = {}) => ({
  metaTitle: seo.metaTitle || "",
  metaDescription: seo.metaDescription || "",
  ogImage: normalizeMediaAsset(seo.ogImage),
  canonicalUrl: seo.canonicalUrl || "",
  jsonLd: seo.jsonLd || ""
});

const normalizeTaxonomyIds = (items = []) =>
  items
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") return item;
      return item._id?.toString() || item.id || null;
    })
    .filter(Boolean);

export const buildPostPayload = async (input = {}, existingPost = null) => {
  const title = (input.title || existingPost?.title || "").trim();

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const slug = slugify(input.slug || title);
  if (!slug) {
    throw new ApiError(400, "Slug is invalid");
  }

  const contentSections = Array.isArray(input.contentSections)
    ? input.contentSections.map(normalizeSection)
    : existingPost?.contentSections || [];

  const status = ["draft", "published", "scheduled"].includes(input.status)
    ? input.status
    : existingPost?.status || "draft";

  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : existingPost?.scheduledAt || null;
  const publishedAt =
    status === "published"
      ? existingPost?.publishedAt || new Date()
      : status === "scheduled"
        ? existingPost?.publishedAt || null
        : null;

  const categoryIds = normalizeTaxonomyIds(input.categories ?? existingPost?.categories ?? []);
  const tagIds = normalizeTaxonomyIds(input.tags ?? existingPost?.tags ?? []);

  const [categories, tags] = await Promise.all([
    categoryIds.length ? Category.find({ _id: { $in: categoryIds } }).select("_id") : [],
    tagIds.length ? Tag.find({ _id: { $in: tagIds } }).select("_id") : []
  ]);

  return {
    title,
    slug,
    excerpt: buildExcerpt({
      excerpt: input.excerpt,
      contentSections,
      content: input.content || existingPost?.content || ""
    }),
    contentSections,
    content: buildLegacyHtml(contentSections) || input.content || existingPost?.content || "",
    status,
    published: status === "published",
    featuredImage: normalizeMediaAsset(input.featuredImage || existingPost?.featuredImage),
    categories: categories.map((item) => item._id),
    tags: tags.map((item) => item._id),
    seo: normalizeSeo(input.seo || existingPost?.seo),
    scheduledAt: scheduledAt instanceof Date && !Number.isNaN(scheduledAt.getTime()) ? scheduledAt : null,
    publishedAt
  };
};

const postPopulate = [
  { path: "author", select: "name email avatar" },
  { path: "categories", select: "name slug" },
  { path: "tags", select: "name slug" }
];

export const listAdminPosts = async ({ search = "", status = "" } = {}) => {
  if (isWordPressAdminEnabled()) {
    return listWordPressPosts({ search, status });
  }

  const query = {};

  if (status && ["draft", "published", "scheduled"].includes(status)) {
    query.status = status;
  }

  if (search?.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { slug: { $regex: search.trim(), $options: "i" } },
      { excerpt: { $regex: search.trim(), $options: "i" } }
    ];
  }

  return Blog.find(query).sort({ updatedAt: -1 }).populate(postPopulate);
};

export const getAdminPostById = async (id) => {
  if (isWordPressAdminEnabled()) {
    return getWordPressPostById(id);
  }

  const post = await Blog.findById(id).populate(postPopulate);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

export const createPost = async (input, userId) => {
  if (isWordPressAdminEnabled()) {
    return createWordPressPost(input, userId);
  }

  const payload = await buildPostPayload(input);
  const post = await Blog.create({
    ...payload,
    author: userId || null,
    previewToken: createPreviewToken()
  });

  return getAdminPostById(post._id);
};

export const updatePost = async (id, input) => {
  if (isWordPressAdminEnabled()) {
    return updateWordPressPost(id, input);
  }

  const existingPost = await Blog.findById(id);

  if (!existingPost) {
    throw new ApiError(404, "Post not found");
  }

  const payload = await buildPostPayload(input, existingPost);
  Object.assign(existingPost, payload);
  existingPost.previewToken = existingPost.previewToken || createPreviewToken();
  await existingPost.save();

  return getAdminPostById(existingPost._id);
};

export const deletePost = async (id) => {
  if (isWordPressAdminEnabled()) {
    return deleteWordPressPost(id);
  }

  const post = await Blog.findByIdAndDelete(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return { message: "Post deleted successfully" };
};

export const getPublicPosts = async () =>
  Blog.find({
    $or: [
      { status: "published" },
      { status: "scheduled", scheduledAt: { $lte: new Date() } },
      { published: true, status: { $exists: false } }
    ]
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .populate([
      { path: "categories", select: "name slug" },
      { path: "tags", select: "name slug" }
    ]);

export const getPublicPostBySlug = async (slug) =>
  Blog.findOne({
    slug,
    $or: [
      { status: "published" },
      { status: "scheduled", scheduledAt: { $lte: new Date() } },
      { published: true, status: { $exists: false } }
    ]
  }).populate(postPopulate);

export const getPreviewPostByToken = async (previewToken) =>
  Blog.findOne({ previewToken }).populate(postPopulate);
