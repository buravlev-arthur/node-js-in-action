# Шаблонизация

В паттерне _MVC_ слой _представление_ использует один из нескольких языков шаблонизации (_pug_, _ejs_, _hogan_). Представление сначала получает сырые данные из _модели_, затем передаёт их шаблонизатору (template engine) вместе с указанием на файл шаблона, который возвращает скомпилированный HTML, CSS и JavaScript (для задач клиента). Данные из _модели_ подставляются в заполнители (fillers), указанные в разметке файла-шаблона.

Два подхода к формированию представления:
1. Генерация HTML/CSS без использования шаблона;
2. Генерация с применением шаблонизатора (ejs/pug/hogan и т.п.).

Пример ручной генерации и с применением _ejs_: `./own-template-engine/blog.js`

## EJS

_EJS (Embedded JavaScript)_ - шаблонизатор, близкий по концепции к Smarty (PHP), JSP (Java), ERB (Ruby) и т.п. 

Данные, передаваемые шаблону называеются _контекстом_:

```javascript
const template = '<%= title %>';
const context = { title: 'Title' };
ejs.render(template, context);
```

Изменить символ спецификации тегов EJS:

```javascript
ejs.delimiter = '$';
const template = '<$= title $>';
```

`<%= %>` - экранированная строка

`<%- %>` - неэкранированная строка

Кэширование шаблонов:

```javascript
const cache = (process.env.NODE_ENV ?? 'development') === 'production';
const filename = `${__dirname}/template.ejs`;
const template = fs.readFileSync(filename, 'utf-8');
ejs.render(template, { /* context data */ }, {
    cache,
    filename, // требуется для работы кэширования
})
```

Пример использования EJS на стороне сервера: `./ejs-project/app.js`

Пример использования EJS на стороне клиента: `./ejs-prject/ejs-on-client-side/index.html`
