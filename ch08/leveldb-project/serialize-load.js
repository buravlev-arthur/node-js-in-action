const bytes = require('bytes');

const obj = {};
for (let i = 0; i < 200000; i += 1) {
    obj[i] = {
        [Math.random()]: Math.random()
    } 
};

console.time('serialize');
const jsonStr = JSON.stringify(obj);
console.timeEnd('serialize');

const bytesLength = bytes(Buffer.byteLength(jsonStr));
console.log('Serialized size: ', bytesLength);

console.time('deserialize');
const objCopy = JSON.parse(jsonStr);
console.timeEnd('deserialize');
