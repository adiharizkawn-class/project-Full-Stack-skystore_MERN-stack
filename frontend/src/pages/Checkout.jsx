import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [keranjang, setKeranjang] = useState(
    location.state?.keranjangBelanja || [],
  );

  const [pelanggan, setPelanggan] = useState("");
  const [meja, setMeja] = useState("");
  const [metode, setMetode] = useState("QRIS");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const tambahPorsi = (id) => {
    setKeranjang(
      keranjang.map((item) =>
        item._id === id ? { ...item, jumlahPesan: item.jumlahPesan + 1 } : item,
      ),
    );
  };

  const kurangPorsi = (id) => {
    const targetItem = keranjang.find((item) => item._id === id);
    if (targetItem.jumlahPesan === 1) {
      setKeranjang(keranjang.filter((item) => item._id !== id));
    } else {
      setKeranjang(
        keranjang.map((item) =>
          item._id === id
            ? { ...item, jumlahPesan: item.jumlahPesan - 1 }
            : item,
        ),
      );
    }
  };

  const totalBayar = keranjang.reduce(
    (sum, item) => sum + item.harga * item.jumlahPesan,
    0,
  );

  const handleBayarSekarang = async () => {
    if (!pelanggan || !meja) {
      setError("Nama Anda dan Nomor Meja wajib diisi!");
      return;
    }

    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      navigate("/login");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/menu/proses-transaksi",
        {
          keranjang,
          pelanggan,
          meja,
          metode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message || "Transaksi Berhasil!");
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal memproses pembayaran, stok habis atau server down.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (keranjang.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-gray-500 font-semibold text-lg">
            Keranjang belanja gabunganmu kosong.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all w-full"
          >
            Kembali Pilih Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 text-gray-100 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl text-gray-800 overflow-hidden border border-gray-100">
        <div className="bg-gray-900 text-white text-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-black tracking-wide flex items-center justify-center gap-2">
            skyStore Gateway Payment 💳
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Sistem Pembayaran Digital Cepat & Aman
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Ringkasan Pesanan
            </h3>
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {keranjang.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-3 gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={
                        item.gambar ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={item.nama}
                      className="w-12 h-12 object-cover rounded-xl border bg-gray-50 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {item.nama}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Rp{" "}
                        {(item.harga * item.jumlahPesan).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => kurangPorsi(item._id)}
                      className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-xs font-black text-red-600 hover:bg-gray-50 transition-all"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-black text-gray-800">
                      {item.jumlahPesan}
                    </span>
                    <button
                      onClick={() => tambahPorsi(item._id)}
                      className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-xs font-black text-blue-600 hover:bg-gray-50 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Data Pengantaran
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  value={pelanggan}
                  onChange={(e) => setPelanggan(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 p-2.5 text-sm font-semibold focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="Masukkan nama..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  Nomor Meja
                </label>
                <input
                  type="text"
                  value={meja}
                  onChange={(e) => setMeja(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 p-2.5 text-sm font-semibold focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="Contoh: 05"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Pilih Metode Pembayaran
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {["QRIS", "Transfer Bank", "Cash"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetode(m)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    metode === m
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>
                    {m === "QRIS" ? "📸" : m === "Transfer Bank" ? "🏦" : "💵"}
                  </span>
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBayarSekarang}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 text-sm font-black transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading
              ? "Memproses..."
              : `Bayar Sekarang • Rp ${totalBayar.toLocaleString("id-ID")}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
