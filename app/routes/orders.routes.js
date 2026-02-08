const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const authorizeRoles = require("../middlewares/authorizeRoles");
const validate = require("../middlewares/validate");
const { createOrderSchema, statusSchema } = require("../validators/order.validators");
const orders = require("../controllers/orders.controller");

// user/premium/moderator/admin
router.post("/", authJwt, validate(createOrderSchema), orders.create);
router.get("/", authJwt, orders.myOrders);
router.get("/:id", authJwt, orders.getById);
router.delete("/:id/cancel", authJwt, orders.cancel);

// admin + moderator
router.get("/all/list", authJwt, authorizeRoles("admin", "moderator"), orders.allOrders);
router.put("/:id/status", authJwt, authorizeRoles("admin", "moderator"), validate(statusSchema), orders.updateStatus);
router.put("/:id/pay", authJwt, authorizeRoles("admin", "moderator"), orders.markPaid);

module.exports = router;
