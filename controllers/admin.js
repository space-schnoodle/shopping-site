const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
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
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    
    product
        .save()
        .then(() => {
            console.log('Product Created.');
            res.redirect('/admin/products');
        }).catch(error => {
            console.log(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if ( !editMode ) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then(product => {
            if ( !product ) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { 
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product
             });
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        productId
    );    
    product
        .save()
        .then(() => {
            console.log('Product updated.');
            res.redirect('/admin/products');
        })
        .catch(error=> {
            console.log(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .deleteById(productId)
        .then(() => {
            console.log('Product deleted.');
            res.redirect('/admin/products');
        })
        .catch( error => {
            console.log(error);
        });
};

