// Populates MongoDB with the gym's starting content.
// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Program = require("../models/Program");
const Trainer = require("../models/Trainer");
const Plan = require("../models/Plan");
const GalleryImage = require("../models/GalleryImage");
const Testimonial = require("../models/Testimonial");
const User = require("../models/User");

const programs = [
  { icon: "🔥", name: "Weight Loss", description: "Metabolic circuits and conditioning built around a calorie-conscious plan.", duration: "45 min", difficulty: 1 },
  { icon: "💪", name: "Muscle Building", description: "Progressive overload strength blocks with hypertrophy accessory work.", duration: "60 min", difficulty: 2 },
  { icon: "🏃", name: "Cardio", description: "Interval-based sessions to build endurance and cardiovascular capacity.", duration: "40 min", difficulty: 1 },
  { icon: "🧘", name: "Yoga", description: "Mobility, breathwork, and recovery flows to balance heavier lifting days.", duration: "50 min", difficulty: 1 },
  { icon: "⚡", name: "CrossFit", description: "Varied, high-intensity functional movements scored and scaled to you.", duration: "55 min", difficulty: 3 },
  { icon: "🎯", name: "Personal Training", description: "One-on-one programming with a dedicated coach and a written plan.", duration: "60 min", difficulty: 3 },
];

const trainers = [
  { name: "John Carter", specialization: "Strength Training", experience: "8 Years", certification: "NSCA-CSCS", photoSeed: "trainer1" },
  { name: "Maya Fernandez", specialization: "CrossFit & Conditioning", experience: "6 Years", certification: "CF-L2", photoSeed: "trainer2" },
  { name: "Ravi Menon", specialization: "Powerlifting", experience: "10 Years", certification: "USAPL Coach", photoSeed: "trainer3" },
  { name: "Sarah Lin", specialization: "Yoga & Mobility", experience: "5 Years", certification: "RYT-500", photoSeed: "trainer4" },
];

const plans = [
  { tier: "basic", tag: "Getting Started", name: "Basic Plan", plateWeight: "10 KG", price: 19, benefits: ["Gym floor access", "Locker room access", "2 group classes / week"] },
  { tier: "standard", tag: "Most Popular", name: "Standard Plan", plateWeight: "20 KG", price: 34, benefits: ["Full floor + equipment access", "Unlimited group classes", "1 trainer check-in / month", "Nutrition guide"] },
  { tier: "premium", tag: "Full Commitment", name: "Premium Plan", plateWeight: "25 KG", price: 49, benefits: ["Everything in Standard", "Weekly 1:1 personal training", "Custom program design", "Priority class booking"] },
];

const galleryImages = [
  { label: "Free-weight floor", imageSeed: "gym1" },
  { label: "CrossFit rig", imageSeed: "gym2" },
  { label: "Cardio deck", imageSeed: "gym3" },
  { label: "Group class", imageSeed: "gym4" },
  { label: "Recovery zone", imageSeed: "gym5" },
  { label: "Locker rooms", imageSeed: "gym6" },
  { label: "Member event", imageSeed: "gym7" },
  { label: "Turf sled track", imageSeed: "gym8" },
];

const testimonials = [
  { memberName: "Deepak R.", stars: 5, quote: "Best coaching I've had. My squat went up 40kg in six months and the trainers actually track your progress." },
  { memberName: "Priya S.", stars: 5, quote: "The free trial sold me instantly. Clean equipment, no attitude, and classes that actually fit my schedule." },
  { memberName: "Arjun K.", stars: 4, quote: "Great facilities and the nutrition guide included in Standard was more useful than I expected." },
  { memberName: "Meera T.", stars: 5, quote: "Booked a free trial on a whim, joined Premium a week later. The 1:1 check-ins keep me honest." },
];

async function seed() {
  await connectDB();

  await Promise.all([
    Program.deleteMany({}),
    Trainer.deleteMany({}),
    Plan.deleteMany({}),
    GalleryImage.deleteMany({}),
    Testimonial.deleteMany({}),
  ]);

  await Program.insertMany(programs);
  await Trainer.insertMany(trainers);
  await Plan.insertMany(plans);
  await GalleryImage.insertMany(galleryImages);
  await Testimonial.insertMany(testimonials);

  // Create a default admin account if one doesn't already exist
  const adminEmail = "admin@ironform.gym";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Gym Admin",
      email: adminEmail,
      password: "admin123", // change this immediately after first login
      role: "admin",
    });
    console.log(`Admin account created: ${adminEmail} / admin123 (change this password!)`);
  }

  console.log("Database seeded successfully.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
