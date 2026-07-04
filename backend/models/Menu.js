const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    harga: {
      type: Number,
      required: [true, "Harga wajib diisi"],
      min: 0,
    },
    kategori: {
      type: String,
      required: [true, "Kategori wajib diisi"],
      enum: ["Makanan", "Minuman", "Cemilan"],
    },
    deskripsi: {
      type: String,
      trim: true,
      default: "",
    },
    stok: {
      type: Number,
      default: 0,
      min: 0,
    },
    gambar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Menu", menuSchema);
