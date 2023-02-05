const fs = require('fs');
const { EventEmitter } = require('events');

class Watcher extends EventEmitter {
  constructor(watchDir, processedDir) {
    super();
    this.watchDir = watchDir;
    this.processedDir = processedDir;
  }

  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) {
        console.log('Error while read  watch dir: ', err);
        throw err;
      }
      files.forEach(file => this.emit('process', file));
    });
  }

  start() {
    fs.watchFile(this.watchDir, () => {
      this.watch();
    });
  }
}

module.exports = Watcher;
