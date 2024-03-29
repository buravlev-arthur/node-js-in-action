const redis = require('redis');
const bcrypt = require('bcrypt');

const db = redis.createClient();

class User {
    constructor(obj) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }

    async save(cb) {
        await db.connect();

        if (this.id) {
            await this.update(cb);
        } else {
            try {
                // увеличиваем счётчик идентификаторов в ключе "user:ids"
                // и получаем новый userID для создаваемого пользователя
                this.id = await db.incr('user:ids');
                await this.hashPassword(cb); // хэширование пароля
                await this.update(cb); // обновляем данные пользователя в Redis
            } catch (err) {
                cb(err);
            }
        }

        await db.disconnect();
    }

    async update(cb) {
        const { id } = this;
        try {
            // для ключа с "user:id:<username>" обновляем значение (userID)
            await db.set(`user:id:${this.name}`, id);
            // для ключа "user:<userID>" обновляем таблицу с полями/значениями в this 
            await db.hSet(`user:${id}`, this);
            cb();
        } catch (err) {
            cb(err);
        }
    }

    async hashPassword(cb) {
        try {
            this.salt = await bcrypt.genSalt(12);
            this.pass = await bcrypt.hash(this.pass, this.salt);
        } catch (err) {
            cb(err);
        }
    }

    // этот метод будет вызываться автоматически в JSON.stringify(new User({ ...}))
    toJSON() {
        return {
            id: this.id,
            name: this.name,
        }
    }

    static async getByName(name, cb) {
        User.getId(name, (err, id) => {
            if (err) {
                cb(err);
            }

            User.getDataById(id, (err, userData) => {
                if (err) {
                    cb(err);
                }

                cb(null, new User(userData));
            })
        });
    }

    static async getId(name, cb) {
        try {
            await db.connect();
            const id = await db.get(`user:id:${name}`);
            await db.disconnect();
            cb(null, id);
        } catch (err) {
            cb(err);
        }
    }

    static async getDataById(id, cb) {
        try {
            await db.connect();
            const userData = await db.hGetAll(`user:${id}`);
            await db.disconnect();
            cb(null, new User(userData));
        } catch (err) {
            cb(err);
        }
    }

    static auth(name, pass, cb) {
        User.getByName(name, async (err, dbUserData) => {
            if (err) {
                cb(err);
            }

            // при поиске по несуществующему ключу Redis вернёт пустой хэш-массив
            // поэтому нужно смотреть, чтобы в хэше существовали поля
            if (!dbUserData.id) {
                return cb();
            }

            const enrtyPassHash = await bcrypt.hash(pass, dbUserData.salt);

            if (enrtyPassHash === dbUserData.pass) {
                return cb(null, dbUserData);
            }

            cb();
        });
    }
}

module.exports = User;
