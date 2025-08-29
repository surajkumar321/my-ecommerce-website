const express = require("express");
const {
  getProducts,
  getCategories,
  getBrands,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview,         
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadCloud");

const router = express.Router();

// Filters & list
router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/brands", getBrands);
router.get("/:id", getProductById);

// Reviews
router.post("/:id/reviews", protect, addReview);   // 👈 user must be logged in

// Admin CRUD (multi-image)
router.post("/", protect, adminOnly, upload.array("images", 6), addProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 6), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;

