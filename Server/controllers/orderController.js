// Server/controllers/orderController.js
const Order = require("../models/Order");

const ALLOWED_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

// Create new order
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = new Order({
    user: req.user?._id,                // may be undefined for guest if you allow
    items: orderItems,                  // 🔑 map to schema field
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    status: "PROCESSING",
    isPaid: false,
  });

  const created = await order.save();
  res.status(201).json(created);        // thanks to virtuals, 'orderItems' will also appear
};

// Get order by id (owner or admin)
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (!req.user.isAdmin && String(order.user?._id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not authorized" });
  }
  res.json(order);
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// ADMIN: Get all orders (?status=ALL/PROCESSING/SHIPPED/DELIVERED/CANCELLED/PAID)
const getAllOrders = async (req, res) => {
  const q = {};
  const { status } = req.query;

  if (status && status !== "ALL") {
    if (status === "PAID") q.isPaid = true;
    else if (ALLOWED_STATUSES.includes(status)) q.status = status;
  }

  const orders = await Order.find(q)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// ADMIN: mark paid
const markPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();
  res.json({ ok: true });
};

// ADMIN: cancel order
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status === "DELIVERED") {
    return res.status(400).json({ message: "Delivered order cannot be cancelled" });
  }
  order.status = "CANCELLED";
  await order.save();
  res.json({ ok: true });
};

// ADMIN: update status (PROCESSING -> SHIPPED -> DELIVERED)
const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status === "CANCELLED") {
    return res.status(400).json({ message: "Cancelled order cannot be updated" });
  }
  if (order.status === "DELIVERED" && status !== "DELIVERED") {
    return res.status(400).json({ message: "Delivered order cannot move backwards" });
  }

  const rank = (s) => ({ PROCESSING: 1, SHIPPED: 2, DELIVERED: 3, CANCELLED: 99 }[s] || 0);
  if (rank(status) < rank(order.status)) {
    return res.status(400).json({ message: `Cannot move ${order.status} -> ${status}` });
  }

  order.status = status;
  if (status === "DELIVERED") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  await order.save();

  res.json({ ok: true, status: order.status });
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  markPaid,
  cancelOrder,
  updateStatus,
};
