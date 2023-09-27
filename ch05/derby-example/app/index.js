const derby = require('derby');

const app = derby.createApp('app', __filename);
app.loadViews(__dirname);

app.get('/', (page, model) => {
    const message = model.at('app.message');
    message.subscribe(err => {
        if (err) {
            return next(err);
        }
        message.createNull('');
        page.render();
    });
});

module.exports = app;