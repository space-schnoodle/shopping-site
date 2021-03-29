const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/product-list', { 
                products, 
                pageTitle: 'All Products', 
                path: '/products'
            });
        })
        .catch(error => {
            console.log(error);
        }); 
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then((product) => {
            res.render('shop/product-detail', { 
                product, 
                pageTitle: product.title, 
                path: '/products'
            });
        })
        .catch(error => {
            console.log(error);
        });
};

exports.getIndex = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/index', { 
                products, 
                pageTitle: 'Shop', 
                path: '/'
            });
        })
        .catch(error => {
            console.log(error);
        }); 
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
                res.render('shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products
                });
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.
        findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteItemFromCart(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error)
        });
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })
        .catch(error => {
            console.log(error);
        });
};