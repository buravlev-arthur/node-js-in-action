const { MongoClient, ObjectId } = require('mongodb');
const { port, dbName, collectionName } = require('./common');

let db;

module.exports = () => {
    return MongoClient.connect(`mongodb://127.0.0.1:${port}`)
        .then((client) => {
            db = client.db(dbName);
            
        })
        .catch(console.error);
};

module.exports.Article = {
    all() {
        return db.collection(collectionName)
            .find()
            .sort({ id: 1 })
            .toArray();
    },

    find(_id) {
        const id = typeof _id === 'string'
            ? ObjectId(_id)
            : _id;

        return db.collection(collectionName)
            .findOne({ _id: id });
    },

    create(data) {
        return db.collection(collectionName)
            .insertOne(data);
    },

    delete(_id) {
        const id = typeof _id === 'string'
        ? ObjectId(_id)
        : _id;

        return db.collection(collectionName)
            .remove({ _id: id });
    }
};
