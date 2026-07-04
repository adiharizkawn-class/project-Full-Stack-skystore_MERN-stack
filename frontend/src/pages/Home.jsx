import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const tambahKeKeranjang = (item) => {
    const adaDiCart = cart.find((c) => c._id === item._id);
    if (adaDiCart) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, jumlahPesan: c.jumlahPesan + 1 } : c,
        ),
      );
    } else {
      setCart([...cart, { ...item, jumlahPesan: 1 }]);
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        setMenus(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Gagal memuat menu makanan", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const fallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 shrink-0">
            sky<span className="text-blue-600">Store.</span>
            <span className="hidden lg:inline text-sm font-medium text-gray-500 ml-1">
              Culinary
            </span>
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  alert(
                    "Waduh! Kamu harus login terlebih dahulu sebelum membuka keranjang belanja. 🙏",
                  );
                  navigate("/login");
                  return;
                }
                navigate("/checkout", { state: { keranjangBelanja: cart } });
              }}
              className="relative flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-700 transition-all active:scale-95 border border-gray-200/60 whitespace-nowrap"
            >
              <span>🛒 Cart</span>
              {cart.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] sm:text-[11px] font-black h-4 w-4 sm:h-5 sm:w-5 rounded-full flex items-center justify-center animate-pulse">
                  {cart.reduce((total, item) => total + item.jumlahPesan, 0)}
                </span>
              )}
            </button>

            <Link
              to="/login"
              className="px-3.5 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all duration-200 inline-block text-center whitespace-nowrap"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-3.5 sm:px-5 py-2 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-slate-900/10 hover:bg-blue-600 active:scale-95 transition-all duration-200 inline-block text-center whitespace-nowrap"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white py-10 sm:py-16 lg:py-20 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left space-y-4 sm:space-y-6 order-1">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] sm:text-xs font-bold text-blue-700 border border-blue-200">
                ⚡ Digitalisasi Rasa & Kenyamanan
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight lg:text-6xl text-gray-900 leading-tight">
              Pesan Kuliner Favoritmu Secara{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block sm:inline">
                Real-Time.
              </span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Selamat datang di skyStore! Kami menghadirkan kemudahan memesan
              aneka ragam menu hidangan berkualitas premium langsung dari
              genggamanmu.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#katalog-menu"
                className="w-full sm:w-auto text-center rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-600 shadow-xl shadow-gray-900/10 transition-all active:scale-95"
              >
                Jelajahi Menu 🍔
              </a>
            </div>
          </div>

          <div className="relative w-full order-2 mt-2 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
              alt="Culinary Premium skyStore"
              className="w-full h-64 sm:h-80 lg:h-[400px] object-cover rounded-3xl shadow-xl lg:shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </section>

      <main
        id="katalog-menu"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 sm:mb-10 border-b pb-4 border-gray-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Daftar Menu Hidangan
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Diproses langsung secara higienis dari dapur skyStore
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium animate-pulse">
            Menghubungkan ke server...
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center bg-white border rounded-2xl py-16 px-4 shadow-xs">
            <p className="text-gray-400 text-base sm:text-lg font-medium">
              Belum ada hidangan yang tersedia hari ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {menus.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-square xs:aspect-video w-full overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.gambar || fallbackImage}
                    alt={item.nama}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = fallbackImage;
                    }}
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-md ${
                      item.kategori === "Makanan"
                        ? "bg-orange-500 text-white"
                        : item.kategori === "Minuman"
                          ? "bg-blue-500 text-white"
                          : "bg-purple-500 text-white"
                    }`}
                  >
                    {item.kategori}
                  </span>
                </div>

                <div className="p-3 sm:p-5 flex flex-col flex-1">
                  <h4 className="text-xs sm:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5 sm:mb-1 line-clamp-1">
                    {item.nama}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 mb-3 sm:mb-4 leading-relaxed flex-1">
                    {item.deskripsi ||
                      "Hidangan signature lezat khas racikan master chef skyStore."}
                  </p>

                  <div className="flex items-end justify-between pt-2 sm:pt-3 border-t border-gray-100 mt-auto gap-1">
                    <div className="min-w-0">
                      <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                        Harga
                      </span>
                      <span className="text-xs sm:text-base font-black text-gray-900 block truncate">
                        Rp {item.harga.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={() => tambahKeKeranjang(item)}
                      disabled={item.stok <= 0}
                      className={`rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold text-white transition-all shadow-md active:scale-95 shrink-0 ${
                        item.stok > 0
                          ? "bg-blue-600 hover:bg-gray-900 shadow-blue-100"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {item.stok > 0 ? "+ Cart" : "Habis"}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-dashed border-gray-100 text-[9px] sm:text-[10px] text-gray-400 font-medium">
                    <span>{item.stok > 0 ? "🟢 Ready" : "🔴 Sold Out"}</span>
                    <span>Stok: {item.stok}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
