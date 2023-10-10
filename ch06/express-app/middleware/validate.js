const parseField = (field) => field
    .split(/\[|\]/)
    .filter((str) => str.length);

const getField = (req, fields) => {
    let val = req.body;
    fields.forEach((prop) => {
        val = val[prop];
    });
    return val;
};

// мидлвара для проверки существования свойства в теле запроса
exports.required = (field) => {
    return (req, res, next) => {
        const value = getField(req, parseField(field));

        if (value) {
            next();
        } else {
            console.error(`Field "title" is required`);
            res.redirect('back');
        }
    }
};

// мидлвара для проверки длины текста
exports.lengthAbove = (field, len) => {
    return (req, res, next) => {
        const value = getField(req, parseField(field));

        if (value.length > len) {
            next();
        } else {
            console.error(`Field "title" must be longer than ${len}`);
            res.redirect('back');
        }
    }
};
