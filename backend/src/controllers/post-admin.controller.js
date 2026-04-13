import { asyncHandler } from "../utils/async-handler.js";
import * as blogService from "../services/blog.service.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await blogService.listAdminPosts({
    search: req.query.search,
    status: req.query.status
  });

  res.json(posts);
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await blogService.getAdminPostById(req.params.id);
  res.json(post);
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await blogService.createPost(req.body, req.user?._id);
  res.status(201).json(post);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await blogService.updatePost(req.params.id, req.body);
  res.json(post);
});

export const deletePost = asyncHandler(async (req, res) => {
  const result = await blogService.deletePost(req.params.id);
  res.json(result);
});
