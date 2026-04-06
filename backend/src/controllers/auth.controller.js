import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import { signJwt } from "../services/jwt.service.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

const VERIFICATION_WINDOW_MS = 24 * 60 * 60 * 1000;

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
      role: user.role,
      emailVerified: user.emailVerified
    }
  };
};

const buildVerificationUrl = (token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = new URL("/xac-thuc-email", frontendUrl);
  verificationUrl.searchParams.set("token", token);
  return verificationUrl.toString();
};

const assignVerificationToken = (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpiresAt = new Date(Date.now() + VERIFICATION_WINDOW_MS);
  return token;
};

const sendAccountVerification = async (user) => {
  const token = assignVerificationToken(user);
  await user.save();
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl: buildVerificationUrl(token)
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone = "", password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Vui lòng nhập đầy đủ họ tên, email và mật khẩu");
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).select(
    "+emailVerificationToken +emailVerificationExpiresAt"
  );

  if (existingUser) {
    if (existingUser.provider === "local" && !existingUser.emailVerified) {
      existingUser.name = name;
      existingUser.phone = phone || existingUser.phone;
      existingUser.password = await bcrypt.hash(password, 10);
      await sendAccountVerification(existingUser);

      return res.status(200).json({
        message: "Tài khoản đã tồn tại nhưng chưa xác thực. Chúng tôi đã gửi lại email xác thực.",
        requiresVerification: true,
        email: existingUser.email
      });
    }

    throw new ApiError(409, "Email này đã được sử dụng");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    provider: "local",
    emailVerified: false
  });

  await sendAccountVerification(user);

  res.status(201).json({
    message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
    requiresVerification: true,
    email: user.email
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

  if (user.provider === "local" && !user.emailVerified) {
    throw new ApiError(403, "Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư và xác thực trước khi đăng nhập.");
  }

  res.json({
    message: "Đăng nhập thành công",
    ...buildAuthResponse(user)
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token || req.body.token;

  if (!token) {
    throw new ApiError(400, "Thiếu mã xác thực email");
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiresAt: { $gt: new Date() }
  }).select("+emailVerificationToken +emailVerificationExpiresAt");

  if (!user) {
    throw new ApiError(400, "Liên kết xác thực không hợp lệ hoặc đã hết hạn");
  }

  user.emailVerified = true;
  user.emailVerificationToken = "";
  user.emailVerificationExpiresAt = null;
  await user.save();

  res.json({
    message: "Email đã được xác thực thành công. Bạn có thể đăng nhập ngay bây giờ."
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Vui lòng nhập email để nhận lại liên kết xác thực");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+emailVerificationToken +emailVerificationExpiresAt"
  );

  if (!user) {
    throw new ApiError(404, "Không tìm thấy tài khoản với email này");
  }

  if (user.provider !== "local") {
    throw new ApiError(400, "Tài khoản này đăng nhập bằng Google nên không cần xác thực email thủ công");
  }

  if (user.emailVerified) {
    throw new ApiError(400, "Email này đã được xác thực");
  }

  await sendAccountVerification(user);

  res.json({
    message: "Chúng tôi đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn.",
    requiresVerification: true,
    email: user.email
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
