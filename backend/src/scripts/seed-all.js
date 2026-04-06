import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import Tour from "../models/Tour.js";
import Blog from "../models/Blog.js";
import { blogSeedData } from "./blog-seed-data.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import paths to frontend
const frontendLibPath = path.resolve(__dirname, "../../../frontend/lib");

const seedAll = async () => {
  try {
    await connectDB();

    console.log("Loading modules...");
    // Using absolute paths on Windows for dynamic import
    const mockDataFile = "file://" + path.join(frontendLibPath, "mock-data.js").replace(/\\/g, "/");
    const tourOverridesFile = "file://" + path.join(frontendLibPath, "tour-overrides.js").replace(/\\/g, "/");

    const { fallbackTours } = await import(mockDataFile);
    const { tourOverrides, applyTourOverrides } = await import(tourOverridesFile);

    // Prepare Tours
    // The previous static array just applies overrides
    const allTours = applyTourOverrides(fallbackTours);

    console.log(`Found ${allTours.length} tours and ${blogSeedData.length} blogs to import.`);

    await Tour.deleteMany({});
    console.log("Deleted existing tours");
    
    await Tour.insertMany(allTours);
    console.log(`Imported ${allTours.length} tours successfully.`);

    await Blog.deleteMany({});
    console.log("Deleted existing blogs");

    const blogsToInsert = blogSeedData.map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      published: true,
      createdAt: post.date,
      updatedAt: post.date
    }));

    await Blog.insertMany(blogsToInsert);
    console.log(`Imported ${blogsToInsert.length} blogs successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

seedAll();
