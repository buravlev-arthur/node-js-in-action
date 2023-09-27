const http = require('http');
const director = require('director');

const port = process.argv.port || process.env.PORT || 3000;

const router = new director.http.Router();

// определяем параметр, который затем будет многократно использоваться
router.param('bookId', /(\d+)/);


// используем параметр bookId в обработке запроса
router.on('get', '/books/:bookId', function (bookId) {
    this.res.writeHead(200, { 'Content-type': 'text/plain' });
    this.res.end(`Book ID: ${bookId}`);
});

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
