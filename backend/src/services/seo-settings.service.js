import SeoSetting from "../models/SeoSetting.js";

const DEFAULT_KEY = "blog";

const normalizeMediaAsset = (asset = {}) => ({
  url: asset?.url || "",
  publicId: asset?.publicId || "",
  alt: asset?.alt || "",
  width: asset?.width || null,
  height: asset?.height || null,
  format: asset?.format || ""
});

export const getSeoSettings = async () => {
  const existing = await SeoSetting.findOne({ key: DEFAULT_KEY });

  if (existing) {
    return existing;
  }

  return SeoSetting.create({ key: DEFAULT_KEY });
};

export const updateSeoSettings = async (payload = {}) => {
  const existing = await getSeoSettings();
  existing.blogIndexTitle = payload.blogIndexTitle || "";
  existing.blogIndexDescription = payload.blogIndexDescription || "";
  existing.blogSchemaType = payload.blogSchemaType || "Blog";
  existing.defaultOgImage = normalizeMediaAsset(payload.defaultOgImage);
  await existing.save();
  return existing;
};
