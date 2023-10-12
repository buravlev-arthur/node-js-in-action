const router = require('express').Router();
const User = require('../../models/user');

router.get('/:id', (req, res, next) => {
    const userID = req.params.id;

    User.getDataById(userID, (err, dbUserData) => {
        if (err) {
            return next(err);
        }

        if (!dbUserData.id) {
            return res.sendStatus(404);
        }

        res.json(dbUserData);
    });
});

module.exports = router;