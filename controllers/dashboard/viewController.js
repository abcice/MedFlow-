const viewController = {
    // Render the dashboard page
    index(req, res) {
        res.render('dashboard/Dashboard', {
            token: res.locals.data.token,
            user: req.user
        });
    },

    // Redirect here after login
    redirectHome(req, res) {
        res.redirect(`/dashboard?token=${res.locals.data.token}`);
    }
};

module.exports = viewController;
