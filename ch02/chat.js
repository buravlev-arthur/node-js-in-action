const { EventEmitter } = require('events');
const net = require('net');

const channel = new EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(100);

channel.on('error', err => {
  console.log('Chat error: ',  error);
})

channel.on('join', function(id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if (senderId !== id) {
      this.clients[id].write(`${senderId}: ${message}`);
    }
  }
  
  this.on('broadcast', this.subscriptions[id]);

  client.write(`Welcome, ${id}! Online is: ${this.listeners('broadcast').length}\n`);
  this.emit('broadcast', id, 'has joined the chat\n');
});

channel.on('leave', function(id) {
  this.removeListener('broadcast', this.subscriptions[id]);
  this.emit('broadcast', id, 'has left the chart\n');
});

channel.on('shutdown', function() {
  this.emit('broadcast', 'Server', 'has shut down\n');
  this.removeAllListeners('broadcast');
});

net.createServer(client => {
  const id = `user-${client.remotePort}`;
  channel.emit('join', id, client);

  client.on('data', data => {
    const dataStr = data.toString();
    if (dataStr === 'shutdown\r\n') {
      channel.emit('shutdown');
    }

    channel.emit('broadcast', id, dataStr);
  });

  client.on('close', () => {
    channel.emit('leave', id);
  })
}).listen(8888, () => {
  console.log('Chat is started!');
  console.log('Print in a new terminal window: telnet 127.0.0.1 8888');
})

