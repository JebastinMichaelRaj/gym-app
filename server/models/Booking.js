const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    date: { type: String, required: true }, // ISO date string, e.g. "2026-07-25"
    time: { type: String, required: true }, // e.g. "6:00 AM"
    goal: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
