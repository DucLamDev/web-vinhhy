import { asyncHandler } from "../utils/async-handler.js";
import * as taxonomyService from "../services/taxonomy.service.js";

export const getItems = asyncHandler(async (req, res) => {
  const items = await taxonomyService.listTaxonomy(req.params.type);
  res.json(items);
});

export const createItem = asyncHandler(async (req, res) => {
  const item = await taxonomyService.createTaxonomy(req.params.type, req.body);
  res.status(201).json(item);
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await taxonomyService.updateTaxonomy(req.params.type, req.params.id, req.body);
  res.json(item);
});

export const deleteItem = asyncHandler(async (req, res) => {
  const result = await taxonomyService.deleteTaxonomy(req.params.type, req.params.id);
  res.json(result);
});
