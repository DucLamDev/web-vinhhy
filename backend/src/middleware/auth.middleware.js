import jwt from "jsonwebtoken";

import User from "../models/User.js";

const getTokenFromHeader = (authorization = "") => {
  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.replace("Bearer ", "").trim();
};

const resolveUser = async (req) => {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return null;
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.sub);

  return user || null;
};

export const requireAuth = async (req, _res, next) => {
  try {
    const user = await resolveUser(req);

    if (!user) {
      return next({ statusCode: 401, message: "Unauthorized" });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next({ statusCode: 401, message: "Invalid or expired token" });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    req.user = await resolveUser(req);
    return next();
  } catch (_error) {
    req.user = null;
    return next();
  }
};
