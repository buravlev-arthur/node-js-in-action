const async = require('async');
const { exec } = require('child_process');

const downloadNodeVersion = (version, destination, callback) => {
  const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`;
  const filepath = `${destination}/${version}.tgz`;
  exec(`curl ${url} > ${filepath}`, callback);
};

async.series([
  callback => {
    async.parallel([
      callback => {
        console.log('Downloading Node v4.4.7...');
        downloadNodeVersion('4.4.7', './tmp', callback);
      },
      callback => {
        console.log('Downloading Node v6.3.0...');
        downloadNodeVersion('6.3.0', './tmp', callback);
      }
    ], callback);
  },
  callback => {
    console.log('Creating tar-archive...');
    exec(`tar cvf node_dists.tar ./tmp/4.4.7.tgz ./tmp/6.3.0.tgz`, err => {
      if (err) {
        throw err;
      }

      console.log('Done!');
      callback();
    });
  }
]);
