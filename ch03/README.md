# Что представляет собой веб-приложение Node?

## Базовая структура Node-проекта

- `package.json` - зависимости, сценарии (команды запуска проекта, тестирования и т.п.)
- `public/` - статические ресурсы (CSS, клиентский JS, изображения и т.п.)
- `node_modules/` - зависимости проекта
- `index.js` - код подготовки приложения
- `models/` - модели баз данных
- `views/` - шаблоны страниц
- `routes/` - обработчики HTTP-запросов
- `middleware/` - промежуточные скрипты и компоненты

## REST-совместимая веб-служба

Удаление npm-пакета:

```bash
npm rm --save <package name>
```

Сценарий в `package.json`:

```JSON
{
    "scripts": {
        "start": "node index.js"
    }
}
```

Запуск приложение с указанием параметра:

```bash
PORT 8888 npm start
```

**Пример просто Express-сервера**: server_example.js

Получить значение параметра в URL запроса в Express:

```javascript
app.get("/path/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(id);
});
```

**Работа с cURL**:

```bash
    # get-запрос
    curl http://localhost:port/path/0

    # delete-запрос
    curl -X DELETE http://localhost:port/path/0

    # post-запрос с телом
    curl --data "title=Example Text" http://localhost:port/path
```

Парсер тела запросов в Express:

```bash
    npm install --save body-parser
```

Поддержка тела запроса в формета JSON и веб-форм:

```javascript
const bodyParser = require("body-parser");

// const app = ...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

Получение значения из тела POST-запроса в Express:

```javascript
app.get("/path/:id", (req, res, next) => {
  const title = req.body.title;
  console.log(title);
});
```

## База данных

_Объектно-реляционное отображение (ORM)_ - представление данных БД в виде объекта в языке программирования.

ORM для MongoDB: [Mongoose](https://mongoosejs.com/)
ORM для PostgreSQL, MySQL и SQLite3: [Bookshelf.js](https://bookshelfjs.org/)

Установка модуля для SQLite:

```bash
    npm install --save sqlite3
```

Использование sqlite3:

```javascript
const sqlite3 = require("sqlite3").verbose();
// имя файла БД
const dbName = "dbname.sqlite";
// Подключение к файлу БД
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  // создание таблицы, удаление и добавление поля
  db.run(
    "INSERT INTO table(name, content) VALUES(?, ?)",
    name,
    content,
    callback
  );
  // получение всех полей из таблицы
  db.all("SELECT * FROM table", callback);
  // Получение одного поля из таблицы
  db.get("SELECT * FROM table WHERE id = ?", id, callback);
});

db.close();
```

**Пример использования sqlite3**: db.js

## Модуль Readability

Установка:

```bash
    npm install --save node-readability
```

Использование:

```javascript
const read = require("node-readability");

const url = "https://...";
read(url, (err, result) => {
  console.log(result.title, result.content);
});
```

## Интерфейс приложения

Ответ на запрос в нужном формате в Express:

```javascript
app.get("/", (req, res, next) => {
  res.format({
    html: () => {
      res.render("template.ejs", { data: someDataForTemplate });
    },
    json: () => {
      res.send(data);
    },
  });
});
```

_EJS (Embedded JavaScript)_ - ядро/движок шаблонов.

Установка EJS:

```bash
    npm install --save ejs
```

`<%- include('head', { title: "Articles" }) %>` - включение шаблона head.ejs (`<%-` - неэкранированный HTML) и передача объекта с данными
`<% articles.forEach((article) => { ... }) %>` - обход массива
`<%= title %>` - вставка экранированного текста

**Пример EJS-шаблона**: ./views/artiles.ejs

### npm-зависимости на стороне клиента

Установка bootstrap:

```bash
    npm install --save bootstrap
```

`node_modules/boostrap/dist/css/boostrap.min.css` - исходне скомпилированные стили bootstrap

#### Статические файлы

Загрузка статитики в Express с помощью прослойки `express.static`:

```javascript
app.use(
  "/css/bootstrap.min.css",
  express.static("node_modules/bootstrap/dist/css/bootstrap.min.css")
);
```

Инструменты вроде _Webpack_, _Vite_, _Browserify_ позволяют использовать модули и конструкцию require на клиентской стороне
посредством предварительной сборки всех зависимостей проекта.
