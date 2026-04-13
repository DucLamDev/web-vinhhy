import { v2 as cloudinary } from "cloudinary";

import { ApiError } from "../utils/api-error.js";

let configured = false;

const getCloudinaryConfig = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ensureConfigured = () => {
  if (configured) {
    return cloudinary;
  }

  const config = getCloudinaryConfig();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new ApiError(500, "Cloudinary env variables are missing");
  }

  cloudinary.config(config);
  configured = true;
  return cloudinary;
};

const mapCloudinaryAsset = (asset = {}) => ({
  url: asset.secure_url || "",
  publicId: asset.public_id || "",
  alt: asset.context?.custom?.alt || "",
  width: asset.width || null,
  height: asset.height || null,
  format: asset.format || "",
  folder: asset.folder || ""
});

const normalizeCloudinaryError = (error) => {
  if (error?.http_code === 403) {
    return new ApiError(
      403,
      "Cloudinary tu choi upload (403). API key hien tai dang khong co quyen upload. Hay thay upload-capable API key/secret hoac tao unsigned upload preset va cau hinh o frontend."
    );
  }

  return new ApiError(error?.http_code || 500, error?.message || "Cloudinary request failed");
};

export const uploadBase64Image = async ({ data, fileName = "", folder = "" }) => {
  const client = ensureConfigured();
  const uploadFolder = folder || process.env.CLOUDINARY_BLOG_FOLDER || "vinhhy-blog";
  let result;

  try {
    result = await client.uploader.upload(data, {
      folder: uploadFolder,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      filename_override: fileName || undefined
    });
  } catch (error) {
    throw normalizeCloudinaryError(error);
  }

  return mapCloudinaryAsset(result);
};

export const listCloudinaryImages = async ({ search = "", maxResults = 60 } = {}) => {
  const client = ensureConfigured();
  let query = "resource_type:image";

  if (search) {
    const normalized = search.replace(/["\\]/g, " ").trim();
    query += ` AND filename:*${normalized}*`;
  }

  let result;

  try {
    result = await client.search.expression(query).sort_by("created_at", "desc").max_results(maxResults).execute();
  } catch (error) {
    throw normalizeCloudinaryError(error);
  }

  return {
    resources: (result.resources || []).map(mapCloudinaryAsset),
    totalCount: result.total_count || 0
  };
};

export const deleteCloudinaryImage = async (publicId) => {
  const client = ensureConfigured();
  let result;

  try {
    result = await client.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image"
    });
  } catch (error) {
    throw normalizeCloudinaryError(error);
  }

  if (result.result !== "ok" && result.result !== "not found") {
    throw new ApiError(400, "Unable to delete image from Cloudinary");
  }

  return result;
};
