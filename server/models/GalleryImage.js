const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    imageSeed: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
