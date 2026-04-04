import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" }
  },
  { _id: false }
);

const itineraryItemSchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" }
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    summary: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: "Vĩnh Hy, Ninh Thuận"
    },
    duration: {
      type: String,
      required: true
    },
    tourCode: {
      type: String,
      default: ""
    },
    transport: {
      type: String,
      default: "Xe du lịch"
    },
    pickupPlace: {
      type: String,
      default: "Phan Rang"
    },
    standard: {
      type: String,
      default: "Tiêu chuẩn"
    },
    departureDates: {
      type: [String],
      default: []
    },
    heroImage: {
      type: String,
      required: true
    },
    galleryImages: {
      type: [imageSchema],
      default: []
    },
    prices: {
      adult: { type: Number, required: true },
      child: { type: Number, required: true },
      senior: { type: Number, required: true }
    },
    itinerary: {
      type: [itineraryItemSchema],
      default: []
    },
    inclusions: {
      type: [String],
      default: []
    },
    exclusions: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: true
    },
    crmTourId: {
      type: String,
      default: ""
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" }
    }
  },
  {
    timestamps: true
  }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
