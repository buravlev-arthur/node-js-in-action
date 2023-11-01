const db = require('./db');
const assert = require('node:assert');

db().then(() => {
    db.Article.create({ title: 'Title of an article' }).then(() => {
        db.Article.all().then((articles) => {
            console.log(
                // выводит объекты всех документов
                articles,
                // выводим createdAt всех документов коллекции
                articles.map(({ _id }) => _id.getTimestamp()),
            );

            // сравнение идентификаторов
            console.log(articles[0]._id.equals(articles[1]._id));

            process.exit();
        })
    })
});
