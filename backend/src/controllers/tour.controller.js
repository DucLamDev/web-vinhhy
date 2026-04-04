import Tour from "../models/Tour.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const getTours = asyncHandler(async (_req, res) => {
  const tours = await Tour.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean();
  res.json(tours);
});

export const getTourBySlug = asyncHandler(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug, published: true }).lean();

  if (!tour) {
    throw new ApiError(404, "Tour not found");
  }

  res.json(tour);
});
