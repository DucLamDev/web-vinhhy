import Blog from "../models/Blog.js";

export const getBlogs = async (_req, res, next) => {
  try {
    const blogs = await Blog.find({ published: true })
      .select("title slug excerpt featuredImage tags createdAt")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, published: true })
      .populate("author", "name avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
};
