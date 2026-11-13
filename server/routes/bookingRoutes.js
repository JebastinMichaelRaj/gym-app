const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/", createBooking);
router.get("/", requireAuth, requireAdmin, getBookings);

module.exports = router;
