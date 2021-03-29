const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient
        .connect('mongodb+srv://shop_site_admin:<PASSWPORD_HERE>@cluster0.93a2z.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback();
        })
        .catch(error => {
            console.log(error)
            throw error;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



