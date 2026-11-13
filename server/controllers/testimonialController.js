const Testimonial = require("../models/Testimonial");

exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
};
