import express from "express";

import {
  getBlogBySlug,
  getBlogConfig,
  getBlogPreviewByToken,
  getBlogs
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/settings", getBlogConfig);
router.get("/preview/:token", getBlogPreviewByToken);
router.get("/:slug", getBlogBySlug);

export default router;
