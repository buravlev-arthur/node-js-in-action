const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const getEntries = () => {
    const entriesFileData = fs.readFileSync(`${__dirname}/entries.txt`, 'utf-8');
    const entriesRaw = entriesFileData.split('---');
    const entries = entriesRaw.map((entryRaw) => entryRaw
        .split('\n')
        .filter((line) => line.length)
        .reduce((entry, line) => {
            if (line.indexOf(': ') !== -1) {
                const [ name, value ] = line.split(': ');
                return { ...entry, [name]: value };
            }
            return { ...entry, body: line };
        }, {}));
    return entries;
}

// Визуализация без шаблона
const generateCustomTemplate = (entries) => {
    let output = `
        <html>
        <head>
            <style type="text/css">
                .entry_title { font-weight: bold; }
                .entry_date { font-style: italic; }
                .entry_body { margin-bottom: 1em; }
            </style>
        </head>
        <body>
    `;

    entries.forEach((entry) => {
        output += `
            <div class="entry_title">${entry.title}</div>
            <div class="entry_date">${entry.date}</div>
            <div class="entry_body">${entry.body}</div>
        `;
    });

    output += '</body></html>';
    return output;
};

// Визуализация с шаблоном (EJS)
const generateEjsTemplate = (entries) => {
    const template = fs.readFileSync(`${__dirname}/blog_page.ejs`, 'utf-8');
    const output = ejs.render(template, { entries });
    return output;
}

const server = http.createServer((req, res) => {
    const entries = getEntries();
    const output = generateEjsTemplate(entries);
    res.writeHead(200, {
        'Content-Type': 'text/html',
    });
    res.end(output);
});
server.listen(3000);