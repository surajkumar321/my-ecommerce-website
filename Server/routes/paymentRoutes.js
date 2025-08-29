const express = require("express");
const router = express.Router();

// simple stub route (no Razorpay)
router.post("/create-order", (req, res) => {
  res.json({ ok: true, orderId: `demo_${Date.now()}` });
});

module.exports = router;
