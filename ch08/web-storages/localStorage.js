// сохранение и получение JSON-данных
const data = {
    arr: [1, 2, 3]
};

localStorage.setItem('key', JSON.stringify(data));
console.log(JSON.parse(localStorage.getItem('key')));

// формирование объекта с парами ключ-значение localStorage
const storageKeys = Object.keys(localStorage);
const storageData = storageKeys.reduce((obj, key) => {
    obj[key] = localStorage.getItem(key);
    return obj;
}, {});
console.log(storageData);

// пространства имен
const user = {
    id: 0,
    name: 'John',
    email: 'test@test.com'
};

const comment = {
    id: 0,
    text: 'Comment text',
    createdAt: new Date().getTime(),
};

localStorage.setItem(`/users/${user.id}`, JSON.stringify(user));
localStorage.setItem(`/comments/${comment.id}`, JSON.stringify(comment));

const getKeysByNamespace = (namespace) => {
    return Object.keys(localStorage)
        .filter((key) => key.includes(namespace));
};

console.log('users keys:', getKeysByNamespace('users'));
console.log('comments keys:', getKeysByNamespace('comments'));

// мемоизация затратной операции

const expensiveWork = (data) => {
    // любая более затратная и сложная операция над данными
    return JSON.stringify(data);
};

const memoizeOpeartion = (data) => {
    const key = `/memoized/${JSON.stringify(data)}`;
    if (localStorage.getItem(key)) {
        return localStorage.getItem(key);
    }
    const result = expensiveWork(data);
    localStorage.setItem(key, result);
    return result;
}

// первичное выполнение затратной операции
// и сохранение результата в localStorage
console.time('operation');
memoizeOpeartion({ data: 'data' });
console.timeEnd('operation');

// получение готового результата операции из localStorage
console.time('fetching');
memoizeOpeartion({ data: 'data' });
console.timeEnd('fetching');
