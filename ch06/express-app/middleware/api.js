const express = require('express');
const User = require('../models/user');
const auth = require('basic-auth');

module.exports = () => (req, res, next) => {
    const user = auth(req);

    if (!user) {
        return res.sendStatus(401);
    }

    User.auth(user.name, user.pass, (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.remoteUser = user;
        }

        next();
    });
};
