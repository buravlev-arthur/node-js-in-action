const fs = require('fs');
const pug = require('pug');

const templateFilename = `${__dirname}/templates/page.pug`;
const template = pug.compile(
    fs.readFileSync(templateFilename),
    {
        filename: templateFilename,
    }
);

const context = {
    messages: [
        'Message 1',
        'Message 2',
        'Message 3',
    ],
    users: [
        { name: 'John', age: 23 },
        { name: 'Adam', age: 32 },
    ]
};

console.log(template(context));