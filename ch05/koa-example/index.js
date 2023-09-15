const koa = require("koa");

const app = new koa();
const port = process.argv.port || 3000;

app.use(function* (next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log("%s %s - %s", this.method, this.url, ms);
});

app.use(function* () {
  this.body = "Hello, World!";
});

app.listen(process.argv.port || 3000, () => {
  console.log("Koa started at http://localhost:3000");
});
