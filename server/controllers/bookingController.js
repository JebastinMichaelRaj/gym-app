const Booking = require("../models/Booking");

// POST /api/bookings — public, anyone can book a free trial
exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, date, time, goal } = req.body;

    if (!name || !email || !date || !time || !goal) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const booking = await Booking.create({ name, email, date, time, goal });
    res.status(201).json({ message: "Trial session booked.", booking });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings — admin only, view submitted bookings
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
