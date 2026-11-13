require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const programRoutes = require("./routes/programRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const planRoutes = require("./routes/planRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- API routes ----
app.use("/api/programs", programRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ---- Serve the frontend (Bootstrap 5 + jQuery, public/index.html) ----
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`IronForm server running on http://localhost:${PORT}`));
}

start();
