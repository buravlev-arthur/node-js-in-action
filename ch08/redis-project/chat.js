const net = require('node:net');
const { createClient } = require('redis');

const server = net.createServer(async (socket) => {
    // создание клиента подписки Redis
    const subscriber = await createClient().connect();
    // подписываем клиента на канал "main-channel"
    // выводим все сообщения канала на экран
    await subscriber.subscribe('main-channel', (message, channel) => {
        socket.write(`Channel "${channel}": ${message}`);
    })

    // создание клиента публикации Redis
    const publisher = await createClient().connect();
    // публикуем сообщения клиента в канал
    socket.on('data', (data) => {
        publisher.publish('main-channel', data);
    });

    // если пользователь отключился
    socket.on('end', () => {
        subscriber.unsubscribe('main-channel');
        subscriber.end(true);
        publisher.end(true);
    });
});

server.listen(3000);
