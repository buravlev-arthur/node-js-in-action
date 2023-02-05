const Watcher = require('./WatcherClass');
const fs = require('fs');

const watchDir = './watchDir';
const processedDir = './processedDir';

const watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function(file) {
  const watchFile = `${this.watchDir}/${file}`;
  const processedFile = `${this.processedDir}/${file.toLowerCase()}`;

  fs.rename(watchFile, processedFile, err => {
    if (err) {
      console.log('Error white rename file: ', err);
      throw err;
    }
  });
});

watcher.start();