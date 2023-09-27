const http = require('http');
const director = require('director');

const port = process.argv.port || process.env.PORT || 3000;

// таблица маршрутизации
const router = new director.http.Router({
    '/hello': {
        get: function() {
            this.res.writeHead(200, { 'Content-type': 'text/plain' });
            this.res.end('Hello World');
        },
    },
});

// слушаем http-запросы и выполняем метод dispatch на каждый из них
const server = http.createServer((req, res) => {
    router.dispatch(req, res, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('404 - No Page');
        }
    });
});

server.listen(port, function() {
    console.log(`Server is running on: http://localhost:${port}`);
});
