const koa = require("koa");
const Router = require("koa-router");

const app = new koa();
const router = new Router();
const port = process.argv.port || 3000;

router
  .get("/pages", (ctx, next) => {
    ctx.body = "All pages";
  })
  .get("page-by-id", "/pages/:id", (ctx, next) => {
    const id = ctx.params.id;
    ctx.body = `Id of the page: ${id}`;
  })
  .get("redirect-page", "/redirect", (ctx, next) => {
    ctx.redirect(router.url("page-by-id", "0"));
  });

app.use(router.routes());

app.listen(port, () => {
  console.log("Koa started at http://localhost:3000");
});
