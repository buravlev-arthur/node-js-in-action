const http = require('http');

debugger;

const port = 8080;

debugger;

const server = http.createServer((req, res) => {
  res.end('Hello, world');
});

debugger;

server.listen(port, () => {
  console.log('Server listening on: http://localhost:%s', port)
});
