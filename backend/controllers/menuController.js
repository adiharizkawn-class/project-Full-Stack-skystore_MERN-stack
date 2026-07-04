const Menu = require("../models/Menu");
const Order = require("../models/Order");

// 1. AMBIL SEMUA MENU
exports.getAllMenu = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.status(200).json(menus);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data menu", error: error.message });
  }
};

// 2. TAMBAH MENU BARU
exports.createMenu = async (req, res) => {
  try {
    const { nama, harga, kategori, stok, deskripsi, gambar } = req.body;

    const menuBaru = new Menu({
      nama,
      harga: Number(harga),
      kategori,
      stok: Number(stok),
      deskripsi,
      gambar,
    });

    await menuBaru.save();

    res
      .status(201)
      .json({ message: "Menu berhasil ditambahkan!", data: menuBaru });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambah menu", error: error.message });
  }
};

// 3. HAPUS MENU
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenu = await Menu.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu tidak ditemukan!" });
    }

    res.status(200).json({ message: "Menu berhasil dihapus!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus menu", error: error.message });
  }
};

// 4. PROSES TRANSAKSI GABUNGAN
exports.prosesOrderMenu = async (req, res) => {
  try {
    const { keranjang, pelanggan, meja, metode } = req.body;

    if (!keranjang || !Array.isArray(keranjang) || keranjang.length === 0) {
      return res
        .status(400)
        .json({ message: "Keranjang belanja masih kosong!" });
    }

    if (!pelanggan || !meja || !metode) {
      return res.status(400).json({
        message: "Nama pelanggan, nomor meja, dan metode bayar wajib diisi!",
      });
    }

    let totalBayar = 0;
    const daftarItemDapur = [];

    for (const item of keranjang) {
      const menu = await Menu.findById(item._id);

      if (!menu) {
        return res
          .status(404)
          .json({ message: `Menu ${item.nama} tidak ditemukan!` });
      }

      if (menu.stok < item.jumlahPesan) {
        return res
          .status(400)
          .json({ message: `Stok ${menu.nama} tidak mencukupi!` });
      }

      menu.stok -= Number(item.jumlahPesan);
      await menu.save();

      totalBayar += menu.harga * Number(item.jumlahPesan);

      daftarItemDapur.push({
        menuId: menu._id,
        namaMenu: menu.nama,
        jumlahPesan: Number(item.jumlahPesan),
        hargaSatuan: menu.harga,
        gambar: menu.gambar,
      });
    }

    const pesananBaru = new Order({
      namaPelanggan: pelanggan,
      nomorMeja: meja,
      items: daftarItemDapur,
      totalBayar,
      metodeBayar: metode,
      status: "Sedang Diproses",
    });

    await pesananBaru.save();

    res.status(200).json({
      message: "Pesanan gabungan berhasil diproses ke dapur!",
      data: pesananBaru,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal memproses transaksi", error: error.message });
  }
};

// 5. UPDATE MENU
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, kategori, stok, deskripsi, gambar } = req.body;

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        nama,
        harga: Number(harga),
        kategori,
        stok: Number(stok),
        deskripsi,
        gambar,
      },
      { new: true, runValidators: true },
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu tidak ditemukan!" });
    }

    res
      .status(200)
      .json({ message: "Menu berhasil diperbarui!", data: updatedMenu });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal memperbarui menu", error: error.message });
  }
};
