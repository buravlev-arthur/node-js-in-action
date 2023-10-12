const Entry = require('../models/entry');

module.exports = (countPerPage = 10) => {
    return (req, res, next) => {
        const pageNumber = Math.max(Number(req.params.page) ?? 1, 1) - 1;

        Entry.getCount((err, countOfEntries) => {
            if (err) {
                return next(err);
            }

            req.page = res.locals.page =  {
                pageNumber,
                countPerPage,
                from: pageNumber * countPerPage,
                to: pageNumber * countPerPage + countPerPage - 1,
                countOfEntries,
                countOfPages: Math.ceil(countOfEntries / countPerPage),
            }

            next();
        });
    }
};
