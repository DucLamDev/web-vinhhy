import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";

import { configurePassport } from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import tourRoutes from "./routes/tour.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";

dotenv.config();

const app = express();

const corsOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(compression());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(apiLimiter);

configurePassport();
app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.json({
    service: "Tour Vinh Hy API",
    version: "1.0.0",
    docs: "/docs/api",
    health: "ok"
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/docs/api", (_req, res) => {
  res.json({
    auth: ["/auth/google", "/auth/callback"],
    tours: ["/tours", "/tours/:slug"],
    booking: ["/booking"],
    user: ["/user/me", "/user/me (PUT)", "/user/bookings"]
  });
});

app.use("/auth", authRoutes);
app.use("/tours", tourRoutes);
app.use("/booking", bookingRoutes);
app.use("/user", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
