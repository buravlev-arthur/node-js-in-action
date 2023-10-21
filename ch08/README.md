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
