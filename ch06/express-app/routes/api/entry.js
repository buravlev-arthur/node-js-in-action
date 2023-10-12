const router = require('express').Router();
const addEntry = require('../../routes/posts').addEntry;
const page = require('../../middleware/page');
const Entry = require('../../models/entry');

router.get('/entries/:page', page(), (req, res, next) => {
    const { from, to } = req.page;

    Entry.getRange(from, to, (err, entries) => {
        if (err) {
            return next(err);
        }

        res.format({
            json: () => {
                res.json(entries);
            },
            xml: () => {
               res.render('entries/xml', { entries });
            }
        });
    });
});

router.post('/entry', addEntry);

module.exports = router;