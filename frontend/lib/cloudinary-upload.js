import { cmsApi } from "./cms-api";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UNSIGNED_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const DEFAULT_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "vinhhy-blog";

export const canUseUnsignedCloudinaryUpload = () => Boolean(CLOUD_NAME && UNSIGNED_UPLOAD_PRESET);

export const uploadToCloudinaryUnsigned = async (file) => {
  if (!canUseUnsignedCloudinaryUpload()) {
    throw new Error("Unsigned Cloudinary upload is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UNSIGNED_UPLOAD_PRESET);
  formData.append("folder", DEFAULT_FOLDER);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.error?.message || "Cloudinary direct upload failed");
  }

  return {
    url: body.secure_url || "",
    publicId: body.public_id || "",
    alt: "",
    width: body.width || null,
    height: body.height || null,
    format: body.format || ""
  };
};

export const uploadToCloudinarySigned = async (file) => {
  const signature = await cmsApi.getUploadSignature();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("upload_preset", signature.uploadPreset);
  formData.append("folder", signature.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.error?.message || "Cloudinary signed upload failed");
  }

  return {
    url: body.secure_url || "",
    publicId: body.public_id || "",
    alt: "",
    width: body.width || null,
    height: body.height || null,
    format: body.format || ""
  };
};
