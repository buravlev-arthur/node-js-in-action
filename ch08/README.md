# Хранение данных в приложениях

Реляционные базы данных основаны на концепции реляционной алгебры и теории множеств. _Scheme (схема)_ описывает формат различных типов данных и связи между ними. Например, типы: User и Post. Связь User и Post: один ко многим. На языке _SQL (Structured Query Language)_ выполняются запросы к базе данных.

## PostgreSQL

Установка в Debian 12:

```bash
# Устанавливаем последнюю версию
sudo apt update
sudo apt install postgresql
# Проверить статус демона
sudo systemctl status postgres
```

Создание пользователя (роли):

```bash
# аутентифицируемся под пользователем postgress
sudo -su postgres
# запускаем postgres repl:
psql
# создаём новую роль с именем своего пользователя
CREATE ROLE username;
# устанавливаем пароль для роли
ALTER ROLE username WITH PASSWORD 'password';
# даём права на вход и создание новых баз данных
ALTER ROLE username LOGIN CREATEDB;
# проверяем наличие новой роли и превилегии
\du
# выходим из repl
exit
# завершаем сессию пользователя postgres
exit
```

Создание базы данных и вход:

```bash
createdb database-name
psql -d database-name
```

Удаление базы данных:

```bash
dropdb database-name
```

### Postgres в Node

Установка клиента:

```javascript
npm i --save pg
```

Пример подключения к базе данных:

```javascript
const pg = require('pg');

// создание клиента
const db = pg.Client({
    user: 'username',
    password: 'password',
    database: 'database-name',
});

// подключение к базе данных
db.connect((err, client) => {
    if (err) throw err;
    console.log(`Connected to: ${db.database}`);
    db.end(); // закрытие подключения
})
```

`\dt` - просмотр всех таблиц

Создание таблицы:

```javascript
// SERIAL - числовой тип данных, по-умолчанию
// присваивающий вместо null следующее число
db.query(`
    CREATE TABLE IF NOT EXISTS table-name (
        id SERIAL,
        PRIMARY KEY(id),
        body TEXT
    );
`, (err, result) => { /* ... */ });
```

Добавление записи c добавлением id в результат:

```javascript
db.query(`
    INSERT INTO table-name (row) VALUES ('value')
    RETURNING id
`, (err, result) => {
    if (err) throw err;
    const [{ id }] = result.rows;
    console.log('Created row with id:', id);
});
```

Обновление полей в записи:

```javascript
const id = 0;
db.query(`
    UPDATE table-name SET column-name = 'new_value'
    WHERE id=${id};
`, (err, result) => {
    if (err) throw err;
    console.log('Updated rows count:', result.rowCount);
});
```

Выборка данных из таблицы, упорядоченных по полю id:

```javascript
db.query(
    'SELECT * FROM table_name ORDER BY id;',
    (err, result) => {
        if (err) throw err;
        console.log(result.rows); // массив с записями
    }
)
```

`TABLE table_name;` - просмотр всех записей в таблице
`\d table_name;` - просмотр структуры таблицы


### Knex

Установка:

```bash
npm i --save knex
# Дополнительно нужны драйвера используемых баз данных
# Например: Sqlite и Postgress
npm i --save sqlite3 pg
```

Подключение и использование Knex
```javascript
const knex = require('knex');

// пример подключения Sqlite
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'db.sqlite' // или :memory: для хранения данных в ОЗУ
    }
});

// пример подключения к Postgress
const db = knex({
    client: 'pg',
    connection: {
        database: 'articles',
        username: 'username',
        password: 'password'
    }
});

// создание таблицы
const createTable = async () => {
    const tableIsExists = await db.schema.hasTable('articles');
    if (!tableIsExists) {
        await db.schema.createTable('articles', (table) => {
            table.increments('id').primary();
            table.string('title');
            table.text('content');
        });
    }
};

createTable().then({
    // добавить новую запись
    db('articles').insert({ title: 'title', content: 'content' });
    // получить все записи таблицы, отсортированные по полю "title"
    db('articles').orderBy('title');
    // получить запись по id
    db('articles').where({ id: 0 }).first();
    // удалить запись
    db('articles').del().where({ id: 0 });
});
```

#### Безопасные абстрации

Из-за того, что разные БД имеют специфичные элементы синтаксиса, одни и те же абстрации могут работать и не работать от БД к БД. Например:

```javascript
table.increments('id').primary(); // работает и в Sqlite и в PosgreSQL
table.integer('id').primaery(); // работает в Sqlite, но не работает в PosgreSQL
```

#### Различия MySQL и PosgreSQL

- PostgreSQL поддерживает сложные типы данных: массивы, JSON, пользовательские типы;

- PosgreSQL поддерживает полнотекстовый поиск;

- В PosgreSQL строгое соответствие стандарту ANSI SQL:2008;

- Репликация в MySQL мощнее;

- Сообщество MySQL больше, больше и самих инструментов;

- У MySQL есть дефрагментация на ветви: MySQL, MariaDB, WebScaleSQL и т.д.;

- Быстродействие при масштабировании в обеих БД зависит от множества факторов - проверять нужно на практике.
