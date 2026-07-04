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
    origin: "*", // Mengizinkan semua domain (sangat aman untuk deployment Vercel Services)
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;

// Masukkan URL MongoDB Atlas asli kamu di sebelah kanan tanda || sebagai cadangan keamanan jika .env Vercel kosong
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://adi_db_user:db_user152689@cluster0.vmqbuyj.mongodb.net/?appName=Cluster0";

// 2. Routes API (WAJIB di atas route frontend statis)
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Base route untuk API check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Halo selamat datang di backend skystore" });
});

// 3. Frontend Static Files (Hanya jika kamu menyatukan build di Express)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 4. Koneksi DB + Jalankan Server
// Kita buat koneksi database berjalan otomatis di setiap request jika belum terhubung
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Berhasil terhubung ke MongoDB"))
  .catch((error) => console.log("❌ Gagal konek ke MongoDB:", error.message));

// WAJIB: Biarkan server mendengarkan port secara global agar Vercel Serverless bisa membacanya dengan normal
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

// 5. Export App (WAJIB untuk Vercel Serverless Function)
module.exports = app;
