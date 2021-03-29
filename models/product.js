const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id): null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) { // Update the product
            dbOp = db
                .collection('products')
                .updateOne({_id : this._id}, { $set: this });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(() => {
                console.log('Product created or updated in db!');
            })
            .catch(error => {
                console.log(error);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                return Promise.resolve(products);
            })
            .catch(error => {
                console.log(error)
            });
    }

    static findById(productId) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongodb.ObjectID(productId) })
            .next()
            .then(product => {
                return Promise.resolve(product);
            })
            .catch(error => {
                console.log(error);
            });
    }

    static deleteById(productId) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id : new mongodb.ObjectId(productId) })
            .then(() => {
                console.log('Product deleted!');
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = Product;