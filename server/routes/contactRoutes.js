const express = require("express");
const router = express.Router();
const { createContactMessage, getContactMessages } = require("../controllers/contactController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/", createContactMessage);
router.get("/", requireAuth, requireAdmin, getContactMessages);

module.exports = router;
