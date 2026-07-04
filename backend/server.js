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

// // 3. Frontend Static Files (Menggunakan path dinamis agar aman di Vercel maupun Lokal)
// const frontendPath = process.env.VERCEL
//   ? path.join(process.cwd(), "frontend/dist")
//   : path.join(__dirname, "../frontend/dist");

// app.use(express.static(frontendPath));

// // 4. Catch-All Route untuk Frontend (PENTING: Harus di bawah routes API & static files)
// // Ini berguna agar saat user refresh halaman seperti /login atau /dashboard, halaman tidak 404
// app.get("*", (req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// 5. Koneksi DB + Jalankan Server
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Berhasil terhubung ke MongoDB"))
  .catch((error) => console.log("❌ Gagal konek ke MongoDB:", error.message));

// WAJIB: Biarkan server mendengarkan port secara global agar Vercel Serverless bisa membacanya dengan normal
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

// 6. Export App (WAJIB untuk Vercel Serverless Function)
module.exports = app;
