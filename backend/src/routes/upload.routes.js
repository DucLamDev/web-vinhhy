import { Router } from "express";

import * as mediaController from "../controllers/media.controller.js";
import * as uploadSignatureController from "../controllers/upload-signature.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/signature", uploadSignatureController.getUploadSignature);
router.post("/", mediaController.uploadMedia);

export default router;
