// Server/tools/updateOrders.js
require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/Order");

// FROM aur TO set karne ke liye env ya args use karenge
const argv = process.argv.slice(2).reduce((acc, arg) => {
  const m = arg.match(/^--([^=]+)=(.*)$/);
  if (m) acc[m[1]] = m[2];
  return acc;
}, {});

const FROM = process.env.FROM || argv.from || "PLACED";       // jisme problem hai
const TO   = process.env.TO   || argv.to   || "PROCESSING";   // jo new value chahiye

const ALLOWED = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing in .env");
    process.exit(1);
  }

  if (!ALLOWED.includes(TO)) {
    console.error(`❌ Invalid target status "${TO}". Allowed: ${ALLOWED.join(", ")}`);
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  const count = await Order.countDocuments({ status: FROM });
  console.log(`🔎 Found ${count} order(s) with status "${FROM}"`);

  if (count === 0) {
    console.log("Nothing to update. Bye!");
    await mongoose.disconnect();
    process.exit(0);
  }

  const res = await Order.updateMany(
    { status: FROM },
    { $set: { status: TO } }
  );

  console.log("✅ Update result:", res);
  console.log(`➡️  Modified ${res.modifiedCount ?? res.nModified} document(s)`);

  await mongoose.disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error("❌ Error:", err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
