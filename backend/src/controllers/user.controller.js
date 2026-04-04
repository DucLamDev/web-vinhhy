import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v").lean();
  res.json(user);
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;

  await user.save();

  res.json({
    message: "Profile updated successfully",
    user
  });
});

export const getBookingHistory = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("tour", "title slug heroImage duration location")
    .sort({ createdAt: -1 })
    .lean();

  res.json(bookings);
});
