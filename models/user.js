const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
            .then(() => {
                console.log('User created!');
            })
            .catch(error => {
                console.log(error);
            });
    }

    addToCart(product) {
        const db = getDb();
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCarItems = [...this.cart.items];
        
        if (cartProductIndex >= 0) { // product already exists
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCarItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCarItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
        }

        const updatedCart = { 
            items: updatedCarItems
         };
       
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) }, 
                { $set: { cart: updatedCart }}
            );
    }

    getCart() { // return a populated cart
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const db = getDb();
        const updatedCarItems = this.cart.items.filter(item => {
            return item.productId.toString() !==  productId.toString();
        });

        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) }, 
                { $set: { cart: { items: updatedCarItems }} }
            );
    }

    addOrder() {
        const db = getDb();
        return this
            .getCart()
            .then( products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name
                    }
                };

                return db
                    .collection('orders')
                    .insertOne(order);
            })
            .then(() => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) }, 
                        { $set: { cart: { items: [] }} }
                    );
        });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': new ObjectId(this._id)})
            .toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id : new mongodb.ObjectId(userId) })
            .then(user => {
                return Promise.resolve(user);
            })
            .catch(error => {
                console.log('Error', error);
            });
    }
}

module.exports = User;