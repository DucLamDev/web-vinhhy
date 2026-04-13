import { Router } from "express";

import * as adminController from "../controllers/admin.controller.js";
import * as postAdminController from "../controllers/post-admin.controller.js";
import * as seoSettingsController from "../controllers/seo-settings.controller.js";
import * as taxonomyController from "../controllers/taxonomy.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);

router.get("/stats", adminController.getDashboardStats);

router.get("/tours", adminController.getTours);
router.post("/tours", adminController.createTour);
router.put("/tours/:id", adminController.updateTour);
router.delete("/tours/:id", adminController.deleteTour);

router.get("/posts", postAdminController.getPosts);
router.get("/posts/:id", postAdminController.getPostById);
router.post("/posts", postAdminController.createPost);
router.put("/posts/:id", postAdminController.updatePost);
router.delete("/posts/:id", postAdminController.deletePost);

router.get("/blogs", postAdminController.getPosts);
router.post("/blogs", postAdminController.createPost);
router.put("/blogs/:id", postAdminController.updatePost);
router.delete("/blogs/:id", postAdminController.deletePost);

router.get("/:type(categories|tags)", taxonomyController.getItems);
router.post("/:type(categories|tags)", taxonomyController.createItem);
router.put("/:type(categories|tags)/:id", taxonomyController.updateItem);
router.delete("/:type(categories|tags)/:id", taxonomyController.deleteItem);

router.get("/seo-settings", seoSettingsController.getSettings);
router.put("/seo-settings", seoSettingsController.updateSettings);

router.get("/bookings", adminController.getBookings);
router.put("/bookings/:id/status", adminController.updateBookingStatus);

router.get("/users", adminController.getUsers);
router.put("/users/:id/role", adminController.updateUserRole);

export default router;
