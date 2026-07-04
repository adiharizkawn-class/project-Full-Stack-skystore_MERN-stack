const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Admin & Staff bisa lihat / update antrean dapur
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "staff"),
  orderController.getSemuaOrder,
);
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "staff"),
  orderController.updateStatusOrder,
);
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "staff"),
  orderController.deleteOrder,
);

module.exports = router;
