const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

router.post('/', (req, res, next) => {
    const { name, password, confirm } = req.body.user;
    const passwordMinLength = 6;

    User.getByName(name, (err, dbUserData) => {
        if (err) {
            return next(err);
        }

        if (dbUserData.id) {
            res.addError(`Пользователь с именем "${name}" уже существует`);
            res.redirect('back');
        } else if (password.length < passwordMinLength) {
            res.addError(`Пароль должен быть длинее или равен ${passwordMinLength} символам`);
            res.redirect('back');
        } else if (password !== confirm) {
            res.addError(`Пароли должны совпадать`);
            res.redirect('back');
        } else {
            const user = new User({
                name,
                pass: password,
            });
            user.save((err) => {
                if (err) {
                    return next(err);
                }
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    })
});

module.exports = router;
