const http = require('http');
const fs = require('fs');

http.createServer(async (req, res) => {
  getTitles(res);
}).listen(8080, () => {
  console.log('Server is running on: http://localhost:8080');
});

const getTitles = (res) => {
  fs.readFile('./titles.json', (err, data) => {
    if (err) {
      return handleError(err);
    }

    getTemplate(JSON.parse(data), res);
  });
}

const getTemplate = (titles, res) => {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      return handleError(err);
    }

    formatHtml(titles, data.toString(), res);
  });
};

const formatHtml = (titles, template, res) => {
  const formatedHtml = template.replace('%', titles.join('</li><li>'));
  getResponse(formatedHtml, res);
};

const getResponse = (html, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
};

const handleError = (err) => {
  console.log(err);
  res.end('Server Error');
}