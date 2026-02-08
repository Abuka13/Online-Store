const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/authJwt");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/", authMiddleware, orderController.getOrders);
router.get("/all", authMiddleware, orderController.getAllOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);
router.put("/:id/pay", authMiddleware, orderController.updatePaymentStatus);
router.delete("/:id/cancel", authMiddleware, orderController.cancelOrder);

module.exports = router;
