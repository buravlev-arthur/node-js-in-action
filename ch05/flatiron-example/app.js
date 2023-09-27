const flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

// REST API в стиле Express
app.router.get('/', function () {
  this.res.json({ 'hello': 'world' })
});

app.router.get('/clients/:id', function (id) {
  this.res.writeHead(200, { 'content-type': 'text/plain' });
  this.res.end(`ClientID: ${id}`);
});

// REST API с применением группировки
app.router.path(/\/users\/(\w+)/, function () {
  this.get(function (id) {
    this.res.end(`UserID: ${id}`);
  });

  this.delete(function (id) {
    this.res.end(`User with ID: ${id} was successfully deleted.`);
  });
});

app.start(3000);
