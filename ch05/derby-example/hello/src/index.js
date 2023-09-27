const derby = require('derby');

const app = derby.createApp('helloworld', __filename);
app.loadViews(`${__dirname}/../views`);

app.get('/hello', (page) => {
    page.render();
});

module.exports = app;
