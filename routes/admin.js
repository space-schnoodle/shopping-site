const express = require('express');

const adminController  = require('../controllers/admin');

const router = express.Router();

// GET - Add a product (View)
router.get('/add-product', adminController.getAddProduct);

// GET - View all products
router.get('/products', adminController.getProducts);

// POST - Add a product
router.post('/add-product', adminController.postAddProduct);

// GET - Get a product by id.
router.get('/edit-product/:productId', adminController.getEditProduct);

// POST - Edit a product
router.post('/edit-product', adminController.postEditProduct);

// POST - Delete a product
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
