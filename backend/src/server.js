import dotenv from "dotenv";

import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Tour Vinh Hy API listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
