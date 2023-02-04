const { EventEmitter } = require('events');
const net = require('net');

const channel = new EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (senderId !== id) {
      this.clients[id].write(`${senderId}: ${message}`);
    }
  }
  
  this.on('broadcast', this.subscriptions[id]);
});

net.createServer(client => {
  const id = `user-${client.remotePort}`;
  channel.emit('join', id, client);

  client.on('data', data => {
    channel.emit('broadcast', id, data.toString());
  });
}).listen(8888, () => {
  console.log('Chat is started!');
  console.log('Print in a new terminal window: $ telnet 127.0.0.1 8888');
})

