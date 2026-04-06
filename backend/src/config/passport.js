import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/User.js";

export const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    console.warn("Google OAuth env vars are missing. /auth/google will not work until configured.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const primaryEmail = profile.emails?.[0]?.value;

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: primaryEmail }]
          });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: primaryEmail,
              avatar: profile.photos?.[0]?.value,
              provider: "google",
              emailVerified: true
            });
          } else {
            user.googleId = profile.id;
            user.name = profile.displayName || user.name;
            user.email = primaryEmail || user.email;
            user.avatar = profile.photos?.[0]?.value || user.avatar;
            user.provider = "google";
            user.emailVerified = true;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
