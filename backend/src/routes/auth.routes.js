import express from "express";
import passport from "passport";

import { googleAuthSuccess, login, register } from "../controllers/auth.controller.js";

const router = express.Router();
const isGoogleEnabled = () =>
  Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL
  );

router.post("/register", register);
router.post("/login", login);

router.get("/google", (req, res, next) => {
  if (!isGoogleEnabled()) {
    return res.status(503).json({ message: "Google OAuth is not configured on the server" });
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account"
  })(req, res, next);
});

router.get("/callback", (req, res, next) => {
  if (!isGoogleEnabled()) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?error=google_not_configured`);
  }

  return passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?error=google_auth_failed`
  })(req, res, next);
}, googleAuthSuccess);

export default router;
