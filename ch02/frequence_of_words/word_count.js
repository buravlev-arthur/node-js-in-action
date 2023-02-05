const fs = require('fs');

const tasks = [];
let completedTasks = 0;
const wordCounts = {};
const dir = './text';

const checkIfComplete = () => {
  completedTasks += 1;

  if (completedTasks === tasks.length) {
    Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([word, count]) => {
        console.log(`${word}: ${count}`)
      });
  }
}

const addWordCount = (word) => {
  wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
}

const countWordsInText = (text) => {
  const words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();

  words
    .filter(word => word && word.length)
    .forEach(word => addWordCount(word));
}

fs.readdir(dir, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach(file => {
    const task = (file => {
      return () => {
        fs.readFile(file, (err, text) => {
          if (err) {
            throw err;
          }
          countWordsInText(text);
          checkIfComplete();
        })
      }
    })(`${dir}/${file}`);

    tasks.push(task);
  });

  tasks.forEach(task => task());
})

