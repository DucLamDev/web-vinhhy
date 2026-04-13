import crypto from "crypto";

import { ApiError } from "../utils/api-error.js";

const DEFAULT_FOLDER = process.env.CLOUDINARY_BLOG_FOLDER || "vinhhy-blog";
const DEFAULT_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";

export const createUploadSignature = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(500, "Cloudinary env variables are missing");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = DEFAULT_FOLDER;
  const uploadPreset = DEFAULT_UPLOAD_PRESET;
  const signatureBase = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    uploadPreset
  };
};
