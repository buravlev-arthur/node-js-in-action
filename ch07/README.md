# Шаблонизация

В паттерне _MVC_ слой _представление_ использует один из нескольких языков шаблонизации (_pug_, _ejs_, _hogan_). Представление сначала получает сырые данные из _модели_, затем передаёт их шаблонизатору (template engine) вместе с указанием на файл шаблона, который возвращает скомпилированный HTML, CSS и JavaScript (для задач клиента). Данные из _модели_ подставляются в заполнители (fillers), указанные в разметке файла-шаблона.

Два подхода к формированию представления:
1. Генерация HTML/CSS без использования шаблона;
2. Генерация с применением шаблонизатора (ejs/pug/hogan и т.п.).

Пример ручной генерации и с применением _ejs_: `./own-template-engine/blog.js`

## EJS

_EJS (Embedded JavaScript)_ - шаблонизатор, близкий по концепции к Smarty (PHP), JSP (Java), ERB (Ruby) и т.п. 

Установка

```bash
npm i --save ejs
```

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

## Hogan

_Hogan_, разработанный в Twitter, представляет одну из реализаций шаблонизатора _Mustache_, разработанного в GitHub. Предлагает минималистичный подход к шаблонизации.

Установка:

```javascript
npm i --save hogan.js
```

Вывод обзаца с заданной строкой:

```javascript
const hogan = require('hogan.js');
const context = { message: 'It is hogan template!' };
const template = hogan.compile('<p>{{ message }}</p>');
console.log(template.render(context));
```

Неэкранированный вывод: `{{{ message }}}` или `{{& message }}`

Комментарий: `{{! This is  comment }}`

Секции (перечисления):

```javascript
const context = {
    users: [
        { name: 'John', age: 23 },
        { name: 'Elisabeth', age: 19 },
    ],
};

const template = hogan.compile(`
    {{#users}}
        <p>Name: {{name}}; Age: {{age}}</p>
    {{/users}}
`);

console.log(template.render(context));
```

Инвертированная секция (сообщение при отсутствии данных):

```javascript
const context = `
    {{^users}}
        <p>Нет данных!</p>
    {{/users}}
`;
```

Лямбда-секции позволяет расширять функционал шаблонизатора. Например, преобразовывать markdown-разметку в html-шаблон:

```bash
npm i -D marked
```

```javascript
const hogan = require('hogan');
const marked = require('marked');

const context = {
    text: 'Текст заголовка',
    markdown: () => (text) => marked.parse(text),
};

const template = hogan.compile(`
    {{#markdown}}
    # **Заголовок**: {{ text }} 
    {{/markdown}}
`);

// <h1><strong>Заголовок</strong>: Текст заголовка</h1>
console.log(template.render(context));
```

Компоненты (partials):

```javascript
const hogan = require('hogan');

const context = {
    users: [
        { name: 'John', age: 22 },
        { name: 'Elisabeth', 31 },
    ],
};

const partial = hogan.comlile('<p>{{name}}, {{age}} years old</p>');
const mainTemplate = `
    {{#users}}
    {{>users}}
    {{/users}}
`;

console.log(mainTemplate(context, { users: partial }));
```

Настройки Hogan (изменение разделителей на EJS-стиль):

```javascript
const hogan = require('hogan');
const template = hogan('<p><% value %></p>', {
    delimiters: '<% %>',
});
console.log(template.render({ value: 'text' }));
```

Пример использования Hogan: `./hogan-snippet/index.js`