var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const messages = require('./middleware/messages');
const user = require('./middleware/user');
const authControl = require('./middleware/authControl');
const apiAuth = require('./middleware/api');

var postsRouter = require('./routes/posts').router;
const entriesRouter = require('./routes/entries');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userApi = require('./routes/api/user');
const entryApi = require('./routes/api/entry');

var app = express();

// Методы для работы с окружением

// аналог app.set('proxy server', true):
app.enable('proxy server'); 

// аналог app.set('email server', false):
app.disable('file server');

// console.log(app.get('proxy server'));
// аналоги app.get() для логических настроек:
// console.log(app.enabled('proxy server'));
// console.log(app.disabled('proxy server'));

// Настройка отступов JSON:
app.set('json spaces', 2);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// отключение кэширования шаблонов в режиме разработки
if (app.get('env') === 'development') {
  app.set('view cache', false);
}

// передача данных в шаблон через app.locals.settings и app.locals
app.set('data', 'value'); // <%= settings.data %>
app.locals.text = 'text'; // <%= text %>

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// конфигурация сессии
app.use(session({
  // Применяется для подписи cookie: Session ID
  secret: process.env.SESSION_SECRET,
  // запрет на пересохранение сессии в хранилище, даже если не было изменений
  resave: false,
  // запрет на сохранение новой сессии/сессии без изменений в хранилище
  saveUninitialized: true,  
}));

// подключаем функционал сессионных сообщений
app.use(messages());
// проверка имени пользователя и пароля, переданных через BasicAuth
// применяемая только для запросов с маршрутом /api/...
app.use('/api', apiAuth());
// реализуем получение из Redis и сохранение данных пользователя в сессии
app.use(user());
// контролируем доступ к маршрутам
app.use(authControl());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', entriesRouter);
app.use('/post', postsRouter);
app.use('/register', registerRouter);
app.use('/', loginRouter);
app.use('/api/user', userApi);
app.use('/api', entryApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
