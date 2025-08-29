// Server/models/Order.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  pincode: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
});

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  imageUrl: String,
  price: Number,
  qty: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional guest ok
    // 🔑 We store items here (not "orderItems")
    items: [orderItemSchema],
    shippingAddress: addressSchema,

    paymentMethod: { type: String, default: "COD" },
    itemsPrice: Number,
    shippingPrice: Number,
    taxPrice: Number,
    totalPrice: Number,

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,

    // Allowed: PROCESSING, SHIPPED, DELIVERED, CANCELLED
    status: {
      type: String,
      enum: ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PROCESSING",
    },
  },
  { timestamps: true }
);

// 👉 Virtual to expose "orderItems" for frontend compatibility
orderSchema.virtual("orderItems").get(function () {
  return this.items;
});
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
