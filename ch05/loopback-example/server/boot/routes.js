'use strict';

module.exports = (server) => {
  const router = server.loopback.Router();

  // определение маршрута на уровне Express через экземляр LoopBack Router'а
  router.get('/hello', (req, res) => {
    res.send('Hello, world!');
  });

  server.use(router);
};

