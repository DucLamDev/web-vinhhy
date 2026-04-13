"use client";

import { useEffect, useRef, useState } from "react";

import { cmsApi } from "@/lib/cms-api";
import { createEmptyMediaAsset, normalizePost } from "@/lib/blog-content";

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const createEmptyPost = () =>
  normalizePost({
    title: "",
    slug: "",
    excerpt: "",
    status: "draft",
    contentSections: [],
    featuredImage: createEmptyMediaAsset(),
    seo: {
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      jsonLd: "",
      ogImage: createEmptyMediaAsset()
    },
    categories: [],
    tags: []
  });

export function usePostEditor(postId) {
  const [post, setPost] = useState(createEmptyPost);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [taxonomies, setTaxonomies] = useState({ categories: [], tags: [] });
  const slugTouched = useRef(false);

  useEffect(() => {
    const loadTaxonomies = async () => {
      try {
        const [categories, tags] = await Promise.all([cmsApi.getTaxonomy("categories"), cmsApi.getTaxonomy("tags")]);
        setTaxonomies({ categories, tags });
      } catch (_error) {
        setTaxonomies({ categories: [], tags: [] });
      }
    };

    loadTaxonomies();
  }, []);

  useEffect(() => {
    if (!postId) {
      setPost(createEmptyPost());
      slugTouched.current = false;
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await cmsApi.getPostById(postId);
        setPost(normalizePost(result));
        slugTouched.current = true;
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const updatePost = (updater) => {
    setPost((current) => (typeof updater === "function" ? updater(current) : updater));
  };

  const setField = (field, value) => {
    setPost((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugTouched.current) {
        next.slug = slugify(value);
      }
      if (field === "slug") {
        slugTouched.current = true;
      }
      return next;
    });
  };

  const setSeoField = (field, value) => {
    setPost((current) => ({
      ...current,
      seo: {
        ...current.seo,
        [field]: value
      }
    }));
  };

  const setFeaturedImage = (asset) => {
    setField("featuredImage", asset);
  };

  const setSeoImage = (asset) => {
    setSeoField("ogImage", asset);
  };

  const setSections = (contentSections) => {
    setField("contentSections", contentSections);
  };

  const setRelation = (field, value) => {
    setField(field, value);
  };

  const buildPayload = (currentPost) => ({
    title: currentPost.title,
    slug: currentPost.slug,
    excerpt: currentPost.excerpt,
    status: currentPost.status,
    contentSections: currentPost.contentSections,
    featuredImage: currentPost.featuredImage,
    categories: currentPost.categories.map((item) => item._id || item),
    tags: currentPost.tags.map((item) => item._id || item),
    seo: currentPost.seo,
    scheduledAt: currentPost.scheduledAt || null
  });

  const savePost = async (override = {}) => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = buildPayload({
        ...post,
        ...override
      });

      const result = postId
        ? await cmsApi.updatePost(postId, payload)
        : await cmsApi.createPost(payload);

      const normalized = normalizePost(result);
      setPost(normalized);
      setNotice(postId ? "Bài viết đã được cập nhật." : "Bài viết mới đã được tạo.");
      return normalized;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const openPreview = async () => {
    const previewPost = post.previewToken ? post : await savePost({ status: post.status || "draft" });
    if (previewPost.previewToken) {
      window.open(`/blog/preview/${previewPost.previewToken}`, "_blank", "noopener,noreferrer");
    }
  };

  return {
    post,
    loading,
    saving,
    error,
    notice,
    taxonomies,
    updatePost,
    setField,
    setSeoField,
    setFeaturedImage,
    setSeoImage,
    setSections,
    setRelation,
    savePost,
    openPreview
  };
}
