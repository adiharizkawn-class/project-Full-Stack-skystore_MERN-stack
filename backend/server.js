const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Halo selamat datang di backend skystore");
});

// Connect DB + run server
const connectMongoose = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Berhasil terhubung ke MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Gagal konek ke MongoDB:", error.message);
  }
};

connectMongoose();
