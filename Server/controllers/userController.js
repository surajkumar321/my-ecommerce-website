// Server/controllers/userController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

/**
 * POST /api/users/register
 */
async function register(req, res, next) {
  try {
    const body = req.body || {};
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // NOTE: assuming your User model hashes password via pre('save')
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: !!user.isAdmin },
      token: sign(user._id),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users/login
 */
async function login(req, res, next) {
  try {
    const body = req.body || {};
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    const ok = user && (await user.matchPassword(password));
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: !!user.isAdmin },
      token: sign(user._id),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/profile  (protected)
 */
async function profile(req, res, next) {
  try {
    const u = req.user;
    return res.json({
      _id: u._id,
      name: u.name,
      email: u.email,
      isAdmin: !!u.isAdmin,
      address: u.address,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/profile  (protected)
 */
async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.email) user.email = req.body.email.trim().toLowerCase();
    if (req.body.password) user.password = req.body.password; // will be hashed in model

    // address (keep existing values if not provided)
    user.address = {
      fullName: req.body.fullName ?? user.address?.fullName,
      phone: req.body.phone ?? user.address?.phone,
      pincode: req.body.pincode ?? user.address?.pincode,
      line1: req.body.line1 ?? user.address?.line1,
      line2: req.body.line2 ?? user.address?.line2,
      city: req.body.city ?? user.address?.city,
      state: req.body.state ?? user.address?.state,
    };

    const updated = await user.save();

    return res.json({
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        isAdmin: !!updated.isAdmin,
        address: updated.address,
      },
      token: sign(updated._id),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  profile,
  updateProfile,
};

