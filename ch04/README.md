# Системы построения фронтенда

Node нашёл широкое применение во фронтенд разработке: _Gulp_, _Webpack_, транспиляторы (_Babel_), системы тестирования, генераторы карт исходного кода и фронтенд-библиотеки вроде _React_.
npm используется как на стороне фронтенда (_React_), так и на стороне бэкенда (_Express_). Есть и общие распространяемые модули, например _lodash_.

[Bower](https://bower.io/) - ещё один пакетный менеджер для фронтенда.
[Babel](https://babeljs.io/) - используется для транспиляции ES2015 в более поддерживаемый ES5.
[UglifyJS](https://github.com/mishoo/UglifyJS) - минификатор JavaScript-кода
[ESLint](https://eslint.org/) - статический анализатор кода

## Сценарии npm

```JSON
{
    "scripts": {
        "lint": "eslint src/*.js"
    }
}
```

Передать параметр в npm-сценарий:

```bash
npm run lint -- src/*.js
```

Базовые сценарии npm:

- start
- stop
- restart
- install
- postinstall (только через run: `npm run postinsall`)

Cценарии, не укладывающиеся в базовые названия запускаются через команду `run` (скоращенние от `run-script`): `npm run script`.

## Babel

Установка:

```bash
npm install --save-dev babel-cli babel-preset-es2015
```

.babelrc (в корне проекта):

```JSON
{
  "presets": ["es2015"]
}
```

Транспиляция скрипта browser.js из ES2015 в ES5:

```bash
npx babel browser.js -d dist
```

**Проект**: babel-example

## UglifyJS

Установка:

```bash
npm install --save-dev uglify-js
```

Минификация кода скрипта browser.js:

```bash
npx uglifyjs dist/browser.js -o dist/browser.min.js
```

## Способы настройки сборки фронтенда

1. Через передачу параметров в cli-команды;
2. Создание конфигурационных файлов для ESLint, Babel и т.д.;
3. Включение параметров конфигурации в package.json.

## Gulp

_Gulp_ - Система сборки на основе потока (например: транспиляция -> конкатинация -> минификация).

Установка:

```bash
npm i --save-dev gulp-cli gulp
# gulp-задачи описываются в файле:
touch gulpfile.js
# пакеты для транспиляции, конкатинации маппинга исходного кода и т.п.
npm i --save-dev gulp-babel gulp-sourcemaps gulp-concat
```

Пример общего случая построения потока сборки в Gulp:

```javascript
// gulpfile.js
const gulp = require("gulp");

gulp.task("default", () => {
  gulp
    // указываем исходные модули
    .src("src/*.jsx")
    .pipe(/* построение карт исходного кода */)
    .pipe(/* транспиляция */)
    .pipe(/* ... */)
    // указываем директорию для сборки
    .pipe(gulp.dest("dist"));
});
```

### Отслеживание изменений

Установка:

```bash
npm i --save-dev gulp-watch
```

Использование:

```javascript
const watch = require("gulp-watch");

const toBuild = () =>
  gulp.src("...").pipe(/* этап сборки */).pipe(gulp.dest("dist"));

gulp.task("default", toBuild);

gulp.task("watch", () => {
  watch("app/*.jsx", toBuild);
});
```

Для структуризации задач задачи разбиваются на модули в директории `gulp/tasks`, включатся в модуль `gulp/index.js`, который включается в `gulpfile.js`.
Дополнительно применяется модуль `gulp-help`, позволяющий писать подсказки для задач:

Установка:

```bash
npm install --save-dev gulp-help-four
```

Код:

```javascript
const gulp = require("gulp");
const help = require("gulp-help-four");
help(gulp, {});

gulp.task("default", "here is text of your tip", () => {
  /* ... */
});
```

Использование:

```bash
npx gulp help
```

_Gulp_ подходит больше для добавления в проект служебных сценариев (например, тестирование).
Для сборки фронтенд-кода, стилей и т.п. существуют специальные интрументы: _webpack_, _vite_.

**Пример использования Gulp для сборки React-проекта**: gulp-example

## Webpack

_Плагины Webpack_ - управляют процессом сборки: отправляют активы в облако, удалают дубликаты файлов и т.д. Представляют собой экземляры классов, подключаемые
к Webpack API.

_Загрузчики Webpack_ - преобразуют сами файлы. Например SASS в CSS. Представляют собой функции (преобразуют входной текст в выходной).

Установка:

```bash
npm i --save-dev webpack webpack-cli
touch webpack.config.js
```

Использование:

```bash
npx webpack --mode=production
```

### Установка загрузчика Babel для Webpack:

```bash
npm i --save-dev babel-loader
npm i --save-dev @babel/core @babel/preset-react @babel/preset-env
```

```javascript
// webpack.config.js

module.exports = {
  // ...
  rules: [
    {
      test: /.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/env", "@babel/react"],
        },
      },
    },
  ],
};
```

### dev-сервер Webpack

Установка:

```bash
npm install --save-dev webpack-dev-server
```

Конфигурация Webpack:

```javascript
// webpack.config.js

output: {
  // ...
  publicPath: "/assets/",
},

```

Запуск cервера:

```bash
npx webpack serve --hot --static dist --port 3000
```

Необходимо также создать в директории `dist` файл `index.html` с подключением необходимых статик, расположенных в `/assets/`.

### Webpack и CommonJS-модули

Webpack работает с CommonJS-модулями "из коробки". Требуется минимальная конфируция:

```javascript
// webpack.config.js

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

Благодаря этому, можно отказаться от подключения библиотек через тег `<script>` и устанавливать пакеты из _npm_ с импортированием их в модули проекта с помощью `require('...')`.

- Список загрузчиков webpack: https://webpack.js.org/loaders/
- Список плагинов webpack: https://webpack.js.org/plugins/

**Пример конфигурации webpack**: webpack.config.js
