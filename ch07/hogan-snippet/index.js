const hogan = require('hogan.js');
const marked = require('marked');

const context = {
    message: 'It\'s hogan template!',
    users: [
        { name: 'John', age: 23 },
        { name: 'Elisabeth', age: 19 },
    ],
    value: 'Just some text',
    title: 'Markdown title',
    // обработчик лямбда-секции "markdown"
    markdown: () => (text) => marked.parse(text), 
};

// Компонента
const studentsTemplate = hogan.compile(`
    <p>Name: {{name}}; Age: {{age}}</p>
`);

// Использование разделителей в стиле EJS
const ejsPartial = hogan.compile(`<p><% value %></p>`, {
    delimiters: '<% %>',
});

// Основной шаблон
const mainTemplate = hogan.compile(`
    <p>{{&message}}</p>

    {{#users}}
    {{>students}}
    {{/users}}

    {{^users}}
    <p>Нет данных</p>
    {{/users}}

    {{#markdown}}# **Title**: {{title}}{{/markdown}}

    {{>value}}
`);

console.log(mainTemplate.render(context, {
    students: studentsTemplate,
    value: ejsPartial,
}));
