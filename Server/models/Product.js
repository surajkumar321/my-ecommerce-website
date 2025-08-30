// Server/models/Product.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // ✅ new fields
    actualPrice: { type: Number, required: true, default: 0 },   // MRP
    discountPrice: { type: Number, required: true, default: 0 }, // after discount

    category: { type: String },
    brand: { type: String },
    stock: { type: Number, default: 0 },
    description: { type: String },

    // legacy single image
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },

    // multi-images
    images: { type: [imageSchema], default: [] },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
