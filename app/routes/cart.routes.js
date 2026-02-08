const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const validate = require("../middlewares/validate");
const { addToCartSchema, updateCartSchema } = require("../validators/cart.validators");
const cart = require("../controllers/cart.controller");

router.get("/", authJwt, cart.getCart);
router.post("/add", authJwt, validate(addToCartSchema), cart.add);
router.put("/update", authJwt, validate(updateCartSchema), cart.update);
router.delete("/remove/:productId", authJwt, cart.removeItem);
router.delete("/clear", authJwt, cart.clear);

module.exports = router;
