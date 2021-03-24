const Product = require('../models/product');
const OrderItem = require('../models/order-item');

exports.getProducts = (req, res, next) => {
    Product
        .findAll()
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
        .findByPk(productId)
        .then((product) => {
            res.render('shop/product-detail', { 
                product, 
                pageTitle: product.title, 
                path: '/products'
            });
        })
        .catch(error => {
            console.log(error);
        })
}

exports.getIndex = (req, res, next) => {
    Product
        .findAll()
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
        .then(cart => {
            return cart.getProducts()
            .then(products => {
                res.render('shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products
                });
            
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId }});
        })
        .then(products => {
            let product;
            if ( products.length > 0 ) {
                product = products[0];
            }
            if ( product ) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: {id: productId} });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => console.log(error));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(error => console.log(error));
        })
        .then(() => {
            return fetchedCart.setProducts(null);   
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(error => console.log(error));

}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })
        .catch(error => console.log(error));
};