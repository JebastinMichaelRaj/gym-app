const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "🏋️" },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "45 min"
    difficulty: { type: Number, required: true, min: 1, max: 3 }, // 1-3 plates
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", programSchema);
