const { MongoClient } = require('mongodb');
const { dbName } = require('./common');
// const os = require('os');
// const hostname = os.hostname();

const host = '127.0.0.1';

const hosts = [
    `${host}:27017`,
    `${host}:27018`,
    `${host}:27019`
];

MongoClient.connect(
    `mongodb://${hosts.join(',')}`,
    { replicaSet: 'rs0' }
)
    .then((client) => {
        const db = client.db(dbName);
        db.admin().replSetGetStatus()
            .then((status) => {
                console.log(status);
                client.close();
            })
    });
