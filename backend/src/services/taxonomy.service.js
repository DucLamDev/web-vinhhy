import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import { ApiError } from "../utils/api-error.js";
import { slugify } from "../utils/slugify.js";
import {
  createWordPressTaxonomy,
  deleteWordPressTaxonomy,
  isWordPressAdminEnabled,
  listWordPressTaxonomy,
  updateWordPressTaxonomy
} from "./wordpress-admin.service.js";

const getModel = (type) => {
  if (type === "categories") return Category;
  if (type === "tags") return Tag;
  throw new ApiError(400, "Invalid taxonomy type");
};

export const listTaxonomy = async (type) => {
  if (isWordPressAdminEnabled()) {
    return listWordPressTaxonomy(type);
  }

  const Model = getModel(type);
  return Model.find().sort({ name: 1 });
};

export const createTaxonomy = async (type, payload = {}) => {
  if (isWordPressAdminEnabled()) {
    return createWordPressTaxonomy(type, payload);
  }

  const Model = getModel(type);
  const name = (payload.name || "").trim();

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  return Model.create({
    name,
    slug: slugify(payload.slug || name),
    description: payload.description || ""
  });
};

export const updateTaxonomy = async (type, id, payload = {}) => {
  if (isWordPressAdminEnabled()) {
    return updateWordPressTaxonomy(type, id, payload);
  }

  const Model = getModel(type);
  const entity = await Model.findById(id);

  if (!entity) {
    throw new ApiError(404, "Taxonomy item not found");
  }

  entity.name = (payload.name || entity.name || "").trim();
  entity.slug = slugify(payload.slug || entity.slug || entity.name);
  entity.description = payload.description || "";
  await entity.save();

  return entity;
};

export const deleteTaxonomy = async (type, id) => {
  if (isWordPressAdminEnabled()) {
    return deleteWordPressTaxonomy(type, id);
  }

  const Model = getModel(type);
  const entity = await Model.findByIdAndDelete(id);

  if (!entity) {
    throw new ApiError(404, "Taxonomy item not found");
  }

  return { message: "Deleted successfully" };
};
