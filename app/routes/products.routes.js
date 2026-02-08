const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validate = require("../middlewares/validate");
const { productSchema } = require("../validators/product.validators");
const products = require("../controllers/products.controller");

// public
router.get("/", products.getAll);
router.get("/:id", products.getById);

// admin only
router.post("/", authJwt, authorizeRoles("admin"), validate(productSchema), products.create);
router.put("/:id", authJwt, authorizeRoles("admin"), validate(productSchema), products.update);
router.delete("/:id", authJwt, authorizeRoles("admin"), products.remove);

module.exports = router;