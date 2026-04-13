import { asyncHandler } from "../utils/async-handler.js";
import { createUploadSignature } from "../services/upload-signature.service.js";

export const getUploadSignature = asyncHandler(async (_req, res) => {
  res.json(createUploadSignature());
});
