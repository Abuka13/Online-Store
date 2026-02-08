const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const authJwt = require('../middlewares/authJwt');
const adminOnly = require('../middlewares/adminOnly');

// Public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin only
router.post('/', authJwt, adminOnly, productController.createProduct);
router.put('/:id', authJwt, adminOnly, productController.updateProduct);
router.delete('/:id', authJwt, adminOnly, productController.deleteProduct);

module.exports = router;
