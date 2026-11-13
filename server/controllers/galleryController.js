const GalleryImage = require("../models/GalleryImage");

exports.getGallery = async (req, res, next) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: 1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
};
