const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// 1. Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Diubah ke "*" agar lebih fleksibel saat dideploy
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 2. Routes API (WAJIB di atas route frontend statis)
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Base route untuk API check
app.get("/api/health", (req, res) => {
  res.send("Halo selamat datang di backend skystore");
});

// 3. Frontend Static Files (Untuk menyajikan hasil build React)
// Mengarahkan Express untuk membaca file statis dari folder build React
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Menangani semua request halaman selain API (Routing React) ke index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// 4. Koneksi DB + Jalankan Server (Hanya jika bukan di environment Vercel Production)
const connectMongoose = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Berhasil terhubung ke MongoDB");
  } catch (error) {
    console.log("❌ Gagal konek ke MongoDB:", error.message);
  }
};

// Hubungkan ke database
connectMongoose();

// Jika di local komputer, jalankan app.listen biasa
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

// 5. Export App (WAJIB untuk Vercel Serverless Function)
module.exports = app;
