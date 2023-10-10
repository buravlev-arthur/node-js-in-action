const redis = require('redis');

const db = redis.createClient();

class Entry {
    constructor(obj) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }

    async save(cb) {
        await db.connect();
        const entryJSON = JSON.stringify(this);
        try {
            // помещает элемент в начало списка с ключом "entries"
            await db.lPush('entries', entryJSON);
            cb();
        } catch (err) {
            cb(err);
        } finally {
            await db.disconnect();
        }
    }

    // к статическим методам нельзя обращаться из экземляров класса
    static async getRange(from, to, cb) {
        await db.connect();
        try {
            const items = await db.lRange('entries', from, to);
            cb(null, items.map((item) => JSON.parse(item)));
        } catch (err) {
            cb(err);
        } finally {
            await db.disconnect();
        }
    }
}

module.exports = Entry;
