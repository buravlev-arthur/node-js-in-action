const db = require('./db');

db().then(() => {
    db.Article.create({
        title: 'my article',
        content: 'article content'
    }).then(() => {
        db.Article.all().then((articles) => {
            console.log(articles);
            process.exit();
        });
    });
}).catch((err) => {
    throw err;
});
