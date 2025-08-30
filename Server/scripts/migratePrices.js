// Server/scripts/migratePrices.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    for (let p of products) {
      // agar already set hai to skip karo
      if (!p.actualPrice) p.actualPrice = p.price || 0;

      if (!p.discountPrice) {
        // yahan tum apna discount logic de sakte ho
        // e.g. 10% discount
        const discount = Math.round(p.actualPrice * 0.9);
        p.discountPrice = discount;
      }

      await p.save();
      console.log(`✔ Updated product: ${p.name}`);
    }

    console.log("🎉 Migration complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
