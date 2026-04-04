import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { signJwt } from "../services/jwt.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

const buildAuthResponse = (user) => {
  const token = signJwt({
    sub: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role
    }
  };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone = "", password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Vui lòng nhập đầy đủ họ tên, email và mật khẩu");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "Email này đã được sử dụng");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password: hashedPassword,
    provider: "local"
  });

  res.status(201).json({
    message: "Đăng ký thành công",
    ...buildAuthResponse(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Vui lòng nhập email và mật khẩu");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !user.password) {
    throw new ApiError(401, "Tài khoản không tồn tại hoặc chưa thiết lập mật khẩu");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Email hoặc mật khẩu không chính xác");
  }

  res.json({
    message: "Đăng nhập thành công",
    ...buildAuthResponse(user)
  });
});

export const googleAuthSuccess = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const redirectUrl = new URL("/auth/callback", frontendUrl);
  const authPayload = buildAuthResponse(req.user);

  redirectUrl.searchParams.set("token", authPayload.token);
  redirectUrl.searchParams.set("name", req.user.name || "");
  redirectUrl.searchParams.set("email", req.user.email || "");

  res.redirect(redirectUrl.toString());
};
