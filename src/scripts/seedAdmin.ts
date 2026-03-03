/**
 * Run: npm run seed
 * Creates one Admin user in the database. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/invoice-diary";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Admin user already exists:", ADMIN_EMAIL);
    await mongoose.disconnect();
    process.exit(0);
    return;
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
  });
  console.log("Admin user created:", ADMIN_EMAIL);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
