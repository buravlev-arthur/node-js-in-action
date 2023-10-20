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

## Pug

Ранее известный как _Jade_. В синтаксисе используются содержательные пробельные символы (отступы) для определения уровня вложенности. Отсутствуют закрывающие теги. Поддерживает примеси (mixins) и наследование.

Установка Pug:

```bash
npm i --save pug
```

Пример синтаксиса:

```pug
//- <div class="classname" id="idname"></div>
.classname#idname
    //- Многострочное определение контента внутри тегов
    style
        p {
            padding-left: 20px;
            margin: 12px 0px;
        }
    p
        | Длинный текст обзаца,
        | разделеннный на несколько строк
        | c применением "|", т.к. в отличии от
        | тега style (выше), тег "p" может иметь 
        | дочерние теги
    
    strong А это способ записи короткого контента
    
    //- атрибуты тегов
    form(
        method="POST"
        action="/"
    )
        select
            option( value="Tomato" ) Tomato
            option( value="Cucumber" ) Cucumber
    
    //- блочное расширение (вложенность с помощью ":")
    ul
        li: a(href="/") Home page
        li: a(href="/contacts") Contacts
```

Включение данных в шаблон:

```javascript
const pug = require('pug');
const context = {
    url: 'https://google.com',
    text: 'to Google',
};
const template = 'a(href = url) #{text}';
const parse = pug.compile(template);
console.log(parse(context));
```

Считывание шаблона Pug из файла:

```javascript
const pug = require('pug');
const fs = require('fs');
const template = fs.readFileSync('./templates/index.pug');
```

Переменные:

```pug
- var count = 0
- count = 0

// с экранированным выводом значения в шаблон
= count = 0
// вывод неэкранированного значения в шаблон
!= count = 0
```

Сокращенный вывод значения:

```pug
- count = 0
// оба варианта эквиваленты
p Count: #{count}
p= `Count: ${count}`
```

Перебор объектов и массивов:

```pug
//- Обход массива
each user in users
    p= `${user.name}, ${user.age} years old` 
   
//- Обход объекта
each value, key in users[0]
    strong= key
    p= value
```

Условная визуализация:

```pug
- n = Math.round(Math.random() * 1) + 1
if n == 1
    p Знаение равно 1

//- if (n !== 1)
unless n == 1
    p Значение не равно 1
```

Конструкция "case":

```pug
case users.length 
    when 0
        p Нет пользователей
    when 1
        p= `${users[0].name}, ${users[0].age} years old`
    default 
        each user in users
            p= `${user.name}, ${user.age} years old`
```

Наследование:

```pug
//- layout.pug
html
    head
        - baseUrl = "http://google.com"
        block scripts
        block title
    body
        block content
```

```pug
//- page.pug
extends layout
block scripts
    - searchStr = 'search'
    script(src=`${baseUrl}/?search=${searchStr}`)
block title
    title Title
block content
    p Some content
```

```javascript
// для компиляции include/extends нужен параметр filename
const filename = './page.pug';
const template = pug.compile(fs.readFileSync(filename), { filename });
```

Включения шаблонов:

```pug
//- layout.pug
html
    include head
    include body.html
```

```pug
//- head.pug
head
    title Title of a page
```

```html
<!-- body.html -->
<body>
    <p>Content</p>
</body>
```

Миксины

```javascript
const context = {
    user: { name: 'John', age: 32, mail: 'test@test.com' }
};
```

```pug
//- mixins.pug
mixin display_object_prop(object, prop)
    p= object[prop]
```

```pug
//- page.pug
include mixins
+display_object_prop(user, 'name')
```
