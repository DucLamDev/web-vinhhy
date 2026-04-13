import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, unique: true, trim: true },
    alt: { type: String, default: "" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    format: { type: String, default: "" },
    folder: { type: String, default: "" }
  },
  { timestamps: true }
);

mediaSchema.index({ publicId: 1 }, { unique: true });
mediaSchema.index({ alt: "text", publicId: "text", folder: "text" });

const Media = mongoose.model("Media", mediaSchema);

export default Media;
