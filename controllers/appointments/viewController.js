const viewController = {
    index(req, res) {
        res.render('appointments/Index', {
            appointments: res.locals.data.appointments,
            token: res.locals.data.token
        });
    },
    newView(req, res) {
        res.render('appointments/New', { token: res.locals.data.token });
    },
    redirectHome(req, res) {
        res.redirect(`/appointments?token=${res.locals.data.token}`);
    }
};

module.exports = viewController;
