const knex = require('knex');
const sqlite3 = require('sqlite3');

// подключение к Sqlite
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: ':memory:', // или физический файл, например: db.sqlite
    },
    // лучше работает при смене баз данных
    useNullAsDefault: true,
});

// подключение к PostgreSQL
const pgDB = knex({
    client: 'pg',
    connection: {
        database: 'articles',
        user: 'arthur',
        password: '123456'
    },
});

// создание таблицы в базе данных
module.exports = async () => {
    const tableIsExists = await db.schema.hasTable('articles');
    if (!tableIsExists) {
        await db.schema.createTable('articles', (table) => {
            table.increments('id').primary();
            table.string('title');
            table.text('content');
        });
    }
};

module.exports.Article = {
    // получить все записи таблицы, отсортированные по полю "title"
    all: () => {
        return db('articles').orderBy('title');
    },
    // получить запись по id
    find: (id) => {
        return db('articles').where({ id }).first();
    },
    // добавить запись в таблицу
    create: (data) => {
        return db('articles').insert(data);
    },
    // удалить запись по id
    delete: (id) => {
        return db('articles').del().where({ id });
    }
};
