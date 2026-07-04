const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_kamu";

const normalizeRole = (role) => String(role || "user").toLowerCase();

// 1. REGISTER
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi!" });
    }

    const usernameTrimmed = username.trim();

    const userExists = await User.findOne({ username: usernameTrimmed });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Username sudah digunakan oleh akun lain" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userBaru = new User({
      username: usernameTrimmed,
      password: hashedPassword,
      role: "user",
    });

    await userBaru.save();

    res.status(201).json({
      message: "Registrasi berhasil sebagai user!",
      user: {
        id: userBaru._id,
        username: userBaru.username,
        role: userBaru.role,
      },
    });
  } catch (error) {
    console.error("🔥 ERROR REGISTRASI:", error);
    res.status(500).json({
      message: "Server Error saat melakukan registrasi",
      error: error.message,
    });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(400).json({ message: "Username atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Username atau password salah" });
    }

    const token = jwt.sign(
      { id: user._id, role: normalizeRole(user.role) },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login sukses!",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: normalizeRole(user.role),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error saat login", error: error.message });
  }
};

// 3. UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ message: "User ID dan password baru wajib diisi." });
    }

    const isAdmin = normalizeRole(req.user?.role) === "admin";
    const isOwner = String(req.user?.id) === String(userId);

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Anda tidak berhak mengubah password user ini." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "Password berhasil diperbarui!" });
  } catch (error) {
    res.status(500).json({
      message: "Server Error saat update password",
      error: error.message,
    });
  }
};

// 4. UPDATE USERNAME
exports.updateUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;

    if (!userId || !newUsername) {
      return res
        .status(400)
        .json({ message: "User ID dan username baru wajib diisi." });
    }

    const isAdmin = normalizeRole(req.user?.role) === "admin";
    const isOwner = String(req.user?.id) === String(userId);

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Anda tidak berhak mengubah username user ini." });
    }

    const usernameTrimmed = newUsername.trim();

    const usernameExists = await User.findOne({
      username: usernameTrimmed,
      _id: { $ne: userId },
    });

    if (usernameExists) {
      return res.status(400).json({ message: "Username baru sudah digunakan" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: usernameTrimmed },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: "Username berhasil diperbarui!",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: normalizeRole(updatedUser.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error saat update username",
      error: error.message,
    });
  }
};

// 5. UPDATE ROLE
exports.updateRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const roleBaru = normalizeRole(newRole);
    const validRoles = ["admin", "staff", "user"];

    if (!validRoles.includes(roleBaru)) {
      return res.status(400).json({ message: "Role tidak valid!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: roleBaru },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: `Role berhasil diperbarui menjadi ${roleBaru}!`,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: normalizeRole(updatedUser.role),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server Error saat update role", error: error.message });
  }
};

// 6. AMBIL DAFTAR PELANGGAN
exports.getSemuaPelanggan = async (req, res) => {
  try {
    const pelanggan = await User.find({
      role: { $in: ["user", "User"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const normalized = pelanggan.map((item) => ({
      ...item.toObject(),
      role: normalizeRole(item.role),
    }));

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({
      message: "Server Error saat mengambil daftar pelanggan",
      error: error.message,
    });
  }
};

// 7. AMBIL SEMUA USER
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const normalized = users.map((item) => ({
      ...item.toObject(),
      role: normalizeRole(item.role),
    }));

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({
      message: "Server Error saat mengambil semua data user",
      error: error.message,
    });
  }
};
