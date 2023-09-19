const { users } = require("./controllers");

module.exports = (router) => {
  router.get("/users/:id", users);
};
