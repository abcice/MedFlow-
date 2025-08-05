const Patient = require('../../models/patient');

const viewController = {
    showHistory(req, res) {
        const { patient, records = [], token, currentUser = null } = res.locals.data;

       const filteredRecords = records.map(record => {
    const canViewPrivateNote =
        currentUser &&
        currentUser.role === 'Doctor' &&
        record.doctor &&
        record.doctor._id.toString() === currentUser._id.toString();

    if (!canViewPrivateNote) {
        record.privateNote = undefined; // plain object, safe to modify
    }
    return record;
});

        res.render('patientRecords/Show', { patient, records: filteredRecords, token });
    },

    async newView(req, res) {
        try {
            const patient = await Patient.findById(req.params.patientId);
            if (!patient) return res.status(404).send('Patient not found');

            res.render('patientRecords/New', {
                patient,
                token: res.locals.data.token,
                currentUser: req.user,
                favoritePrescriptions: []
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    redirectToHistory(req, res) {
        res.redirect(`/patientRecords/${req.body.patient}/history?token=${res.locals.data.token}`);
    },

    history(req, res) {
        res.render('patients/History', {
            patient: res.locals.data.patient,
            records: res.locals.data.records,
            token: res.locals.data.token
        });
    },

    editView(req, res) {
        res.render('patientRecords/Edit', {
            patient: res.locals.data.patient,
            record: res.locals.data.record,
            token: res.locals.data.token,
            currentUser: res.locals.data.currentUser
        });
    },

    index(req, res) {
        res.render('patientRecords/Index', {
            patients: res.locals.data.patients,
            token: res.locals.data.token
        });
    },

    async newRequestView(req, res) {
        try {
            const patient = await Patient.findById(req.params.patientId);
            if (!patient) return res.status(404).send('Patient not found');

            res.render('patientRecords/NewRequest', {
                patient,
                token: res.locals.data.token,
                type: req.query.type,
                currentUser: req.user
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    redirectToNewRecord(req, res) {
        res.redirect(`/patientRecords/${req.params.patientId}/history/new?token=${req.query.token}`);
    }
};

module.exports = viewController;
