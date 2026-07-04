const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Public
router.get("/", menuController.getAllMenu);

// User/Admin/Staff yang sudah login bisa checkout
router.put("/proses-transaksi", verifyToken, menuController.prosesOrderMenu);

// Admin only
router.post("/", verifyToken, allowRoles("admin"), menuController.createMenu);
router.put("/:id", verifyToken, allowRoles("admin"), menuController.updateMenu);
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  menuController.deleteMenu,
);

module.exports = router;
