import Blog from "../models/Blog.js";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import User from "../models/User.js";

// --- Stats ---
export const getDashboardStats = async (_req, res, next) => {
  try {
    const totalTours = await Tour.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    res.json({
      tours: totalTours,
      blogs: totalBlogs,
      users: totalUsers,
      bookings: {
        total: totalBookings,
        pending: pendingBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Tours ---
export const getTours = async (_req, res, next) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    next(error);
  }
};

export const createTour = async (req, res, next) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    if (error.code === 11000) {
      return next({ statusCode: 400, message: "A tour with this slug already exists" });
    }
    next(error);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!tour) return next({ statusCode: 404, message: "Tour not found" });
    res.json(tour);
  } catch (error) {
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return next({ statusCode: 404, message: "Tour not found" });
    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- Blogs ---
export const getBlogs = async (_req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author", "name email");
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user._id
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return next({ statusCode: 400, message: "A blog with this slug already exists" });
    }
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!blog) return next({ statusCode: 404, message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return next({ statusCode: 404, message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- Bookings ---
export const getBookings = async (_req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("tour", "title slug")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return next({ statusCode: 400, message: "Invalid booking status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return next({ statusCode: 404, message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// --- Users ---
export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return next({ statusCode: 400, message: "Invalid user role" });
    }

    // Don't allow an admin to demote themselves easily without an explicit check
    if (req.user._id.toString() === req.params.id && role !== "admin") {
      return next({ statusCode: 400, message: "Cannot demote yourself" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return next({ statusCode: 404, message: "User not found" });
    res.json({ message: "User role updated", user });
  } catch (error) {
    next(error);
  }
};
