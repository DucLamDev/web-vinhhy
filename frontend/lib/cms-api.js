"use client";

import { adminRequest } from "./admin-api";

const toQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const resolved = query.toString();
  return resolved ? `?${resolved}` : "";
};

export const cmsApi = {
  getPosts: (params = {}) => adminRequest(`/admin/posts${toQueryString(params)}`, { cache: "no-store" }),
  getPostById: (id) => adminRequest(`/admin/posts/${id}`, { cache: "no-store" }),
  createPost: (payload) =>
    adminRequest("/admin/posts", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updatePost: (id, payload) =>
    adminRequest(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deletePost: (id) => adminRequest(`/admin/posts/${id}`, { method: "DELETE" }),
  getTaxonomy: (type) => adminRequest(`/admin/${type}`, { cache: "no-store" }),
  createTaxonomy: (type, payload) =>
    adminRequest(`/admin/${type}`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateTaxonomy: (type, id, payload) =>
    adminRequest(`/admin/${type}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteTaxonomy: (type, id) => adminRequest(`/admin/${type}/${id}`, { method: "DELETE" }),
  getSeoSettings: () => adminRequest("/admin/seo-settings", { cache: "no-store" }),
  updateSeoSettings: (payload) =>
    adminRequest("/admin/seo-settings", {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  getMedia: (params = {}) => adminRequest(`/media${toQueryString(params)}`, { cache: "no-store" }),
  createMedia: (payload) =>
    adminRequest("/media", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getUploadSignature: () => adminRequest("/upload/signature", { cache: "no-store" }),
  uploadMedia: (payload) =>
    adminRequest("/upload", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteMedia: (publicId) => adminRequest(`/media/${encodeURIComponent(publicId)}`, { method: "DELETE" })
};
