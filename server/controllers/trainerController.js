const Trainer = require("../models/Trainer");

exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: 1 });
    res.json(trainers);
  } catch (err) {
    next(err);
  }
};
