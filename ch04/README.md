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

### Пример использования Babel

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

### Пример использования UglifyJS

Установка:

```bash
npm install --save-dev uglify-js
```

Минификация кода скрипта browser.js:

```bash
npx uglifyjs dist/browser.js -o dist/browser.min.js
```

### Способы настройки сборки фронтенда

1. Через передачу параметров в cli-команды;
2. Создание конфигурационных файлов для ESLint, Babel и т.д.;
3. Включение параметров конфигурации в package.json.
