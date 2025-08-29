// Server/controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/**
 * GET /api/products
 * Query: page, limit, keyword, category, brand, min, max, sort
 * sort: latest | priceAsc | priceDesc | ratingDesc
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      keyword = "",
      category,
      brand,
      min,
      max,
      sort = "latest",
    } = req.query;

    // ---- Build query ----
    const q = {};

    if (keyword) {
      const rx = new RegExp(keyword, "i");
      q.$or = [{ name: rx }, { description: rx }, { category: rx }, { brand: rx }];
    }

    if (category && category !== "All") q.category = category;
    if (brand && brand !== "All") q.brand = brand;

    if (min || max) {
      q.price = {};
      if (min) q.price.$gte = Number(min);
      if (max) q.price.$lte = Number(max);
    }

    // ---- Sorting ----
    const sortMap = {
      latest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      ratingDesc: { rating: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.latest;

    // ---- Paging ----
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(q).sort(sortBy).skip(skip).limit(Number(limit)),
      Product.countDocuments(q),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/**
 * GET /api/products/categories
 * Unique category list
 */
const getCategories = async (_req, res) => {
  try {
    const cats = await Product.distinct("category", { category: { $ne: null } });
    res.json(cats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/**
 * GET /api/products/brands
 * Unique brand list
 */
const getBrands = async (_req, res) => {
  try {
    const brands = await Product.distinct("brand", { brand: { $ne: null } });
    brands.sort((a, b) => String(a).localeCompare(String(b))); // neat sort
    res.json(brands);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (e) {
    res.status(400).json({ message: "Invalid product id" });
  }
};

/**
 * POST /api/products
 * Body (multipart): fields + images[] (multer-storage-cloudinary)
 * Requires: protect + adminOnly
 */
const addProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description, brand } = req.body;

    const files = Array.isArray(req.files) ? req.files : [];
    const images = files.map((f) => ({ url: f.path, publicId: f.filename }));

    const doc = await Product.create({
      name,
      price: Number(price),
      category,
      stock: Number(stock),
      description,
      brand,
      // legacy single image (compat)
      imageUrl: images[0]?.url || "",
      imagePublicId: images[0]?.publicId || "",
      // multi-images
      images,
    });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

/**
 * PUT /api/products/:id
 * Body (multipart): fields + images[]  (replaces entire image set if provided)
 * Requires: protect + adminOnly
 */
const updateProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });

    const { name, price, category, stock, description, brand } = req.body;
    if (name != null) p.name = name;
    if (price != null) p.price = Number(price);
    if (category != null) p.category = category;
    if (stock != null) p.stock = Number(stock);
    if (description != null) p.description = description;
    if (brand != null) p.brand = brand;

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length) {
      const toDelete = [
        ...(p.images || []).map((im) => im.publicId),
        p.imagePublicId || "",
      ].filter(Boolean);

      await Promise.all(
        toDelete.map((pid) => cloudinary.uploader.destroy(pid).catch(() => null))
      );

      const images = files.map((f) => ({ url: f.path, publicId: f.filename }));
      p.images = images;
      // keep legacy fields in sync
      p.imageUrl = images[0]?.url || "";
      p.imagePublicId = images[0]?.publicId || "";
    }

    const saved = await p.save();
    res.json(saved);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

/**
 * DELETE /api/products/:id
 * Requires: protect + adminOnly
 */
const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });

    const toDelete = [
      ...(p.images || []).map((im) => im.publicId),
      p.imagePublicId || "",
    ].filter(Boolean);

    await Promise.all(
      toDelete.map((pid) => cloudinary.uploader.destroy(pid).catch(() => null))
    );

    await p.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

/**
 * POST /api/products/:id/reviews
 * Body: { rating, comment }
 * Requires: protect
 */
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userName = req.user?.name || "Anonymous";

    if (!rating || !comment) {
      return res.status(400).json({ message: "rating and comment are required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews = product.reviews || [];
    product.reviews.push({
      name: userName,
      rating: Number(rating),
      comment,
    });

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
      (product.reviews.length || 1);

    await product.save();
    res.status(201).json({ message: "Review added", product });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  getProducts,
  getCategories,
  getBrands,          // ✅ new
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview,
};

