import { asyncHandler } from "../utils/async-handler.js";
import {
  getPreviewPostByToken,
  getPublicPostBySlug,
  getPublicPosts
} from "../services/blog.service.js";
import { getSeoSettings } from "../services/seo-settings.service.js";

export const getBlogs = asyncHandler(async (_req, res) => {
  const blogs = await getPublicPosts();
  res.json(blogs);
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await getPublicPostBySlug(req.params.slug);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(blog);
});

export const getBlogPreviewByToken = asyncHandler(async (req, res) => {
  const blog = await getPreviewPostByToken(req.params.token);

  if (!blog) {
    return res.status(404).json({ message: "Preview not found" });
  }

  res.json(blog);
});

export const getBlogConfig = asyncHandler(async (_req, res) => {
  const settings = await getSeoSettings();
  res.json(settings);
});
