const pathsNeedAuth = [
    '/post',
    '/logout',
];
const pathsNeedNotAuth = [
    '/login',
    '/register',
];

module.exports = () => (req, res, next) => {
    const isLogged = !!req.session.uid; 
    const { path } = req;

    if (
        isLogged && pathsNeedNotAuth.includes(path) ||
        !isLogged && pathsNeedAuth.includes(path)
    ) {
        return res.redirect('/');
    }

    next();
};
