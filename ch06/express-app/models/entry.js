const redis = require('redis');

const db = redis.createClient();

class Entry {
    constructor(obj) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }

    async save(cb) {
        try {
            const entryJSON = JSON.stringify(this);
            await db.connect();
            // помещает элемент в начало списка с ключом "entries"
            await db.lPush('entries', entryJSON);
            await db.disconnect();
            cb();
        } catch (err) {
            cb(err);
        }
    }

    // к статическим методам нельзя обращаться из экземляров класса
    static async getRange(from, to, cb) {
        try {
            await db.connect();
            const items = await db.lRange('entries', from, to);
            await db.disconnect();
            cb(null, items.map((item) => JSON.parse(item)));
        } catch (err) {
            cb(err);
        }
    }

    static async getCount(cb) {
        try {
            await db.connect();
            const count = await db.lLen('entries');
            await db.disconnect();
            cb(null, count);
        } catch (err) {
            cb(err);
        }
    }
}

module.exports = Entry;
