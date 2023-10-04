const app = require('connect')();
const port = require('../common').port;
const logger = require('./logger');
const errorHandler = require('./error-handler');

const printHello = (req, res) => {
    // foo(); // обработка ошибки по-умолчанию (код ответа 500 "Internal Server Error", трассировка ошибки в теле)
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!');
};

app
    .use(logger(':method :url'))
    .use(printHello)
    .use(errorHandler)
    .listen(port);
