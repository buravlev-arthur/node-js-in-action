const ejs = require('ejs');

ejs.delimiter = '$';
const template = `
        <p><$= title $></p>
        <$- script $>
    `;
const context = {
    title: 'Title',
    script: '<script>alert("trasted script!");</script>'
};
console.log(ejs.render(template, context));