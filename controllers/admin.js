const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false
     });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    // magic method provided by sequelize and our setted relations
    req.user.createProduct({
        title,
        price,
        imageUrl,
        description
    }).then(() => {
        console.log('Product Created.');
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    req.user
        .getProducts({ where: { id: productId }})
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { 
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product
             });
        })
        .catch(error => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product
        .findByPk(productId)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = +updatedPrice;
            product.description = updatedDescription;
            return product.save();
        })
        .then(() => {
            console.log('Product updated.');
            res.redirect('/admin/products');
        })
        .catch(error=> console.log(error));
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products', { 
                products, 
                pageTitle: 'Admin Products', 
                path: '/admin/products'
            });
        })
        .catch(error => {
            console.log(error);
        }); 
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(() => {
            console.log('Product deleted.');
            res.redirect('/admin/products');
        })
        .catch( error => console.log(error));
};

