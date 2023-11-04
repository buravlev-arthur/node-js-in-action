// const localforage = require("localforage");

// порядок используемых хранилищ (localStorage не использовать)
localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL]);

localforage.setItem('key', 'value').then(() => {
    localforage.getItem('key').then((value) => {
        console.log(value);
    });
});


// хранение различных типов данных
Promise.all([
    localforage.setItem('object', { prop: 'value' }),
    localforage.setItem('number', 1),
    localforage.setItem('binary', new ArrayBuffer([1, 2, 3]))
]).then(() => {
    localforage.iterate((value, key) => {
        console.log(`${key}: ${value}`);
    })
});
