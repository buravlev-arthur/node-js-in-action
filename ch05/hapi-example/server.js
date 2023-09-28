const path = require("path");
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");

const initServer = async () => {
  const port = process.argv.port || process.env.PORT || 8080;

  const server = Hapi.Server({
    port: port,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public"),
      },
    },
  });

  await server.register(Inert);

  // обычный маршрут - обработчик получает функцию
  server.route({
    method: "GET",
    path: "/",
    handler: (request, handler) => {
      return `<p>It's Root route page</p> \n \
      <p>A static file served by server: <a href="/hello.html">public/hello.html</a> \
      </p>`;
    },
  });

  // маршрут, где обработчик получает конфигурацию для плагина inert
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: ".",
        redirectToSlash: true,
        index: true,
      },
    },
  });

  // реализация REST API
  server.route({
    method: "DELETE",
    path: "/items/{id}",
    handler: (request, handler) => {
      return `The item with id: ${request.params.id} was successfully deleted`;
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

initServer();
