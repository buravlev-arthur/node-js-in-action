const env = require('../common').env;

// самостоятельная обработка ошибки
module.exports = (err, req, res, next) => {
    res.statusCode = 500;
    switch (env) {
        case 'development':
            console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(err));
            break;
        default:
            res.end('Internal Server Error');
    }
};
