import express from "express";

import { getBookingHistory, getCurrentUser, updateCurrentUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateCurrentUser);
router.get("/bookings", requireAuth, getBookingHistory);

export default router;
