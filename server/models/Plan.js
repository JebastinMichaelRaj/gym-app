const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    tier: { type: String, required: true, enum: ["basic", "standard", "premium"], unique: true },
    tag: { type: String, required: true },
    name: { type: String, required: true },
    plateWeight: { type: String, required: true }, // e.g. "20 KG" — visual only
    price: { type: Number, required: true },
    benefits: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
