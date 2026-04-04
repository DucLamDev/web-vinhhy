import express from "express";

import { getTourBySlug, getTours } from "../controllers/tour.controller.js";

const router = express.Router();

router.get("/", getTours);
router.get("/:slug", getTourBySlug);

export default router;
