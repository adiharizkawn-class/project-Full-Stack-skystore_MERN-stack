import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const getUserData = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser && savedUser !== "undefined"
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error("Gagal membaca data user dari localStorage", error);
      return null;
    }
  };

  const user = getUserData();
  const token = localStorage.getItem("token");
  const userRole = String(user?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";
  const isStaff = userRole === "staff";

  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("Makanan");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editNama, setEditNama] = useState("");
  const [editHarga, setEditHarga] = useState("");
  const [editKategori, setEditKategori] = useState("Makanan");
  const [editStok, setEditStok] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editGambar, setEditGambar] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchData = async () => {
    try {
      const orderPromise = axios.get(
        "http://localhost:5000/api/orders",
        config,
      );

      const menuPromise = isAdmin
        ? axios.get("http://localhost:5000/api/menu")
        : Promise.resolve({ data: [] });

      const userPromise = isAdmin
        ? axios.get("http://localhost:5000/api/auth/users", config)
        : Promise.resolve({ data: [] });

      const [resOrder, resMenu, resUsers] = await Promise.all([
        orderPromise,
        menuPromise,
        userPromise,
      ]);

      setOrders(Array.isArray(resOrder.data) ? resOrder.data : []);
      setMenus(Array.isArray(resMenu.data) ? resMenu.data : []);
      setPelanggan(Array.isArray(resUsers.data) ? resUsers.data : []);
    } catch (err) {
      console.error("Gagal mengambil data dashboard", err);
      setError(err.response?.data?.message || "Gagal memuat data dashboard.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!isAdmin && !isStaff) {
      navigate("/home");
      return;
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  const handleTambahMenu = async (e) => {
    e.preventDefault();
    setError("");
    setSukses("");

    try {
      await axios.post(
        "http://localhost:5000/api/menu",
        {
          nama,
          harga: Number(harga),
          kategori,
          stok: Number(stok),
          deskripsi,
          gambar,
        },
        config,
      );

      setSukses("Hore! Menu baru berhasil ditambahkan!");
      setNama("");
      setHarga("");
      setStok("");
      setDeskripsi("");
      setGambar("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambah menu baru.");
    }
  };

  const handleHapusMenu = async (id) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus menu ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${id}`, config);
        fetchData();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Gagal menghapus menu.");
      }
    }
  };

  const bukaModalEdit = (item) => {
    setEditId(item._id);
    setEditNama(item.nama);
    setEditHarga(item.harga);
    setEditKategori(item.kategori || "Makanan");
    setEditStok(item.stok);
    setEditDeskripsi(item.deskripsi || "");
    setEditGambar(item.gambar || "");
    setIsEditModalOpen(true);
  };

  const handleSimpanEditMenu = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/menu/${editId}`,
        {
          nama: editNama,
          harga: Number(editHarga),
          kategori: editKategori,
          stok: Number(editStok),
          deskripsi: editDeskripsi,
          gambar: editGambar,
        },
        config,
      );
      setIsEditModalOpen(false);
      fetchData();
      alert("Menu sukses diperbarui!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengedit menu.");
    }
  };

  const handleUbahRolePelanggan = async (userId, roleBaru) => {
    try {
      await axios.put(
        "http://localhost:5000/api/auth/update-role",
        { userId, newRole: roleBaru },
        config,
      );
      fetchData();
      alert(`Role berhasil diubah menjadi ${roleBaru}!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengubah role user.");
    }
  };

  const handleUpdateStatusOrder = async (id, tindakan) => {
    try {
      if (tindakan === "BATAL" || tindakan === "SELESAI") {
        if (
          window.confirm(
            "Apakah kamu yakin ingin menghapus pesanan ini secara permanen?",
          )
        ) {
          await axios.delete(`http://localhost:5000/api/orders/${id}`, config);
          fetchData();
        }
      } else {
        await axios.put(
          `http://localhost:5000/api/orders/${id}`,
          { tindakan },
          config,
        );
        fetchData();
      }
    } catch (err) {
      console.error("Gagal memproses tindakan order", err);
      alert(err.response?.data?.message || "Gagal memproses pesanan.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white shadow-md">
        <h2 className="text-xl font-bold tracking-wider">
          skyStore <span className="text-blue-400">Dashboard 🏛️</span>
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
            👤 {user?.username || "User"} ({userRole || "user"})
          </span>

          <button
            onClick={() => navigate("/home")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all border border-blue-500 shadow-md shadow-blue-900/30"
          >
            Lihat Menu Utama 🛒
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-all"
          >
            Keluar
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 h-fit">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Tambah Menu Produk
              </h3>

              {sukses && (
                <div className="mb-3 rounded-lg bg-green-50 p-2 text-center text-xs text-green-600 border border-green-100">
                  {sukses}
                </div>
              )}

              <form onSubmit={handleTambahMenu} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Bakso Sapi Urat"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    URL Link Gambar
                  </label>
                  <input
                    type="text"
                    value={gambar}
                    onChange={(e) => setGambar(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/foto.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="15000"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Jumlah Stok
                    </label>
                    <input
                      type="number"
                      value={stok}
                      onChange={(e) => setStok(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Cemilan">Cemilan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows="2"
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2.5 text-sm font-bold shadow-md transition-all"
                >
                  Simpan Barang
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Live Monitoring Inventaris
              </h3>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 text-white text-xs uppercase">
                      <th className="p-3">Info Produk</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Harga</th>
                      <th className="p-3">Stok</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-sm">
                    {Array.isArray(menus) &&
                      menus.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={item.gambar || fallbackImage}
                              alt={item.nama}
                              className="w-10 h-10 object-cover rounded-lg border bg-gray-100"
                              onError={(e) => {
                                e.target.src = fallbackImage;
                              }}
                            />
                            <span className="font-semibold text-gray-800">
                              {item.nama}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">{item.kategori}</td>
                          <td className="p-3">
                            Rp {item.harga?.toLocaleString("id-ID") || 0}
                          </td>
                          <td className="p-3 font-bold">{item.stok} Pcs</td>
                          <td className="p-3 text-center flex items-center justify-center gap-2">
                            <button
                              onClick={() => bukaModalEdit(item)}
                              className="text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all border border-amber-200"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => handleHapusMenu(item._id)}
                              className="text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all border border-red-200"
                            >
                              Hapus 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              👨‍🍳 Monitor Antrean Dapur Live{" "}
              <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-green-400"></span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola alur pembuatan makanan dan minuman pesanan multi-item
              skyStore
            </p>
          </div>

          {!Array.isArray(orders) || orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 font-medium">
              📭 Belum ada pesanan gabungan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-2xl p-5 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-gray-900 text-white">
                        🪑 Meja {order.nomorMeja}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          order.status === "Sedang Diproses"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "Sedang Dibuat"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="my-4 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl"
                        >
                          <img
                            src={item.gambar || fallbackImage}
                            alt={item.namaMenu}
                            className="w-8 h-8 object-cover rounded-lg border bg-white"
                            onError={(e) => {
                              e.target.src = fallbackImage;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs truncate">
                              {item.namaMenu}
                            </h4>
                            <p className="text-[10px] text-gray-400">
                              Rp {item.hargaSatuan?.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <span className="font-black text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-md">
                            {item.jumlahPesan}x
                          </span>
                        </div>
                      ))}

                      <p className="text-xs text-gray-500 mt-3 pt-1 border-t border-dashed">
                        Pelanggan:{" "}
                        <span className="font-bold text-gray-700">
                          {order.namaPelanggan}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        {order.metodeBayar}
                      </span>
                      <span className="font-black text-gray-900 text-sm">
                        Rp {order.totalBayar?.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {order.status === "Sedang Diproses" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateStatusOrder(order._id, "MASAK")
                          }
                          className="flex-1 bg-amber-500 text-white rounded-xl py-2 text-xs font-bold"
                        >
                          Mulai Masak 🍳
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatusOrder(order._id, "BATAL")
                          }
                          className="bg-red-50 text-red-600 rounded-xl px-3 py-2 text-xs font-bold border border-red-200"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    {order.status === "Sedang Dibuat" && (
                      <button
                        onClick={() =>
                          handleUpdateStatusOrder(order._id, "SIAP")
                        }
                        className="w-full bg-blue-600 text-white rounded-xl py-2 text-xs font-bold"
                      >
                        Siap Diantar 🔔
                      </button>
                    )}

                    {order.status === "Pesanan Siap" && (
                      <button
                        onClick={() =>
                          handleUpdateStatusOrder(order._id, "SELESAI")
                        }
                        className="w-full bg-green-600 text-white rounded-xl py-2 text-xs font-bold"
                      >
                        Selesai (Hapus) ✅
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                👥 Manajemen Akun & Daftar Pelanggan
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Kelola tingkat hak akses (Role) seluruh akun yang terdaftar di
                skyStore
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs uppercase">
                    <th className="p-3">ID User</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Role Saat Ini</th>
                    <th className="p-3 text-center">Ubah Akses Hak (Role)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-sm">
                  {Array.isArray(pelanggan) && pelanggan.length > 0 ? (
                    pelanggan.map((userPelanggan) => (
                      <tr
                        key={userPelanggan._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-mono text-xs text-gray-400">
                          {userPelanggan._id}
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          👤 {userPelanggan.username}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              userPelanggan.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : userPelanggan.role === "staff"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {userPelanggan.role}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={userPelanggan.role || "user"}
                            onChange={(e) =>
                              handleUbahRolePelanggan(
                                userPelanggan._id,
                                e.target.value,
                              )
                            }
                            className="rounded-lg border border-gray-300 p-1.5 text-xs bg-white focus:outline-none focus:border-blue-500 font-medium text-gray-700"
                          >
                            <option value="user">User / Pelanggan</option>
                            <option value="staff">Staff / Dapur</option>
                            <option value="admin">Admin Utama</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center p-6 text-gray-400 font-medium"
                      >
                        📭 Belum ada data pelanggan yang berhasil dimuat dari
                        database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isAdmin && isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border relative">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ✏️ Edit Informasi Menu
            </h3>

            <form onSubmit={handleSimpanEditMenu} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  URL Gambar
                </label>
                <input
                  type="text"
                  value={editGambar}
                  onChange={(e) => setEditGambar(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={editHarga}
                    onChange={(e) => setEditHarga(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    value={editStok}
                    onChange={(e) => setEditStok(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Kategori
                </label>
                <select
                  value={editKategori}
                  onChange={(e) => setEditKategori(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Minuman">Minuman</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  rows="2"
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 rounded-lg py-2 text-sm font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-bold shadow-md"
                >
                  Perbarui 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
