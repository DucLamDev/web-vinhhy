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

const blogSectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["heading", "text", "image", "html"],
      required: true
    },
    headingLevel: {
      type: String,
      enum: ["h1", "h2", "h3", "h4"],
      default: "h2"
    },
    body: { type: String, default: "" },
    image: { type: mediaAssetSchema, default: () => ({}) },
    caption: { type: String, default: "" },
    imageDisplay: {
      width: {
        type: String,
        enum: ["full", "wide", "narrow"],
        default: "wide"
      },
      ratio: {
        type: String,
        enum: ["original", "landscape", "square", "portrait"],
        default: "landscape"
      }
    }
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: mediaAssetSchema, default: () => ({}) },
    canonicalUrl: { type: String, default: "" },
    jsonLd: { type: String, default: "" }
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    contentSections: { type: [blogSectionSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft"
    },
    published: { type: Boolean, default: false },
    featuredImage: { type: mediaAssetSchema, default: () => ({}) },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    seo: { type: seoSchema, default: () => ({}) },
    previewToken: { type: String, required: true, unique: true, trim: true },
    scheduledAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text" });
blogSchema.index({ status: 1, createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
