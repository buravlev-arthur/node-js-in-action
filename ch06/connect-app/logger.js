module.exports = (format) => {
    const regexp = /:(\w+)/g;

    return createLogger = (req, res, next) => {
        /**
         * regexp - регулярное выражение для искомых подстрок
         * match - найденная подстрока
         * property - часть найденой подстроки, соответcтвующая шаблону в группе регулярного выражения: (\w+)
         */
        const str = format.replace(regexp, (match, property) => {
            return req[property];
        });

        console.log(str);
        next();
    }
};
