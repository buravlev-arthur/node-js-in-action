const router = require('express').Router();
const Entry = require('../models/entry');
const { required, lengthAbove } = require('../middleware/validate');

const addEntry = (req, res, next) => {
    const data = req.body.entry;
    const { name } = res.locals.user;
    const entry = new Entry({ ...data, name });
    entry.save((err) => {
        if (err) {
            return next(err);
        }
        if (req.remoteUser) {
            res.json({ message: 'Entry added successfully' });
        } else {
            res.redirect('/');
        }
    });
};

router.get('/', (req, res) => {
    res.render('post', { title: 'Пост' });
});

// перечиляем мидлвары после пути и перед обработчиком запроса
router.post(
    '/',
    required("entry[title]"),
    lengthAbove("entry[title]", 4),
    addEntry,
);

exports.router = router;
exports.addEntry = addEntry;