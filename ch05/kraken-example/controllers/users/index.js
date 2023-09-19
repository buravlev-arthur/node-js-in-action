"use strict";

const { usersModel } = require("../../models");

module.exports = (req, res) => {
  const users = usersModel();
  const user = users.find(({ id }) => id === Number(req.params.id));
  res.render("users", user);
};
