const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    memberName: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    quote: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
