import dotenv from "dotenv";

import { connectDB } from "../config/db.js";
import { seedTours } from "../data/seedTours.js";
import Tour from "../models/Tour.js";

dotenv.config();

const seed = async () => {
  await connectDB();
  await Tour.deleteMany({});
  await Tour.insertMany(seedTours);
  console.log(`Seeded ${seedTours.length} tours`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
