// Server/routes/orderRoutes.js
const express = require("express");
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  markPaid,
  cancelOrder,
  updateStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// user routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/mine", protect, getMyOrders); // alias

// admin-only routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/pay", protect, adminOnly, markPaid);
router.put("/:id/cancel", protect, adminOnly, cancelOrder);
router.put("/:id/status", protect, adminOnly, updateStatus);

// shared
router.get("/:id", protect, getOrderById);

module.exports = router;
