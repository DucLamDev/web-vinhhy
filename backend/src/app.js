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
import blogRoutes from "./routes/blog.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

const corsOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      message: "Có quá nhiều yêu cầu tới hệ thống. Vui lòng thử lại sau."
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      message: "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút."
    });
  }
});

app.use(helmet());
app.use(compression());
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

app.use("/auth", authLimiter, authRoutes);
app.use(generalLimiter);
app.use("/tours", tourRoutes);
app.use("/booking", bookingRoutes);
app.use("/user", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/admin", adminRoutes);
app.use("/media", mediaRoutes);
app.use("/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
