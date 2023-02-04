const { EventEmitter } = require('events');

// создаём генератор событий
const channel = new EventEmitter();

// создаём слушателя события 'join' и определяем обработчик этого события
channel.on('join', () => {
  console.log('You have enjoyned to channel.');
});

setTimeout(() => {
  channel.emit('join'); // программно инициируем событие
}, 1000);