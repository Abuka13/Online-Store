const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/authJwt");
const adminOnly = require("../middlewares/adminOnly");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.post("/", authMiddleware, adminOnly, categoryController.createCategory);
router.put("/:id", authMiddleware, adminOnly, categoryController.updateCategory);
router.delete("/:id", authMiddleware, adminOnly, categoryController.deleteCategory);

module.exports = router;
