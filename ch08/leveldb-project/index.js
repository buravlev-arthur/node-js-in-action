const { Level } = require('level');
const memdown = require('memdown');

const db = new Level('./app.db', {
    valueEncoding: 'json',
    keyEncoding: 'utf8',
});

// добавление, получение и удаление ключа со значением
db.put('user', { name: 'Alice' }, (err) => {
    if (err) throw err;
    db.get('user', (err, result) => {
        if (err) throw err;
        console.log(result);
        db.del('user', (err) => {
            if (err) throw err;
        });
    });
});

// определение ошибки отсутствия ключа в базе
db.get('wrong-key', (err, result) => {
    if (!err.notFound) throw err;
    if (err.notFound) {
        return console.warn('Key was not found');
    }
    console.log("wrong-key = ", result);
});

// переопределение опций подключения для определенных запросов
const options = {
    keyEncoding: 'binary',
    valueEncoding: 'hex',
};

const key = new Uint8Array([1, 2, 3]);
const value = 0xFF0099;

db.put(key, value, options, (err) => {
    if (err) throw err;
    db.get(key, options, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});
