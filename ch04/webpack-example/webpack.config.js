const path = require("path");

module.exports = {
  // входной файл
  entry: "./app/index.jsx",

  // выходной файл
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    // путь к статике, доступной в html (изображения, скрипты, стили и т.п.)
    publicPath: "/assets/",
  },

  // режим сборки: production или development
  mode: process.argv.mode || "development",

  module: {
    // загрузчики
    rules: [
      {
        test: /.jsx?$/, // находит все .js и .jsx модули
        exclude: /node_modules/, // директория, где поиск не нужен
        use: {
          // имя загрузчика
          loader: "babel-loader",
          // конфигурация загрузчика
          options: {
            presets: ["@babel/env", "@babel/react"],
          },
        },
      },
    ],
  },
};
