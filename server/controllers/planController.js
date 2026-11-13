const Plan = require("../models/Plan");

const TIER_ORDER = { basic: 1, standard: 2, premium: 3 };

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find();
    plans.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
    res.json(plans);
  } catch (err) {
    next(err);
  }
};
