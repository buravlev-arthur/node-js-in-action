const router = require('express').Router();
const Entry = require('../models/entry');

router.get('/', (req, res, next) => {
    Entry.getRange(0, -1, (err, entries) => {
        if (err) {
            return next(err);
        }
        res.render('entries', {
            title: 'Записи',
            entries,
        });
    });
});

module.exports = router;
