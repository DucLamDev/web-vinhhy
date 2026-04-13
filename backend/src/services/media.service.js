import Media from "../models/Media.js";
import { listCloudinaryImages } from "./cloudinary.service.js";

export const listMediaItems = async ({ search = "" } = {}) => {
  const query = {};

  if (search?.trim()) {
    query.$or = [
      { publicId: { $regex: search.trim(), $options: "i" } },
      { alt: { $regex: search.trim(), $options: "i" } },
      { folder: { $regex: search.trim(), $options: "i" } }
    ];
  }

  const [storedResources, cloudinaryResources] = await Promise.all([
    Media.find(query).sort({ createdAt: -1 }).limit(120),
    listCloudinaryImages({ search, maxResults: 120 }).catch(() => ({ resources: [] }))
  ]);

  const resourcesMap = new Map();

  cloudinaryResources.resources.forEach((resource) => {
    if (!resource?.publicId) return;
    resourcesMap.set(resource.publicId, resource);
  });

  storedResources.forEach((resource) => {
    if (!resource?.publicId) return;
    resourcesMap.set(resource.publicId, {
      url: resource.url,
      publicId: resource.publicId,
      alt: resource.alt || resourcesMap.get(resource.publicId)?.alt || "",
      width: resource.width || resourcesMap.get(resource.publicId)?.width || null,
      height: resource.height || resourcesMap.get(resource.publicId)?.height || null,
      format: resource.format || resourcesMap.get(resource.publicId)?.format || "",
      folder: resource.folder || resourcesMap.get(resource.publicId)?.folder || ""
    });
  });

  const resources = Array.from(resourcesMap.values());

  if (cloudinaryResources.resources?.length) {
    const bulkOps = cloudinaryResources.resources
      .filter((resource) => resource?.publicId && resource?.url)
      .map((resource) => ({
        updateOne: {
          filter: { publicId: resource.publicId },
          update: {
            $set: {
              url: resource.url,
              alt: resource.alt || "",
              width: resource.width || null,
              height: resource.height || null,
              format: resource.format || "",
              folder: resource.folder || ""
            }
          },
          upsert: true
        }
      }));

    if (bulkOps.length) {
      await Media.bulkWrite(bulkOps, { ordered: false }).catch(() => {});
    }
  }

  return {
    resources,
    totalCount: resources.length,
    cloudinaryTotalCount: cloudinaryResources.totalCount || 0,
    cloudinaryResourceCount: Array.isArray(cloudinaryResources.resources) ? cloudinaryResources.resources.length : 0
  };
};

export const upsertMediaItem = async (payload = {}) =>
  Media.findOneAndUpdate(
    { publicId: payload.publicId },
    {
      url: payload.url,
      publicId: payload.publicId,
      alt: payload.alt || "",
      width: payload.width || null,
      height: payload.height || null,
      format: payload.format || "",
      folder: payload.folder || ""
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

export const deleteMediaItem = async (publicId) => {
  await Media.findOneAndDelete({ publicId });
};
