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
    schedule(req, res) {
    res.render('appointments/Schedule', {
        doctors: res.locals.data.doctors,
        appointments: res.locals.data.appointments,
        selectedDate: res.locals.data.selectedDate,
        selectedDoctor: res.locals.data.selectedDoctor,
        token: res.locals.data.token
    });
},


    redirectHome(req, res) {
        res.redirect(`/appointments?token=${res.locals.data.token}`);
    },

    edit(req, res) {
        res.render('appointments/Edit', {
            appointment: res.locals.data.appointment,
            token: res.locals.data.token,
            doctors: res.locals.data.doctors
        });
    }
};


module.exports = viewController;
