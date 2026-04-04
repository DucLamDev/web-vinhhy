import express from "express";

import { createBooking } from "../controllers/booking.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, createBooking);

export default router;
