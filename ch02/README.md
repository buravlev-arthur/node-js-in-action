# Основы программирования Node

## Модули

В объект _exports_ можно добавлять множество полей с объектами, функциями и т.п.:

```javascript
exports.toMultiply = (param1, param2) => param1 * param2;
exports.getDiff = (param1, param2) => param1 - param2;
```

Объекту _module.exports_ можно присвоить только одно экспортируемое значение:

```javascript
class CustomClass {
  // ...
}

// связываем вручную module.exports с exports, иначе между ними теряется связь
module.exports = exports = CustomClass;
```

Порядок поиска модулей:

1. Среди базовых модулей NodeJS;
2. Поиск в node_modules текущего каталога;
3. Поиск в node_modules всех родительских каталогов;
4. Поиск в каталогах, определенных в переменной окружения NODE_PATH;

Модулем может быть файл или каталог. В модуле-каталоге по-умолчанию определяется файл _index.js_, если имя файла другое, то об это нужно указать явно:

```JSON
// package.json
{
    "main": "custom_file.js"
}
```

**Пример**: test_currency.js

## Асинхронность

### Функции обратного вызова (callback)

```javascript
// Определение асинхронной функции, вызывающий callback
const doSomething = (param1, callback) => {
  setTimeout(() => {
    const newValue = param1 + 1;
    callback(err, newValue);
  }, 1000);
};

// вызыв функции с callback
doSomething(100, (err, value) => {
  if (err) {
    throw err;
  }
  console.log(`New value is: ${value}`);
});
```

**Пример**: blog_recent.js

### Генераторы событий

Серверы HTTP, TCP, сокеты (модуль "net") реализованы в NodeJS как _генераторы событий_.
Слушатель (listener) обеспечивает связь события с функцией callback для его обработки:

```javascript
// слушает событие data и выполняет функцию-обработчик callback
socket.on("data", callback);

// обработает событие единожды
socket.once("data", callback);
```

#### Создание обработчика события

```javascript
const { EventEmmiter } = require("events");

const channel = new EventEmmiter();

// слушаем событие eventName
channel.on("eventName", (param1, param2) => {
  console.log(`Event handling with params: ${param1}, ${param2}`);
});

// вызываем событие eventName
channel.emit("eventName", "value of param1", "value of param2");
```

**Примеры**:

- Эхо сервер: echo_server.js
- Чат: chat.js
- Просмотр каталога: watch_dir.js

_Примечание_: после запуска сервера (чат, эхо-сервер), для подключения к нему, в новой вкладке терминала:

```bash
telnet 127.0.0.1 8888
```

Пример сохранения значения глобальной переменной при её асинхронном использовании и изменении (замыкание): closure_for_async_action.js.

### Последовательное и параллельное выполнение

Асинхронные функции в зависимости от задач можно выполнять последовательно и параллельно.

#### Последовательное выполнение

Задачи (функции) помещаются в массив в порядке их выполнения. Каждная задача вызывает в конце функцию-обработчик,
передавая ошибку и результат выполнения:

```javascript
const task1 = () => {
  // const result = ...
  next(err, result);
};
const task2 = (result) => {
  // const result = ...
  next(err, result);
};
const task3 = (result) => {
  console.log(result);
};

const tasks = [task1, task2, task3];

const next = (err, data) => {
  if (err) {
    throw err;
  }
  const currentTask = tasks.shift();
  if (currentTask) {
    currentTask(data);
  }
};

next();
```

**Пример**: ./rss-random-output/index.js

Последовательное выполнение асинхронных функций с применением библиотки _async_:

```javascript
import async = require('async');

async.series([
    (callback) => {
        // some async actions...
        callback();
    },
    (callback) => {
        // some async actions...
        callback();
    },
    (callback) => {
        // some async actions...
        callback();
    },
]);
```

**Пример**: use-async-lib.js

#### Паралельное выполнение

Функции помещаются в массив, но порядок не важен. Каждая функция вызывает функцию обработчик,
которая накапливает счётчик выполенных функций и - когда выполнены все функции - выполняет финальное действие.

```javascript
const task1 = () => {
  // some async actions...
  checkIfComplite();
};
const task2 = () => {
  // some async actions...
  checkIfComplite();
};

const tasks = [task1, task2];

let comlitedTasks = 0;
const checIfComplite = () => {
  complitedTasks += 1;
  if (complitedTasks === tasks.length) {
    console.log("finish");
  }
};
```

**Пример**: ./frequence_of_words/word_count.js

Паралелльное выполнение асинхронных функций с применением библиотки _async_:

```javascript
const async = require("async");

async.parallel([
  (callback) => {
    // do something async...
    callback();
  },
  (callback) => {
    // do something async...
    callback();
  },
  (callback) => {
    // do something async...
    callback();
  },
]);
```

**Пример**: use-async-lib_2.js
