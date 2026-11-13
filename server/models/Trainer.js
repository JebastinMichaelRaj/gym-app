const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "8 Years"
    certification: { type: String, required: true },
    photoSeed: { type: String, required: true }, // used to build a placeholder photo URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainer", trainerSchema);
