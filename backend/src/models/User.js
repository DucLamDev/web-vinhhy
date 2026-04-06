import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: "",
      select: false
    },
    avatar: {
      type: String,
      default: ""
    },
    provider: {
      type: String,
      default: "google"
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      default: "",
      select: false
    },
    emailVerificationExpiresAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
