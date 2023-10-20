const pug = require('pug');
const fs = require('fs');
const template = fs.readFileSync('./templates/index.pug');

const context = {
    url: 'https://google.com',
    text: 'to Google',
    users: [
        { name: 'John', age: 30 },
        { name: 'Adam', age: 28 },
    ],
};

const parse = pug.compile(template);
console.log(parse(context));
