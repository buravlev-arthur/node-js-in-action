module.exports = () => (req, res, next) => {
    // добавление сообщения в очередь
    res.addMessage = (text, type = 'info') => {
        req.session.messages = req.session.messages || [];
        req.session.messages.push({ type, text });
    };

    // добавление сообщения типа "ошибка"
    res.addError = (text) => res.addMessage(text, 'danger');

    // удаление всех сообщений
    res.removeMessages = () => {
        req.session.messages = [];
    }

    // отдаём во все шаблоны массив сообщений и функцию очистки сообщений
    res.locals.messages = req.session.messages || [];
    res.locals.removeMessages = res.removeMessages;

    next();
};
