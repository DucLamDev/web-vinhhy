import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    format: { type: String, default: "" }
  },
  { _id: false }
);

const seoSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    blogIndexTitle: { type: String, default: "" },
    blogIndexDescription: { type: String, default: "" },
    defaultOgImage: { type: mediaAssetSchema, default: () => ({}) },
    blogSchemaType: { type: String, default: "Blog" }
  },
  { timestamps: true }
);

const SeoSetting = mongoose.model("SeoSetting", seoSettingSchema);

export default SeoSetting;
