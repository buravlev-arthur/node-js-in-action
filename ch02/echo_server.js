const net = require('net');

net.createServer(socket => {
  socket.on('data', data => { // событие срабатывает, когда появляются новые данные
    socket.write(data); // пишем данные на сторону клиента
  })
}).listen(8888, () => {
  console.log('Echo server is running...');
  console.log('Print in a new terminal window: $ telnet 127.0.0.1 8888');
});