// Server/controllers/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });
  res.json({
    user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    token: sign(user._id),
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const ok = user && (await user.matchPassword(password));
  if (!ok) return res.status(400).json({ message: "Invalid email or password" });

  res.json({
    user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    token: sign(user._id),
  });
}

async function profile(req, res) {
  const u = req.user;
  res.json({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, address: u.address });
}

async function updateProfile(req, res) {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;

  // update address
  user.address = {
    fullName: req.body.fullName || user.address?.fullName,
    phone: req.body.phone || user.address?.phone,
    pincode: req.body.pincode || user.address?.pincode,
    line1: req.body.line1 || user.address?.line1,
    line2: req.body.line2 || user.address?.line2,
    city: req.body.city || user.address?.city,
    state: req.body.state || user.address?.state,
  };

  const updated = await user.save();

  res.json({
    user: { _id: updated._id, name: updated.name, email: updated.email, isAdmin: updated.isAdmin, address: updated.address },
    token: sign(updated._id),
  });
}

module.exports = {
  register,
  login,
  profile,
  updateProfile,
};
