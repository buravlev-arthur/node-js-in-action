const http = require('http');
const director = require('director');

const port = process.argv.port || process.env.PORT || 3000;

const router = new director.http.Router();

// обработка потока данных
router.get('/', { stream: true }, function () {
    this.req.on('data', function (chunk) {
        console.log(chunk);
    });
});

const server = http.createServer((req, res) => {
    router.dispatch(req, res, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('404 - No Page');
        }

        console.log('Served: ', req.url)
    });
});

server.listen(port, function() {
    console.log(`Server is running on: http://localhost:${port}`);
});
