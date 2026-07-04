const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);

// Logged-in user / admin
router.put("/update-password", verifyToken, authController.updatePassword);
router.put("/update-username", verifyToken, authController.updateUsername);

// Admin only
router.put(
  "/update-role",
  verifyToken,
  allowRoles("admin"),
  authController.updateRole,
);
router.get(
  "/pelanggan",
  verifyToken,
  allowRoles("admin"),
  authController.getSemuaPelanggan,
);
router.get(
  "/users",
  verifyToken,
  allowRoles("admin"),
  authController.getAllUsers,
);

module.exports = router;
