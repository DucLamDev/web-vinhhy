import { Router } from "express";

import * as adminController from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// We require admin for all routes here
router.use(requireAdmin);

// Stats
router.get("/stats", adminController.getDashboardStats);

// Tours
router.get("/tours", adminController.getTours);
router.post("/tours", adminController.createTour);
router.put("/tours/:id", adminController.updateTour);
router.delete("/tours/:id", adminController.deleteTour);

// Blogs
router.get("/blogs", adminController.getBlogs);
router.post("/blogs", adminController.createBlog);
router.put("/blogs/:id", adminController.updateBlog);
router.delete("/blogs/:id", adminController.deleteBlog);

// Bookings
router.get("/bookings", adminController.getBookings);
router.put("/bookings/:id/status", adminController.updateBookingStatus);

// Users
router.get("/users", adminController.getUsers);
router.put("/users/:id/role", adminController.updateUserRole);

export default router;
