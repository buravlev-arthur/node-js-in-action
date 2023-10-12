const router = require('express').Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login', { title: 'Вход' });
});

router.post('/login', (req, res, next) => {
    const { name, password } = req.body.user;
    
    User.auth(name, password, (err, dbUserData) => {
        if (err) {
            return next(err);
        }

        if (dbUserData) {
            req.session.uid = dbUserData.id;
            res.redirect('/');
        } else {
            res.addError('Неверные логин и/или пароль');
            res.redirect('back');
        }
    });
});

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
});

module.exports = router;