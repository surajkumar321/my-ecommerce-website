const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

/* -------- CORS (allow your client + localhost) -------- */
const allowedOrigins = [
  process.env.CLIENT_URL,       // e.g. https://my-client.onrender.com
  "http://localhost:3000",
  "https://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // server-to-server / curl
    const ok =
      allowedOrigins.includes(origin) ||
      /https:\/\/.*\.onrender\.com$/.test(origin); // optional helper for Render
    return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin} not allowed`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["Content-Length"],
  credentials: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight OK

/* -------- Parsers -------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // keep this

/* -------- Health -------- */
app.get("/", (_req, res) => res.json({ message: "API running" }));
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

/* -------- Mongo -------- */
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Mongo connected"))
    .catch((e) => console.error("❌ Mongo error:", e.message));
} else {
  console.warn("⚠️  MONGO_URI not set — skipping Mongo connection.");
}

/* -------- Routes -------- */
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

/* -------- 404 -------- */
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

/* -------- Error handler -------- */
app.use((err, _req, res, _next) => {
  console.error("Error:", err?.message || err);
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({
    message: err?.userMessage || err?.message || "Something went wrong. Please try again.",
  });
});

/* -------- Start -------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
