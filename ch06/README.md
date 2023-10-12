# Connect и Express

_Express_ построен на базе _Connect_. Расширяет и дополняет его, является более высокоуровневой обёрткой.

## Connect

Установка:

```bash
npm i --save connect
```

Простейшей приложение:
```javascript
// connect - это функция createServer()
const app = require('connect')();

app.use((req, res, next) => {
    res.end('Hello, World!');
});

app.listen(8080);
```

### Connect Middlewares

Функция, передаваемая в качестве параметра `app.use()` является мидлварой (middleware component). В данном случае мидлвар завершает запрос (`end()`) отправкой ответа с текстом.
Мидлвары - основа всех приложений _Connect_ и _Express_.

Мидлвара в _Connect_ - это функция с тремя параметрами:

- Объект запроса;
- Объект ответа;
- Callback-функция (обычно: `next()`), указывающая, что мидлвара завершила работу и нужно переходить к следующей.

Первым запрос получает _диспетчер_ и передаёт его первой мидлваре. Люблая мидлвара, переданая в `use()` имеет три сигнатуры:

- `cb(req, res, next)`;
- `cb(err, req, res, next)`;
- `cb(req, res)`.

Последняя используется для мидлвар, которые возвращают ответ серверу и передавать управление обратно _диспетчеру_ им не нужно. Порядок мидлваров важен.

`use()` возвращает экземляр приложения Connect(), поэтому можно использовать конвйер:

```javascript
app
    .use(middleware1)
    .use(middleware2)
    .listen(3000);
```

Настраиваемую и переиспользуемую мидлвару можно реализовать с помощью функции иницализации, которая возвращает другую функцию с замыканием:

```javascript
const setup = (options) => {
    // инициализация мидлвары
    return (req, res, next) => {
        // логика мидлвары
    }
}
```

### Обработка ошибок

1. **Обработка ошибок по-умолчанию**. Код ответа 500 - Internal Server Error. В теле - html с трассировкой ошибки;
2. **Самостоятельная обработка**. Использует сигнатуру: `cb(err, req, res, next)`. Такая мидлвара (с обработкой ошибок) устанавливается в конвейре в самом конце. Все предыдущие мидлвары в конвейере (с сигнатурами из трех или двух параметров) будут пропущены:

```javascript
app
    .use(middlewareWithError) // бросает исключение (ошибка)
    .use((req, res, next) => { ... }) // будет пропущена
    .use((req, res) => { ... }) // будет пропущена
    .use((err, req, res, next) => {
        // логика обработки ошибки
    })
```

**Пример**: ./connect-app

## Express

Глобальная установка CLI-генератора Express-приложений:

```bash
npm i -g express-generator
express --help
```

Генерация и запуск Express-приложения:

```bash
# флаг "e" - использование EJS-шаблонизатора 
express -e project-name
cd project-name
npm install
npm start
```

### Окружение

```bash
NODE_ENV=production node server.js
```

```javascript
const app = require('express')();
console.log(app.get('env')); // production
```

Если `NODE_ENV` не задана, то по умолчанию: `development`.

Методы для работы с окружением:

- `app.set()`
- `app.get()`
- `app.enable()` и `app.enabled()`
- `app.disable()` и `app.disabled()` 

Настройка отступов в JSON-ответах:

```javascript
app.set('json spaces', 2);
```

### Представления (views)

Два способа визуализации представлений:

- На уровне приложения: `app.render()`
- На уровне ответа на запрос: `res.render()` (использует первый)

```javascript
app.get('/', (res, req) => {
    // будет использован шаблон: /views/index.ejs
    res.render('index', { name: 'John' });
});
```

Настройка каталога для представлений:

```javascript
// __dirname - каталог, где расположен скрипт
app.use('views', `${__dirname}/views`);
```

Настройка препроцессора по умолчанию для шаблонов:

```javascript
// теперь можно не указывать расширения у представлений
app.use('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/feed', (req, res) => {
    // расширение указано, потому что используем другой препроцессор
    res.render('feed.ejs');
});
```

При разработке для удобства можно отключать кэширование шаблонов, чтобы иметь возможность редактировать шаблоны без перезагрузки сервера:

```javascript
if (app.get('env') === 'development') {
  app.set('view cache', false);
}
```

Представления можно помещать в подкаталоги:

```javascript
app.render('entries'); // views/entries/index.ejs
app.render('entries/edit'); // views/entries/edit.ejs
```

Передача данных представлениям:

```javascript
// через второй параметр render()
app.render('index', { data: 'value' });

// через app.locals.settings (в шаблоне: settings.data)
app.set('data', 'value');

// через app.locals (в шаблоне: prop)
app.locals.prop = 'your data';

// через res.locals (в шаблоне: prop)
app.get('/', (req, res) => {
    res.locals.prop = 'your data';
    res.render( /* ... */ );
})
```

Приоритет: перемменные шаблона, переменные в `render()`, `res.locals`, `app.locals`.

Если в шаблоне используется форма с атрибутом "name" такого вида:

```html
<input name="post[title]" />
<input name="post[body]" />
```

Необходимо в таком случае сконфигурировать парсер тела запроса в Express в режим расширенного разбора:

```javascript
const express = require('express');
const app = express();
app.set(express.urlencoded({ extended: true }));
```

### Маршрутизация (routes) и Middlewares

Помимо описания логики для отдельно взятого маршрута, можно определять логику/проверку данных в мидлварах сразу для нескольких маршрутов. Для этого:

1. Cоздать директорию: `/middleware` и создать внутри нее модуль с нужным названием;
2. Экспортировать в модуле мидлвару со следующей структурой:
```javascript
// /middleware/index.js
// пример проверки существования свойства в теле запроса

exports.customMiddleware = (prop) => {
    return (req, res, next) => {
        const value = req.body[prop];
        if (value) {
            next();
        } else {
            console.error(`"${prop}" must be defined`);
            res.redirect('back');
        }
    }
};
```
3. В маршрут передаём данную мидлвару (между путём и обработчиком запроса можно через запятую указать любое количество мидлвар):

```javascript
// /routes/index.js
const app = require('express')();
const { customMiddleware } = require('../middleware');

app.body('/add', customMiddleware('anyFormFieldName'), (req, res, next) => {
    // ...
});
```

### Инструменты

#### Некоторые команды Redis

```javascript
const redis = require('redis');

(async () => {
    const db = redis.createClient();
    await db.connect();

    // увеличить на 1 числовое значение для ключа 'keyName'
    const userId = await db.inrc('keyName');
    // добавить элемент в список c ключом 'keyName'
    const lengthOfList = await db.lPush('keyName', JSON.stringify(jsonData));
    // получить всю выборку из списка (второй и третий параметры: от/до)
    const items = await db.lRange('keyName', 0, -1);
    // удалить элементы из списка начания с головы
    const removedItems = await db.lPopCount('keyValue', 10);
    // установить ключ со значением/обновить значение ключа
    await db.set('keyName', 'value');
    // посмотреть значение ключа
    const value = await db.get('keyName');
    // создать/обновить хэш-таблицу
    const countOfAddedFields = await db.hSet('keyName', jsonDataOrObject);
    // получить всю хэш-таблицу (все поля и значения)
    const obj = await db.hGetAll('keyName');
})();
```

#### bcrypt

Установка в проект:

```bash
npm i --save bcrypt
```

Использование:

```javascript
const password = '123456';
const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash(password, salt);
// сохраняем в базе passwordHash и salt
```

### Работа с сеансами

_PRG (Post/Redirect/Get)_ - паттерн проектирования в веб-приложениях. Пользователь отправляет форму POST-запросом и перенаправляется на другую страницу (GET-запрос).

Установка мидлвары:

```bash
npm i --save express-session
```

Минимальная конфигурация (после конфигурации Cookie):

```javascript
// конфигурация сессии
app.use(session({
  // Применяется для подписи cookie: Session ID
  secret: process.env.SESSION_SECRET,
  // запрет на пересохранение сессии в хранилище, даже если не было изменений
  resave: false,
  // запрет на сохранение новой сессии/сессии без изменений в хранилище
  saveUninitialized: true,  
}));
```

Пример с использованием сессий в мидлваре:

```javascript
app.use((req, res, next) => {
    req.session.messages = [];
    req.session.messages.push({ text: 'text', type: 'info' });
    req session.removeMessages = () => {
        req.session.messages = [];
    };
    next();
});
```

Удаление сессии (с созданием новой):

```javascript
app.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
```
