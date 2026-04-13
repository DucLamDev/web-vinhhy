import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import {
  deleteCloudinaryImage,
  uploadBase64Image
} from "../services/cloudinary.service.js";
import { deleteMediaItem, listMediaItems, upsertMediaItem } from "../services/media.service.js";

export const getMedia = asyncHandler(async (req, res) => {
  const result = await listMediaItems({
    search: req.query.search
  });

  res.json(result);
});

export const syncMedia = asyncHandler(async (req, res) => {
  const media = await upsertMediaItem(req.body || {});
  res.status(201).json(media);
});

export const uploadMedia = asyncHandler(async (req, res) => {
  const { data, fileName, folder } = req.body || {};

  if (!data) {
    throw new ApiError(400, "Image data is required");
  }

  const asset = await uploadBase64Image({ data, fileName, folder });
  res.status(201).json(asset);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId || "");

  if (!publicId) {
    throw new ApiError(400, "publicId is required");
  }

  await deleteCloudinaryImage(publicId);
  await deleteMediaItem(publicId);
  res.json({ message: "Image deleted successfully" });
});
