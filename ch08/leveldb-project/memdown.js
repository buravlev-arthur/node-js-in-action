const levelup = require('levelup');
const memdown = require('memdown');
const encoding = require('encoding-down');

const db = levelup(encoding(memdown(), {
    valueEncoding: 'json',
}));

const options = {
    asBuffer: false,
};

db.put('key', { value: 'value' }, (err) => {
    if (err) throw err;
    db.get('key', options, (err, result) => {
        if (err) throw err;
        console.log(result);    
    });
});
