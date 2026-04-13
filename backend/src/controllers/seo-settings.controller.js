import { asyncHandler } from "../utils/async-handler.js";
import { getSeoSettings, updateSeoSettings } from "../services/seo-settings.service.js";

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getSeoSettings();
  res.json(settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await updateSeoSettings(req.body);
  res.json(settings);
});
