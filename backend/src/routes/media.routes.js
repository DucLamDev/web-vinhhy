import { Router } from "express";

import * as mediaController from "../controllers/media.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", mediaController.getMedia);
router.post("/", mediaController.syncMedia);
router.delete("/:publicId(*)", mediaController.deleteMedia);

export default router;
