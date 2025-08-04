module.exports = (req, res, next) => {
    if (res.locals.data && res.locals.data.token) {
        res.locals.token = res.locals.data.token;
    }
    next();
};
