// Server/routes/userRoutes.js
const router = require("express").Router();
const { register, login, profile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// profile routes
router.get("/profile", protect, profile);
router.put("/profile", protect, updateProfile);

module.exports = router;
