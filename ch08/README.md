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

#### ACID

- Атомарность (Atomicity);
- Согласованность (Consistency);
- Изолированность (Isolation);
- Устойчивость (Durability);

Чем выше показатель ACID - тем ниже быстродействие системы.

##### Атомарность

Неделимость операций/действий, неделимость данных. Например, если удалаются все комментарии пользователя, не может быть удалина лишь часть из них (даже при ошибке/сбое в питании).

##### Согласованность

Целостность данных после транзакций. Например, уникальность первичных ключей, соотвествие данных _схеме_ и т.д. Так же есть понятие _согласованности_ в аббривиатуре _CAP_ (C), где значение - это единство представления данных для всех пользователей в распределенной системе.

##### Изоляция

Элементарный способ избавиться от коллизий - блокировать все запросы, пока выполняется текущий. Другой подход - позволять системе выполнять параллельные транзакции с разной степенью изолированности (на уровне таблиц, записей, полей).

##### Устойчивость

Определеяет степень, с которой эффект после транзакции сохранится после перезагрузки/сбоя программы и т.п. При сохранении данных в ОЗУ - низкая устойчивость, а на жёсткий диск - высокая.

#### NoSQL

_NoSQL (Not only SQL)_ - все нереляционные базы данных, некоторые из которых поддерживает язык SQL.

Парадигмы NoSQL баз данных:

- ключ/значение, кортежи (Redis);

- графовые БД (Neo4J);

- документные БД (MongoDB);

- Столбцовые БД (Cassandra);

- БД временных рядов (Graphite);

Существуют многопарадигмальные БД, например: Couchbase.

Схемы доступа в релационных БД создают основную нагрузку на приложение. Требутеся нормализация данных (преобразование запросов для сокращения операций чтения при потреблении данных БД клиентом).

NoSQL денормализуются по умолчанию, что сокращает время на моделирование данных и даёт более гибкую и производительную архитектуру.

#### Распределенные БД

Есть вертикальное масштабирование (увеличение ресурсов машины) и горизонтальное (увеличение количества машин). При горизонтальном масштабировании применяются _распределенные БД_. Некоторые реляционные системы также способны работать с горизонтальным масштабированием в форме репликации: "главный/подчиненный", "главный/главный". Но, например, у MySQL максимальное количество кластеров - 255.

#### MongoDB

_MongoDB_ - документно-ориентированная распределенная база данных.

Документы хранятся в бесхемных коллекциях. Документ не всегда строится по заранее определенной схеме, а документы одной коллекции не всегда совместно используют одну схему. Поэтому на приложение ложится ответственность за _согласованность_ (ACID).

Установка и запуск MongoDB

```bash
# Добавление репозитория MongoDB: https://www.mongodb.com/docs/manual/administration/install-community/
sudo apt install mongodb-org mongodb-mongosh
sudo systemctl start mongod
mongosh
```

NodeJS драйвер:

```bash
npm i --save mongodb
```

Использование драйвера:

```javascript
const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        console.log('Client is ready');
        const db = client.db('db-name');
        client.end();
    })
    .catch(console.error);
```

Большинство взаимодействий с MongoDB осуществляется через коллекции:

`collection.instert(doc)` - вставка документа/документов;
`collection.find(query)` - поиск документов по запросу;
`collection.remove(query)` - удаление документов, соотвествующих запросу;
`collection.drop()` - удаление всей коллекции;
`collection.update(query)` - обновление документов, соответствующих запросу;
`collection.couht(query)` - количество документов в коллекции, удовлетворяющих запросу.

Также есть разновидности запросов для поиска одного/многих документов. Например:

`collection.instertOne(doc)` - поиск одного документа;
`collection.instertMany([doc, doc])` - поиск многих документов.

Примеры:

```javascript
// Добавление документа
const article = {
    title: 'title',
    content: 'content',
};
db.collection('collection-name')
    .instertOne(article)
    .then((result) => {
        // если в исходном объекте нет id, он создаётся
        console.log(result.insertedId.toString());
        // в исходный объект добавляется свойство _id
        console.log(article._id.toString());
    })

// Поиск всех документов с таким заголовком
db.collection(collectionName)
    .find({ title: 'Title of this article' })
    .toArray()
    .then((results) => {
        console.log(results);
    })

// Поиск по id
db.collection(collectionName)
    .findOne({ _id: new ObjectId('65423630b2943c544ab7be2a') })
    // ...

// Поиск по регулярному выражению
db.collection(collectionName)
    .find({ title: { $regex: /^Title(.)*/ }})
    // ...
```

Идентификатор (_id) кодируется с помощью _BSON_ (Binary JSON) и инкапслуриуется в ObjectId;

Получить временную метку создания документа (createdAt):

```javascript
const id = new ObjectId('any-id')
id.getTimestamp();
```

Объект assert (NodeJS):

```javascript
const assert = require('node:assert');

try {
    assert.strictEqual(1, 2);
    console.log('OK');
} catch {
    console.log('1 !== 2');
}
```

Сравнение _id в документах коллекций:

```javascript
// С помощью встроенного метода в ObjectId:
article1._id.equals(article2._id);
// С помощью deepEqual (из модуля node:assert)
assert.deepEqual(article1._id, article2._id);
// С помощью приведение к строковому типу
String(article1._id) === String(article2._id);
```

Создание id из строки:

```javascript
const { ObjectId } = require('mongodb');
const strID = '577f6b45549a3b991e1c3c18';
const bsonID = new ObjectId(strID);
```

##### Реплицированные наборы

Процессы _MongoDB_ могут выполняться как участники реплицированного набора (replica set). Реплицированный набор состоит из одного первичного узла и множества вторичных. У каждого узла свои порт и каталог.

```bash
# завершаем предыдущие процессы MongoDB
sudo pkill mongod
# даём 3 секунды завершить всем процессам
sleep 3

# Формируем реплицированный набор
mongod --port 27017 --dbpath ./mongodata/db0 --replSet rs0
mongod --port 27018 --dbpath ./mongodata/db1 --replSet rs0
mongod --port 27019 --dbpath ./mongodata/db1 --replSet rs0

# инициализируем первичный узел (по умолчанию порт 27017)
mongosh --eval "rs.initiate()"

# добавить узлы в репликационный набор
mongosh --eval "rs.add('127.0.0.1:27017')"
mongosh --eval "rs.add('127.0.0.1:27018')"
mongosh --eval "rs.add('127.0.0.1:27019')"
```

Клиенты MongoDB должны располагать информацией обо всех хостах. Но не все хосты должны быть активны (минимум два). Если первичный узел станет недоступен - любой вторичный узел возьмёт на себя эту роль.

```javascript
const { MongoClient } = require('mongodb');
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
        const db = client.db('db-name');
        db.admin().replSetGetStatus()
            .then((status) => {
                console.log(status);
                client.close();
            })
    });
```

##### Уровень записи

Можно точно управлять балансом между скоростью и надежностью записи данных c помощью уровней _уровней записи_ (write concern). 

Уровень записи - числовое значение, определяющиее, во скольких узлах должна быть произведена запись, чтобы операция была признана успешной.

При нулевом значении мы получаем максимальное быстродействие для некритичных данных (логи, кэш данных и т.п.).

Пример:

```javascript
// быстрая запись, без гарантированных узлов
db.collection('collection-name')
    .insertOne(data, { writeConcern: { w: 0 }});

// динамическое определение количества узлов в репликационном наборе
// гарантирует, что запись произведена в более 50% узлов
db.collection('collection-name')
    .insertOne(data, { writeConcern: { w: 'majority' }});
```

Максимально надёжное решение - распределенные узлы в разных дата-центрах. И одновременно это самое медленное решение.
