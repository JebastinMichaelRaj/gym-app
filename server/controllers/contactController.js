const Contact = require("../models/Contact");

// POST /api/contact — public
exports.createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json({ message: "Message sent.", contact });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact — admin only
exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
