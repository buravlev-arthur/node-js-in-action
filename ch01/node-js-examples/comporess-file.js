const fs = require('fs');
const zlib = require('zlib');

const gzip = zlib.createGzip();
const outStream = fs.createWriteStream('output.js.gz');

// поток чтения -> поток сжатия -> поток записи
fs.createReadStream('./hello.js')
  .pipe(gzip)
  .pipe(outStream);


