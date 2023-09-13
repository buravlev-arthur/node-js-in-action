const sqlite3 = require("sqlite3").verbose();

// Название БД и файла БД
const dbName = "articles.sqlite";

// Подключение к файлу базы данных
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  const sql = `
        CREATE TABLE IF NOT EXISTS articles
            (id integer primary key, title, content TEXT)
    `;
  // создание таблицы articles, если она не существует
  db.run(sql);
});

class Article {
  static all(callback) {
    db.all("SELECT * FROM articles", callback);
  }

  static find(id, callback) {
    db.get("SELECT * FROM articles WHERE id = ?", id, callback);
  }

  static create(data, callback) {
    const sql = "INSERT INTO articles(title, content) VALUES (?, ?)";
    db.run(sql, data.title, data.content, callback);
  }

  static delete(id, callback) {
    if (!id) {
      return callback(new Error("Please provide an id"));
    }
    db.run("DELETE FROM articles WHERE id = ?", id, callback);
  }
}

exports.Article = Article;
