const Program = require("../models/Program");

exports.getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find().sort({ createdAt: 1 });
    res.json(programs);
  } catch (err) {
    next(err);
  }
};
