import Media from "../models/Media.js";

export const listMediaItems = async ({ search = "" } = {}) => {
  const query = {};

  if (search?.trim()) {
    query.$or = [
      { publicId: { $regex: search.trim(), $options: "i" } },
      { alt: { $regex: search.trim(), $options: "i" } },
      { folder: { $regex: search.trim(), $options: "i" } }
    ];
  }

  const resources = await Media.find(query).sort({ createdAt: -1 }).limit(120);
  return {
    resources,
    totalCount: resources.length
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
