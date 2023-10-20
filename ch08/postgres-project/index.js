const pg = require('pg');

const db = new pg.Client({
    user: 'arthur',
    password: '123456',
    database: 'articles',
});

db.connect((err, client) => {
    if (err) {
        throw err;
    }
    console.log(`Connected to database: ${db.database}`);
    db.end();
});
