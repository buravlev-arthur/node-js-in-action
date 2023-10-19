const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const filename = `${__dirname}/templates/students.ejs`;
const cache = (process.env.NODE_ENV ?? 'development') === 'production';
const students = [
    { name: 'Jack', age: 21 },
    { name: 'Anna', age: 18 },
    { name: 'Mike', age: 20 },
];

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(filename, (err, fileRawData) => {
            if (err) {
                return console.error(err);
            }
            const template = fileRawData.toString();
            const output = ejs.render(template, { students }, {
                cache,
                filename
            });
            res.setHeader('Content-Type', 'text/html');
            res.end(output);
        })
    } else {
        res.statusCode = 404;
        res.end('404 - Page not found');
    }
});

server.listen(3000);
