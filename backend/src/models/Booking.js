import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: "" }
    },
    travelDate: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    counts: {
      adult: { type: Number, default: 1 },
      child: { type: Number, default: 0 },
      infant: { type: Number, default: 0 },
      senior: { type: Number, default: 0 }
    },
    packageSelection: {
      optionId: { type: String, default: "" },
      label: { type: String, default: "" },
      guestLabel: { type: String, default: "" }
    },
    pricing: {
      adultPrice: { type: Number, required: true },
      childPrice: { type: Number, required: true },
      infantPrice: { type: Number, default: 0 },
      seniorPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      deposit: { type: Number, default: 0 }
    },
    source: {
      type: String,
      default: "website"
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },
    notifications: {
      emailSent: { type: Boolean, default: false },
      emailError: { type: String, default: "" }
    },
    crmSync: {
      status: { type: String, enum: ["pending", "success", "failed", "skipped"], default: "pending" },
      response: { type: String, default: "" },
      error: { type: String, default: "" }
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
