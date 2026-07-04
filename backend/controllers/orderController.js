const Order = require("../models/Order");

// 1. AMBIL SEMUA PESANAN
exports.getSemuaOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: 1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data pesanan", error: error.message });
  }
};

// 2. UPDATE STATUS PESANAN
exports.updateStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { tindakan } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan!" });
    }

    if (tindakan === "MASAK") {
      order.status = "Sedang Dibuat";
      await order.save();
      return res
        .status(200)
        .json({ message: "Pesanan sekarang sedang dibuat koki." });
    }

    if (tindakan === "SIAP") {
      order.status = "Pesanan Siap";
      await order.save();
      return res
        .status(200)
        .json({ message: "Pesanan siap disajikan ke pelanggan!" });
    }

    if (tindakan === "SELESAI") {
      await Order.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: "Pesanan selesai dan dihapus dari layar monitor." });
    }

    return res.status(400).json({ message: "Tindakan status tidak valid." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengubah status pesanan", error: error.message });
  }
};

// 3. HAPUS PESANAN
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    res.status(200).json({ message: "Pesanan berhasil dihapus dari antrean!" });
  } catch (error) {
    res.status(500).json({
      message: "Server Error saat menghapus pesanan",
      error: error.message,
    });
  }
};
