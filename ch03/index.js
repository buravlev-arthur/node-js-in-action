const express = require("express");
const bodyParser = require("body-parser");
const Article = require("./db").Article;
const read = require("node-readability");

const app = express();
app.set("port", process.env.PORT || 3000);

// поддержка Content-Type: text/json
app.use(bodyParser.json());
// поддержка Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// загрузка статического контента (css-стилей)
app.use(
  "/css/bootstrap.min.css",
  express.static("node_modules/bootstrap/dist/css/bootstrap.min.css")
);

app.get("/articles", (req, res, next) => {
  Article.all((err, articles) => {
    if (err) {
      return next(err);
    }
    res.format({
      json: () => {
        res.send(articles);
      },
      html: () => {
        res.render("articles.ejs", { articles });
      },
    });
  });
});

app.get("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err, article) => {
    if (err) {
      return next(err);
    }
    res.format({
      json: () => {
        res.send(article);
      },
      html: () => {
        res.render("article.ejs", { article });
      },
    });
  });
});

app.post("/articles", (req, res, next) => {
  const url = req.body.url;
  read(url, (err, result) => {
    if (err || !result) {
      res.status(500).send("Error downloading article");
    }

    Article.create(
      {
        title: result?.title ?? "",
        content: result?.content ?? "",
      },
      (err) => {
        if (err) {
          return next(err);
        }
        res.send("ok");
      }
    );
  });
});

app.delete("/articles/:id", (req, res, next) => {
  const id = req.params.id;
  Article.delete(id, (err) => {
    if (err) {
      return next(err);
    }
    res.send({ message: "Deleted" });
  });
});

app.listen(app.get("port"), () => {
  console.log("Express started on port", app.get("port"));
});

module.exports = app;
