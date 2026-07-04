const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    namaPelanggan: { type: String, required: true, trim: true },
    nomorMeja: { type: String, required: true, trim: true },

    items: [
      {
        menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
        namaMenu: { type: String, required: true },
        jumlahPesan: { type: Number, required: true, min: 1 },
        hargaSatuan: { type: Number, required: true, min: 0 },
        gambar: { type: String, default: "" },
      },
    ],

    totalBayar: { type: Number, required: true, min: 0 },
    metodeBayar: {
      type: String,
      enum: ["QRIS", "Transfer Bank", "Cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Sedang Diproses", "Sedang Dibuat", "Pesanan Siap"],
      default: "Sedang Diproses",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
