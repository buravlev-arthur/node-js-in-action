const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');

const configFilename = './rss_feeds.txt';

const checkForRSSFile = () => {
  fs.stat(configFilename, (err) => {
    if (err) {
      return next(err);
    }
    next(null, configFilename);
  })
};

const readRSSFile = () => {
  fs.readFile(configFilename, (err, feedList) => {
    if (err) {
      return next(err);
    }

    const feeds = feedList.toString().trim().split('\n')
    const index = Math.floor(Math.random() * feeds.length);
    next(null, feeds[index]);
  })
};

const downloadRSSFeed = (feedUrl) => {
  request({ uri: feedUrl }, (err, res, body) => {
    if (err) {
      return next(err);
    }
    if (res.statusCode !== 200) {
      return next(new Error('Abnormal response status code'));
    }
    next(null, body);
  })
};

const parseRSSFeed = (rss) => {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);

  parser.parseComplete(rss);

  if (!handler.dom.items.length) {
    return next(new Error('No RSS items found'));
  }

  const item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
};

const tasks = [
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
];

const next = (err, result) => {
  if (err) {
    throw err;
  }

  const currentTask = tasks.shift();

  if (currentTask) {
    currentTask(result);
  }
};

next();

