const pg = require('pg');

const db = new pg.Client({
    user: 'arthur',
    password: '123456',
    database: 'articles',
});

// подключение
db.connect((err, client) => {
    if (err) {
        throw err;
    }
    console.log(`Connected to database: ${db.database}`);

    // создание таблицы
    db.query(`
        CREATE TABLE IF NOT EXISTS snippets (
            id SERIAL,
            body text,
            PRIMARY KEY(id)
        );
    `, (err, result) => {
        if (err) throw err;
        console.log('Created table "snippets"'); 

        // добавление записи
        const body = 'Hello, Postgres!';
        db.query(`
            INSERT INTO snippets (body) VALUES ('${body}')
            RETURNING id
        `, (err, result) => {
            if (err) throw err;
            const [{ id }] = result.rows;
            console.log('Created row with id:', id);

            // Обновление данных в записи
            const newBody = 'Updated text for body';
            db.query(`
                UPDATE snippets SET body = '${newBody}'
                WHERE id=${id};
            `, (err, result) => {
                if (err) throw err;
                const updatedRows = result.rowCount;
                console.log('Updated rows count:', updatedRows);

                // Выборка данных
                db.query(
                    'SELECT * FROM snippets ORDER BY id;',
                    (err, result) => {
                        if (err) throw err;
                        console.log(result.rows);
                        // закрытие соединения
                        db.end();
                    }
                )
            });
        });
    });
});
