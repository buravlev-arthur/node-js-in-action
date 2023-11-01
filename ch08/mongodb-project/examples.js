const { MongoClient, ObjectId } = require('mongodb');
const { port, dbName, collectionName } = require('./common');

const article = {
    title: 'Title of this article',
    content: 'Content of the article',
};

MongoClient.connect(`mongodb://127.0.0.1:${port}`)
    .then((client) => {
        console.log('Client is ready\n');
        const db = client.db(dbName);

        // создаём коллекцию и добавляем один документ
        db.collection(collectionName)
            .insertOne(article)
            .then((result) => {
                // если в исходном объекте нет id, он создаётся
                console.log(result.insertedId.toString());
                // в исходный объект добавляется свойство _id
                console.log(article._id.toString());
            });

        // найти все документы с таким заголовком
        db.collection(collectionName)
            .find({ title: 'Title of this article' })
            .toArray()
            .then((results) => {
                console.log('Found: ', results);
            });
        
        // поиск по id
        db.collection(collectionName)
            .findOne({ _id: new ObjectId('65423630b2943c544ab7be2a') })
            .then((result) => {
                console.log('Found by id: ', result);
            });

        // поиск по регулярному выражению
        db.collection(collectionName)
            .find({ title: { $regex: /^Title(.)*/ }})
            .toArray()
            .then((results) => {
                console.log('Found by regexp: ', results);
            });

        setTimeout(() => {
            client.close();
        }, 2000);
    })
    .catch((err) => {
        console.error(err);
    });
