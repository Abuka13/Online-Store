const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/authJwt");

router.get("/", authMiddleware, cartController.getCart);
router.post("/add", authMiddleware, cartController.addToCart);
router.put("/update", authMiddleware, cartController.updateCartItem);
router.delete(
  "/remove/:productId",
  authMiddleware,
  cartController.removeFromCart,
);
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
