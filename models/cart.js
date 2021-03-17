const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch the previous cart
        fs.readFile(p, (error, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!error) {
                cart = JSON.parse(fileContent);
            }
            // analize the cart, find existing product
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // add new product
            if (existingProduct) {
                updatedProduct = { ... existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1 };
                cart.products = [... cart.products, updatedProduct];
            }
            // increase quantity 
            cart.totalPrice = cart.totalPrice + +productPrice;
            // save file
            fs.writeFile(p, JSON.stringify(cart), error => {
                console.log(error);
            });
        });
    }; 

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                return;
            }
            const updatedCart = { ... JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQuantity = product.quantity;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;
            fs.writeFile(p, JSON.stringify(updatedCart), error => {
                console.log(error);
            });
        });
    }

    static getCart(callback) {
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                callback({"products": [], "totalPrice": 0});
            } else {
                const cart = JSON.parse(fileContent);
                callback(cart);
            }  
        });
    }
};