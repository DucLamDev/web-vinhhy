import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

tagSchema.index({ name: 1 }, { unique: true });

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
