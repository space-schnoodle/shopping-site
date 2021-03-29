const express = require('express');

const shopController  = require('../controllers/shop');

const router = express.Router();

// GET view - all products
router.get('/', shopController.getIndex);

// GET all products
router.get('/products', shopController.getProducts);

// GET product by id
router.get('/products/:productId', shopController.getProduct);

// GET cart (view)
router.get('/cart', shopController.getCart);

// POST - Create a new cart
router.post('/cart', shopController.postCart);

// POST - Delete an item from the cart
router.post('/cart-detele-item', shopController.postCartDeleteProduct);

// POST - Create the order 
router.post('/create-order', shopController.postOrder);

// GET - View the order
router.get('/orders', shopController.getOrders);

module.exports = router;
