const { createClient } = require('redis');

const app = async () => {
    // На локальной машине с портом по умолчанию 
    // можно не передавать параметры
    const client = await createClient();

    // слушатели событий
    client.on('connect', () => console.log('Redis client connected to server'));
    client.on('ready', () => console.log('Redis server is ready'));
    // с определенным обработчиком события error
    // Redis будет пытаться восстановить подключение
    client.on('error', (err) => console.log('Redis error: ', err));

    await client.connect();

    // установка и получение значения по ключу
    await client.set('color', 'red');
    const value = await client.get('color');
    console.log(value);

    // проверка на существование ключа
    const keyIsExists = await client.exists('color');
    console.log(keyIsExists); // 1

    // создание хэша
    await client.hSet('food', {
        name: 'cookie',
        type: 'with milk',
    });

    // получение значений из хэша
    const values = await client.hmGet('food', ['name', 'type']);
    console.log(values);

    // получение всех ключей хэша
    const hashKeys = await client.hKeys('food');
    console.log(hashKeys);

    // добавление элементов в список
    await client.lPush('tasks', 'taks one');
    await client.lPush('tasks', 'task two');

    // извлечение всех элементов списка
    const listElements = await client.lRange('tasks', 0, -1);
    console.log(listElements);

    // добавление элементов в множество
    await client.sAdd('clients', 'Alice');
    await client.sAdd('clients', 'Bob');
    await client.sAdd('clients', 'Alice'); // только уникальные значения

    // вывод элементов множества
    const setElements = await client.sMembers('clients');
    console.log(setElements);

    // отключение от сервера
    client.disconnect();
};

app();
