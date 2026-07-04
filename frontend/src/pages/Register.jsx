import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          password,
        },
      );

      if (response.status === 201 || response.status === 200) {
        alert("Registrasi Berhasil! Silakan Login.");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal terhubung ke server backend",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">
            skyStore <span className="text-blue-600">Register </span>
          </h2>
          <p className="text-gray-500 mt-2">
            Buat akun untuk mulai memesan hidangan lezat
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">
              Username
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-gray-900"
              placeholder="Masukkan username baru"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-1">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-gray-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            }`}
          >
            {loading ? "Memproses..." : "Daftar Sekarang "}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
