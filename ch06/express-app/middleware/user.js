const User = require('../models/user');

module.exports = () => (req, res, next) => {
    const uid = req.session.uid;
    if (uid) {
        User.getDataById(uid, (err, dbUserData) => {
            if (err) {
                return next(err);
            }

            // в req.user традиционно для Express сохраняем данные о пользователе
            // в res.locals.user сохраняем эти же данные для доступа к ним в представлениях
            req.user = res.locals.user = dbUserData;
            next();
        });
    } else {
        next();
    }
};
