const router = require('express').Router();
const Entry = require('../models/entry');
const { required, lengthAbove } = require('../middleware/validate');

router.get('/', (req, res) => {
    res.render('post', { title: 'Пост' });
});

// перечиляем мидлвары после пути и перед обработчиком запроса
router.post(
    '/',
    required("entry[title]"),
    lengthAbove("entry[title]", 4),
    (req, res, next) => {
        const data = req.body.entry;
        const username = res.locals?.user?.username ?? null;
        const entry = new Entry({ ...data, username });
        entry.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }
);

module.exports = router;